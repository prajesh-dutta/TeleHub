import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleCloudService } from './gcp.js';

export interface ImageOptimizationOptions {
  inputPath?: string;
  inputBuffer?: Buffer;
  outputDir: string;
  filename: string;
  formats: string[];
  sizes: Array<{ width: number; height?: number; name: string }>;
  quality?: number;
  watermark?: {
    text?: string;
    imagePath?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  };
}

export interface OptimizationResult {
  success: boolean;
  outputs: Array<{
    format: string;
    size: string;
    path: string;
    fileSize: number;
    url?: string;
    dimensions: { width: number; height: number };
  }>;
  error?: string;
}

export class ImageOptimizationService {
  private static readonly DEFAULT_QUALITY = 85;
  private static readonly DEFAULT_SIZES = [
    { width: 320, height: 180, name: 'small' },
    { width: 640, height: 360, name: 'medium' },
    { width: 1280, height: 720, name: 'large' },
    { width: 1920, height: 1080, name: 'xlarge' }
  ];

  // Optimize images to multiple formats and sizes
  static async optimizeImage(options: ImageOptimizationOptions): Promise<OptimizationResult> {
    try {
      console.log(`🖼️  Starting image optimization for: ${options.filename}`);
      
      const outputs: OptimizationResult['outputs'] = [];
      const tempDir = path.join(options.outputDir, 'temp');
      
      // Ensure output directory exists
      await fs.mkdir(options.outputDir, { recursive: true });
      await fs.mkdir(tempDir, { recursive: true });

      // Get input buffer
      let inputBuffer = options.inputBuffer;
      if (!inputBuffer && options.inputPath) {
        inputBuffer = await fs.readFile(options.inputPath);
      }

      if (!inputBuffer) {
        throw new Error('Either inputPath or inputBuffer must be provided');
      }

      // Get image metadata
      const metadata = await sharp(inputBuffer).metadata();
      console.log(`📊 Image metadata:`, {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      });

      // Process each format and size combination
      for (const format of options.formats) {
        for (const size of options.sizes) {
          try {
            const output = await this.processImageVariant(
              inputBuffer,
              options.filename,
              format,
              size,
              options.outputDir,
              options.quality || this.DEFAULT_QUALITY,
              options.watermark
            );
            outputs.push(output);
            console.log(`✅ Processed ${format} ${size.name}: ${output.fileSize} bytes`);
          } catch (error) {
            console.error(`❌ Failed to process ${format} ${size.name}:`, error);
          }
        }
      }

      // Upload to Google Cloud Storage
      for (const output of outputs) {
        try {
          const buffer = await fs.readFile(output.path);
          const fileName = path.basename(output.path);
          const uploadResult = await GoogleCloudService.uploadMovie(`images/${fileName}`, buffer, {
            contentType: `image/${output.format}`,
            customMetadata: {
              originalName: options.filename,
              format: output.format,
              size: output.size,
              optimized: 'true'
            }
          });
          output.url = uploadResult.url;
          console.log(`☁️  Uploaded ${fileName} to GCS: ${output.url}`);
        } catch (error) {
          console.error(`❌ Failed to upload ${output.format} ${output.size}:`, error);
        }
      }

      // Cleanup temp files
      try {
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
      console.error('Image optimization failed:', error);
      return {
        success: false,
        outputs: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Process single image variant
  private static async processImageVariant(
    inputBuffer: Buffer,
    filename: string,
    format: string,
    size: { width: number; height?: number; name: string },
    outputDir: string,
    quality: number,
    watermark?: ImageOptimizationOptions['watermark']
  ): Promise<OptimizationResult['outputs'][0]> {
    const name = path.parse(filename).name;
    const outputFilename = `${name}-${size.name}.${format}`;
    const outputPath = path.join(outputDir, outputFilename);

    let pipeline = sharp(inputBuffer)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'center'
      });

    // Apply format-specific optimizations
    switch (format) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ 
          quality,
          progressive: true,
          mozjpeg: true
        });
        break;
      case 'webp':
        pipeline = pipeline.webp({ 
          quality,
          effort: 4
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({ 
          quality,
          effort: 4
        });
        break;
      case 'png':
        pipeline = pipeline.png({ 
          compressionLevel: 8,
          adaptiveFiltering: true
        });
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Apply watermark if specified
    if (watermark) {
      pipeline = await this.applyWatermark(pipeline, watermark, size.width, size.height);
    }

    // Process and save
    const outputBuffer = await pipeline.toFile(outputPath);
    const stats = await fs.stat(outputPath);

    return {
      format,
      size: size.name,
      path: outputPath,
      fileSize: stats.size,
      dimensions: {
        width: outputBuffer.width,
        height: outputBuffer.height
      }
    };
  }

  // Apply watermark to image
  private static async applyWatermark(
    pipeline: sharp.Sharp,
    watermark: ImageOptimizationOptions['watermark'],
    imageWidth: number,
    imageHeight?: number
  ): Promise<sharp.Sharp> {
    if (!watermark) return pipeline;

    if (watermark.text) {
      // Text watermark
      const position = this.getWatermarkPosition(watermark.position, imageWidth, imageHeight);
      const svgText = this.createTextWatermarkSvg(watermark.text, imageWidth);
      const textBuffer = Buffer.from(svgText);
      
      return pipeline.composite([{
        input: textBuffer,
        ...position,
        blend: 'over'
      }]);
    }

    if (watermark.imagePath) {
      // Image watermark
      const watermarkBuffer = await fs.readFile(watermark.imagePath);
      const position = this.getWatermarkPosition(watermark.position, imageWidth, imageHeight);
      
      return pipeline.composite([{
        input: watermarkBuffer,
        ...position,
        blend: 'over'
      }]);
    }

    return pipeline;
  }

  // Create SVG text watermark
  private static createTextWatermarkSvg(text: string, imageWidth: number): string {
    const fontSize = Math.max(16, imageWidth / 20);
    return `
      <svg width="${imageWidth}" height="50">
        <text x="50%" y="25" 
              text-anchor="middle" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              fill="white" 
              fill-opacity="0.7" 
              stroke="black" 
              stroke-width="1" 
              stroke-opacity="0.5">
          ${text}
        </text>
      </svg>
    `;
  }

  // Get watermark position coordinates
  private static getWatermarkPosition(
    position: string = 'bottom-right',
    imageWidth: number,
    imageHeight?: number
  ): { top?: number; left?: number; gravity?: string } {
    switch (position) {
      case 'top-left':
        return { top: 10, left: 10 };
      case 'top-right':
        return { top: 10, left: imageWidth - 200 };
      case 'bottom-left':
        return { top: (imageHeight || 100) - 60, left: 10 };
      case 'bottom-right':
        return { top: (imageHeight || 100) - 60, left: imageWidth - 200 };
      case 'center':
        return { gravity: 'center' };
      default:
        return { top: (imageHeight || 100) - 60, left: imageWidth - 200 };
    }
  }

  // Generate responsive image set
  static async generateResponsiveImages(
    inputBuffer: Buffer,
    filename: string,
    outputDir: string
  ): Promise<OptimizationResult> {
    return this.optimizeImage({
      inputBuffer,
      outputDir,
      filename,
      formats: ['webp', 'jpeg'],
      sizes: this.DEFAULT_SIZES,
      quality: this.DEFAULT_QUALITY
    });
  }

  // Optimize movie poster
  static async optimizeMoviePoster(
    inputBuffer: Buffer,
    movieId: string,
    outputDir: string
  ): Promise<OptimizationResult> {
    const posterSizes = [
      { width: 300, height: 450, name: 'thumbnail' },
      { width: 500, height: 750, name: 'medium' },
      { width: 800, height: 1200, name: 'large' }
    ];

    return this.optimizeImage({
      inputBuffer,
      outputDir,
      filename: `${movieId}-poster`,
      formats: ['webp', 'jpeg'],
      sizes: posterSizes,
      quality: 90,
      watermark: {
        text: 'TeleHub',
        position: 'bottom-right'
      }
    });
  }

  // Create movie thumbnail from video frame
  static async createVideoThumbnail(
    frameBuffer: Buffer,
    movieId: string,
    outputDir: string
  ): Promise<OptimizationResult> {
    const thumbnailSizes = [
      { width: 320, height: 180, name: 'small' },
      { width: 640, height: 360, name: 'medium' },
      { width: 1280, height: 720, name: 'large' }
    ];

    return this.optimizeImage({
      inputBuffer: frameBuffer,
      outputDir,
      filename: `${movieId}-thumbnail`,
      formats: ['webp', 'jpeg'],
      sizes: thumbnailSizes,
      quality: 85
    });
  }

  // Validate image file
  static async validateImage(inputBuffer: Buffer): Promise<{ valid: boolean; error?: string }> {
    try {
      const metadata = await sharp(inputBuffer).metadata();
      
      // Basic validation checks
      if (!metadata.width || !metadata.height) {
        return { valid: false, error: 'Invalid image dimensions' };
      }
      
      if (metadata.width < 100 || metadata.height < 100) {
        return { valid: false, error: 'Image too small (minimum 100x100)' };
      }

      if (!metadata.format || !['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'].includes(metadata.format)) {
        return { valid: false, error: 'Unsupported image format' };
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (metadata.size && metadata.size > maxSize) {
        return { valid: false, error: 'Image file too large (max 50MB)' };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown validation error' 
      };
    }
  }

  // Get optimal image sizes based on input
  static async getOptimalSizes(inputBuffer: Buffer): Promise<Array<{ width: number; height?: number; name: string }>> {
    try {
      const metadata = await sharp(inputBuffer).metadata();
      const sizes: Array<{ width: number; height?: number; name: string }> = [];

      if (!metadata.width || !metadata.height) {
        return this.DEFAULT_SIZES;
      }

      const aspectRatio = metadata.width / metadata.height;

      // Generate sizes based on input dimensions
      const baseSizes = [320, 640, 1280, 1920];
      const sizeNames = ['small', 'medium', 'large', 'xlarge'];

      for (let i = 0; i < baseSizes.length; i++) {
        const width = baseSizes[i];
        if (width <= metadata.width) {
          sizes.push({
            width,
            height: Math.round(width / aspectRatio),
            name: sizeNames[i]
          });
        }
      }

      return sizes.length > 0 ? sizes : this.DEFAULT_SIZES;
    } catch (error) {
      console.error('Error getting optimal sizes:', error);
      return this.DEFAULT_SIZES;
    }
  }
}

export default ImageOptimizationService;