import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleCloudService } from './gcp.js';

export interface VideoCompressionOptions {
  inputPath?: string;
  inputBuffer?: Buffer;
  outputDir: string;
  movieId: string;
  qualities: string[];
  deleteOriginal?: boolean;
}

export interface CompressionResult {
  success: boolean;
  outputs: Array<{
    quality: string;
    path: string;
    size: number;
    url?: string;
  }>;
  error?: string;
}

export class VideoCompressionService {
  private static readonly QUALITY_SETTINGS = {
    '360p': {
      width: 640,
      height: 360,
      bitrate: '800k',
      audioBitrate: '64k'
    },
    '480p': {
      width: 854,
      height: 480,
      bitrate: '1200k',
      audioBitrate: '96k'
    },
    '720p': {
      width: 1280,
      height: 720,
      bitrate: '2500k',
      audioBitrate: '128k'
    },
    '1080p': {
      width: 1920,
      height: 1080,
      bitrate: '5000k',
      audioBitrate: '192k'
    }
  };

  // Compress video to multiple qualities
  static async compressVideoToQualities(options: VideoCompressionOptions): Promise<CompressionResult> {
    try {
      console.log(`🎬 Starting video compression for movie: ${options.movieId}`);
      
      const outputs: CompressionResult['outputs'] = [];
      const tempDir = path.join(options.outputDir, 'temp');
      
      // Ensure output directory exists
      await fs.mkdir(options.outputDir, { recursive: true });
      await fs.mkdir(tempDir, { recursive: true });

      // If buffer is provided, write to temp file first
      let inputPath = options.inputPath;
      if (options.inputBuffer && !options.inputPath) {
        inputPath = path.join(tempDir, `${options.movieId}-original.mp4`);
        await fs.writeFile(inputPath, options.inputBuffer);
      }

      if (!inputPath) {
        throw new Error('Either inputPath or inputBuffer must be provided');
      }

      // Get video metadata
      const metadata = await this.getVideoMetadata(inputPath);
      console.log(`📹 Video metadata:`, {
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        bitrate: metadata.bitrate
      });

      // Process each quality
      for (const quality of options.qualities) {
        try {
          const output = await this.compressToQuality(inputPath, options.movieId, quality, options.outputDir);
          outputs.push(output);
          console.log(`✅ Compressed ${quality}: ${output.size} bytes`);
        } catch (error) {
          console.error(`❌ Failed to compress ${quality}:`, error);
        }
      }

      // Upload to Google Cloud Storage
      for (const output of outputs) {
        try {
          const buffer = await fs.readFile(output.path);
          const fileName = `${options.movieId}-${output.quality}.mp4`;
          const uploadResult = await GoogleCloudService.uploadMovie(fileName, buffer, {
            customMetadata: {
              movieId: options.movieId,
              quality: output.quality,
              originalSize: buffer.length.toString()
            }
          });
          output.url = uploadResult.url;
          console.log(`☁️  Uploaded ${output.quality} to GCS: ${output.url}`);
        } catch (error) {
          console.error(`❌ Failed to upload ${output.quality}:`, error);
        }
      }

      // Cleanup temp files
      try {
        if (options.inputBuffer && inputPath.includes('temp')) {
          await fs.unlink(inputPath);
        }
        
        for (const output of outputs) {
          await fs.unlink(output.path);
        }
        
        await fs.rmdir(tempDir).catch(() => {}); // Ignore if not empty
      } catch (error) {
        console.warn('Cleanup warning:', error);
      }

      return {
        success: true,
        outputs
      };

    } catch (error) {
      console.error('Video compression failed:', error);
      return {
        success: false,
        outputs: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Compress single video to specific quality
  private static async compressToQuality(
    inputPath: string, 
    movieId: string, 
    quality: string, 
    outputDir: string
  ): Promise<CompressionResult['outputs'][0]> {
    const settings = this.QUALITY_SETTINGS[quality as keyof typeof this.QUALITY_SETTINGS];
    if (!settings) {
      throw new Error(`Unsupported quality: ${quality}`);
    }

    const outputPath = path.join(outputDir, `${movieId}-${quality}.mp4`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(`${settings.width}x${settings.height}`)
        .videoBitrate(settings.bitrate)
        .audioBitrate(settings.audioBitrate)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mp4')
        .outputOptions([
          '-preset fast',
          '-crf 23',
          '-movflags +faststart', // Enable progressive download
          '-pix_fmt yuv420p'
        ])
        .on('start', (commandLine) => {
          console.log(`🔄 FFmpeg command: ${commandLine}`);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`⏳ ${quality} compression progress: ${Math.round(progress.percent)}%`);
          }
        })
        .on('end', async () => {
          try {
            const stats = await fs.stat(outputPath);
            resolve({
              quality,
              path: outputPath,
              size: stats.size
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        })
        .save(outputPath);
    });
  }

  // Get video metadata
  private static async getVideoMetadata(inputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (error, metadata) => {
        if (error) {
          reject(error);
        } else {
          const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
          resolve({
            duration: metadata.format.duration,
            bitrate: metadata.format.bit_rate,
            width: videoStream?.width,
            height: videoStream?.height,
            codec: videoStream?.codec_name,
            streams: metadata.streams.length
          });
        }
      });
    });
  }

  // Generate video thumbnail
  static async generateThumbnail(
    inputPath: string, 
    outputPath: string, 
    timeOffset: string = '00:00:10'
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: [timeOffset],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '320x240'
        })
        .on('end', () => {
          console.log('✅ Thumbnail generated successfully');
          resolve(true);
        })
        .on('error', (error) => {
          console.error('❌ Thumbnail generation failed:', error);
          reject(error);
        });
    });
  }

  // Extract video frame at specific time
  static async extractFrame(
    inputPath: string,
    outputPath: string,
    timeOffset: string,
    width: number = 1280,
    height: number = 720
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .seekInput(timeOffset)
        .frames(1)
        .size(`${width}x${height}`)
        .format('png')
        .on('end', () => {
          resolve(true);
        })
        .on('error', (error) => {
          reject(error);
        })
        .save(outputPath);
    });
  }

  // Validate video file
  static async validateVideo(inputPath: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const metadata = await this.getVideoMetadata(inputPath);
      
      // Basic validation checks
      if (!metadata.duration || metadata.duration < 1) {
        return { valid: false, error: 'Video duration too short or invalid' };
      }
      
      if (!metadata.width || !metadata.height) {
        return { valid: false, error: 'Invalid video dimensions' };
      }

      if (metadata.width < 320 || metadata.height < 240) {
        return { valid: false, error: 'Video resolution too low (minimum 320x240)' };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown validation error' 
      };
    }
  }

  // Get optimal compression settings based on input video
  static async getOptimalSettings(inputPath: string): Promise<string[]> {
    try {
      const metadata = await this.getVideoMetadata(inputPath);
      const qualities: string[] = [];

      // Add qualities based on input resolution
      if (metadata.height >= 360) qualities.push('360p');
      if (metadata.height >= 480) qualities.push('480p');
      if (metadata.height >= 720) qualities.push('720p');
      if (metadata.height >= 1080) qualities.push('1080p');

      return qualities.length > 0 ? qualities : ['480p']; // Fallback
    } catch (error) {
      console.error('Error getting optimal settings:', error);
      return ['480p', '720p']; // Safe defaults
    }
  }
}

export default VideoCompressionService;