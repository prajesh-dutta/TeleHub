#!/usr/bin/env node

/**
 * TeleHub Movie Uploader
 * Uploads movies to GCP Storage with thumbnails and metadata
 */

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize GCP Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

const bucketName = process.env.GCP_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

class MovieUploader {
  constructor() {
    this.mongoClient = null;
    this.db = null;
  }

  // Connect to MongoDB
  async connectDB() {
    try {
      this.mongoClient = new MongoClient(process.env.MONGODB_URI);
      await this.mongoClient.connect();
      this.db = this.mongoClient.db(process.env.DB_NAME || 'telehub');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  // Generate movie ID
  generateMovieId(title, year) {
    const cleanTitle = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    return year ? `${cleanTitle}-${year}` : cleanTitle;
  }

  // Extract video thumbnail using FFmpeg
  async extractThumbnail(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['10%', '25%', '50%', '75%'],
          filename: 'thumb-%i.png',
          folder: path.dirname(outputPath),
          size: '1920x1080'
        })
        .on('end', () => {
          console.log('✅ Thumbnails extracted');
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('❌ Thumbnail extraction failed:', err);
          reject(err);
        });
    });
  }

  // Create optimized thumbnails
  async createOptimizedThumbnails(inputPath, movieId) {
    const thumbnails = {};
    const sizes = {
      poster: { width: 300, height: 450 },
      backdrop: { width: 1920, height: 1080 },
      thumbnail: { width: 640, height: 360 },
      small: { width: 200, height: 300 }
    };

    for (const [type, size] of Object.entries(sizes)) {
      const outputBuffer = await sharp(inputPath)
        .resize(size.width, size.height, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer();

      const fileName = `thumbnails/${movieId}/${type}.jpg`;
      const file = bucket.file(fileName);
      
      await file.save(outputBuffer, {
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000'
        }
      });

      thumbnails[type] = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      console.log(`✅ ${type} thumbnail uploaded`);
    }

    return thumbnails;
  }

  // Upload video file
  async uploadVideo(videoPath, movieId) {
    try {
      const fileName = `movies/${movieId}.mp4`;
      const file = bucket.file(fileName);
      
      console.log(`📤 Uploading video: ${movieId}...`);
      
      await file.save(fs.readFileSync(videoPath), {
        metadata: {
          contentType: 'video/mp4',
          cacheControl: 'public, max-age=31536000',
          customMetadata: {
            movieId,
            uploadDate: new Date().toISOString()
          }
        }
      });

      const videoUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      console.log('✅ Video uploaded successfully');
      return videoUrl;
    } catch (error) {
      console.error('❌ Video upload failed:', error);
      throw error;
    }
  }

  // Save movie to MongoDB
  async saveMovieToDatabase(movieData) {
    try {
      const collection = this.db.collection('movies');
      
      // Check if movie already exists
      const existingMovie = await collection.findOne({ id: movieData.id });
      
      if (existingMovie) {
        // Update existing movie
        await collection.updateOne(
          { id: movieData.id },
          { $set: { ...movieData, updatedAt: new Date() } }
        );
        console.log('✅ Movie updated in database');
      } else {
        // Insert new movie
        await collection.insertOne({
          ...movieData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Movie saved to database');
      }
    } catch (error) {
      console.error('❌ Database save failed:', error);
      throw error;
    }
  }

  // Main upload function
  async uploadMovie(movieInfo) {
    try {
      console.log(`🎬 Starting upload for: ${movieInfo.title}`);
      
      // Generate movie ID
      const movieId = this.generateMovieId(movieInfo.title, movieInfo.year);
      
      // Upload video
      const videoUrl = await this.uploadVideo(movieInfo.videoPath, movieId);
      
      // Extract and upload thumbnails
      let thumbnails = {};
      if (movieInfo.thumbnailPath) {
        thumbnails = await this.createOptimizedThumbnails(movieInfo.thumbnailPath, movieId);
      } else {
        // Extract thumbnail from video
        const tempThumbPath = path.join(__dirname, 'temp', `${movieId}-thumb.png`);
        await this.extractThumbnail(movieInfo.videoPath, tempThumbPath);
        thumbnails = await this.createOptimizedThumbnails(tempThumbPath, movieId);
        // Clean up temp file
        if (fs.existsSync(tempThumbPath)) fs.unlinkSync(tempThumbPath);
      }

      // Prepare movie data
      const movieData = {
        id: movieId,
        title: movieInfo.title,
        overview: movieInfo.overview || "A captivating cinematic experience.",
        director: movieInfo.director || "Unknown",
        year: movieInfo.year || new Date().getFullYear(),
        runtime: movieInfo.runtime || 120,
        posterUrl: thumbnails.poster,
        backdropUrl: thumbnails.backdrop,
        videoUrl: videoUrl,
        trailerUrl: movieInfo.trailerUrl || "",
        genres: movieInfo.genres || ["Drama"],
        language: movieInfo.language || "english",
        country: movieInfo.country || "usa",
        rating: movieInfo.rating || 7.5,
        isPublicDomain: movieInfo.isPublicDomain !== false, // Default to true
        streamingPlatform: "telehub",
        tags: movieInfo.tags || [],
        cast: movieInfo.cast || [],
        crew: movieInfo.crew || [],
        awards: movieInfo.awards || [],
        imdbId: movieInfo.imdbId || "",
        tmdbId: movieInfo.tmdbId || "",
        featured: movieInfo.featured || false
      };

      // Save to database
      await this.saveMovieToDatabase(movieData);

      console.log('🎉 Movie upload completed successfully!');
      console.log(`📍 Movie ID: ${movieId}`);
      console.log(`🎬 Video URL: ${videoUrl}`);
      console.log(`🖼️ Poster URL: ${thumbnails.poster}`);
      
      return {
        success: true,
        movieId,
        videoUrl,
        thumbnails,
        movieData
      };

    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }

  // Batch upload movies
  async uploadMovies(moviesList) {
    await this.connectDB();
    
    for (const movie of moviesList) {
      try {
        await this.uploadMovie(movie);
        console.log(`✅ Completed: ${movie.title}\n`);
      } catch (error) {
        console.error(`❌ Failed: ${movie.title}`, error);
      }
    }
    
    await this.mongoClient.close();
  }

  // Close database connection
  async close() {
    if (this.mongoClient) {
      await this.mongoClient.close();
    }
  }
}

// Example usage
async function uploadSampleMovies() {
  const uploader = new MovieUploader();
  
  const sampleMovies = [
    {
      title: "Nosferatu",
      year: 1922,
      videoPath: "./sample-movies/nosferatu.mp4",
      thumbnailPath: "./sample-movies/nosferatu-poster.jpg", // Optional
      overview: "A classic silent horror film about a vampire.",
      director: "F.W. Murnau",
      runtime: 94,
      genres: ["Horror", "Classic"],
      rating: 8.1,
      isPublicDomain: true
    },
    {
      title: "The Great Train Robbery",
      year: 1903,
      videoPath: "./sample-movies/great-train-robbery.mp4",
      overview: "One of the first narrative films ever made.",
      director: "Edwin S. Porter",
      runtime: 12,
      genres: ["Western", "Classic"],
      rating: 7.3,
      isPublicDomain: true
    }
  ];

  try {
    await uploader.uploadMovies(sampleMovies);
  } catch (error) {
    console.error('Upload process failed:', error);
  }
}

// Export for use as module
export { MovieUploader };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadSampleMovies();
}
