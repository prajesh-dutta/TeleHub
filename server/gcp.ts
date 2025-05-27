import { Storage } from '@google-cloud/storage';
import { Request, Response } from 'express';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
  // Or use inline credentials
  credentials: process.env.GCP_CREDENTIALS ? JSON.parse(process.env.GCP_CREDENTIALS) : undefined
});

const bucketName = process.env.GCP_STORAGE_BUCKET || 'telehub-movies';
const bucket = storage.bucket(bucketName);

export class GoogleCloudService {
  // Upload movie with multiple quality versions
  static async uploadMovieWithQualities(movieFile: Buffer, movieId: string, originalName: string) {
    try {
      const baseFileName = movieId.toLowerCase().replace(/\s+/g, '-');
      
      // Upload original quality
      const originalFile = bucket.file(`movies/${baseFileName}-original.mp4`);
      await originalFile.save(movieFile, {
        metadata: {
          contentType: 'video/mp4',
          cacheControl: 'public, max-age=31536000',
          customMetadata: {
            movieId,
            quality: 'original',
            originalName
          }
        }
      });

      // Generate different quality URLs (you'd use FFmpeg to create these)
      const qualities = {
        '1080p': `https://storage.googleapis.com/${bucketName}/movies/${baseFileName}-1080p.mp4`,
        '720p': `https://storage.googleapis.com/${bucketName}/movies/${baseFileName}-720p.mp4`,
        '480p': `https://storage.googleapis.com/${bucketName}/movies/${baseFileName}-480p.mp4`,
        '360p': `https://storage.googleapis.com/${bucketName}/movies/${baseFileName}-360p.mp4`
      };

      return {
        success: true,
        originalUrl: `https://storage.googleapis.com/${bucketName}/movies/${baseFileName}-original.mp4`,
        qualities,
        bucketName,
        fileName: `${baseFileName}-original.mp4`
      };
    } catch (error) {
      console.error('Error uploading movie:', error);
      throw error;
    }
  }

  // Stream movie with range requests (for video seeking)
  static async streamMovie(req: Request, res: Response, fileName: string) {
    try {
      const file = bucket.file(`movies/${fileName}`);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ error: 'Movie file not found' });
      }

      // Get file metadata
      const [metadata] = await file.getMetadata();
      const fileSize = parseInt(metadata.size);
      
      // Handle range requests for video seeking
      const range = req.headers.range;
      
      if (range) {
        // Parse range header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        // Set response headers for partial content
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=31536000'
        });

        // Create read stream with range
        const stream = file.createReadStream({
          start,
          end
        });
        
        stream.pipe(res);
      } else {
        // Stream entire file
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000'
        });
        
        const stream = file.createReadStream();
        stream.pipe(res);
      }
    } catch (error) {
      console.error('Error streaming movie:', error);
      res.status(500).json({ error: 'Failed to stream movie' });
    }
  }

  // Get signed URL for secure streaming
  static async getSecureStreamingUrl(fileName: string, expiresInHours: number = 2) {
    try {
      const file = bucket.file(`movies/${fileName}`);
      
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + (expiresInHours * 60 * 60 * 1000),
        responseType: 'video/mp4'
      });

      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // Upload movie file to Google Cloud Storage
  static async uploadMovie(fileName: string, fileBuffer: Buffer, metadata?: any) {
    try {
      const file = bucket.file(`movies/${fileName}`);
      
      await file.save(fileBuffer, {
        metadata: {
          contentType: 'video/mp4',
          cacheControl: 'public, max-age=31536000',
          ...metadata
        },
        public: true, // Make files publicly accessible
      });

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/movies/${fileName}`;
      
      return {
        success: true,
        url: publicUrl,
        fileName,
        bucket: bucketName
      };
    } catch (error) {
      console.error('Error uploading to Google Cloud Storage:', error);
      throw error;
    }
  }

  // Delete movie from storage
  static async deleteMovie(fileName: string) {
    try {
      await bucket.file(`movies/${fileName}`).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }

  // List all movies in bucket
  static async listMoviesInBucket() {
    try {
      const [files] = await bucket.getFiles({ prefix: 'movies/' });
      
      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        created: file.metadata.timeCreated,
        updated: file.metadata.updated,
        publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`,
        contentType: file.metadata.contentType
      }));
    } catch (error) {
      console.error('Error listing movies:', error);
      throw error;
    }
  }

  // Get file metadata
  static async getMovieMetadata(fileName: string) {
    try {
      const file = bucket.file(`movies/${fileName}`);
      const [metadata] = await file.getMetadata();
      
      return {
        name: file.name,
        size: metadata.size,
        contentType: metadata.contentType,
        updated: metadata.updated,
        publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`
      };
    } catch (error) {
      console.error('Error getting metadata:', error);
      throw error;
    }
  }

  // Check if Google Cloud is properly configured
  static async testConnection() {
    try {
      const [buckets] = await storage.getBuckets();
      const targetBucket = buckets.find(b => b.name === bucketName);
      
      if (!targetBucket) {
        throw new Error(`Bucket ${bucketName} not found`);
      }

      return {
        success: true,
        projectId: process.env.GCP_PROJECT_ID,
        bucketName,
        region: process.env.GCP_REGION,
        status: 'Connected'
      };
    } catch (error) {
      console.error('Google Cloud connection test failed:', error);
      throw error;
    }
  }
}

export { storage, bucket };
