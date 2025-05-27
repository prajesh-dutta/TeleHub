import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'telehub-movies';

export class S3Service {
  /**
   * Generate a presigned URL for video streaming
   */
  async getStreamingUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Generate a presigned URL for file upload
   */
  async getUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Upload file to S3
   */
  async uploadFile(key: string, body: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  /**
   * Generate a key for movie files
   */
  generateMovieKey(movieId: string, type: 'video' | 'poster' | 'backdrop' | 'trailer', extension: string): string {
    return `movies/${movieId}/${type}.${extension}`;
  }
}

export const s3Service = new S3Service();
