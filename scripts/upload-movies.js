// Upload Movies to GCP Storage
// Run this script after setting up GCP credentials

import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize GCP Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

const bucketName = process.env.GCP_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

// Sample movies with download URLs (public domain movies)
const publicDomainMovies = [
  {
    id: 'night-of-living-dead-1968',
    title: 'Night of the Living Dead',
    downloadUrl: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968.mp4',
    fileName: 'night-of-living-dead-1968.mp4'
  },
  {
    id: 'plan-9-from-outer-space',
    title: 'Plan 9 from Outer Space',
    downloadUrl: 'https://archive.org/download/Plan9FromOuterSpace/Plan%209%20from%20Outer%20Space.mp4',
    fileName: 'plan-9-from-outer-space.mp4'
  },
  {
    id: 'the-cabinet-of-dr-caligari',
    title: 'The Cabinet of Dr. Caligari',
    downloadUrl: 'https://archive.org/download/TheCabinetOfDr.Caligari/The%20Cabinet%20of%20Dr.%20Caligari.mp4',
    fileName: 'the-cabinet-of-dr-caligari.mp4'
  }
];

async function downloadAndUploadMovie(movie) {
  console.log(`📥 Processing: ${movie.title}`);
  
  try {
    // Download movie file
    console.log(`  🌐 Downloading from: ${movie.downloadUrl}`);
    const response = await fetch(movie.downloadUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Create upload stream to GCP
    const file = bucket.file(`movies/${movie.fileName}`);
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'video/mp4',
        metadata: {
          movieId: movie.id,
          title: movie.title,
          uploadedAt: new Date().toISOString()
        }
      }
    });
    
    // Pipe download directly to GCP upload
    const reader = response.body.getReader();
    let totalSize = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      totalSize += value.length;
      stream.write(value);
      
      // Show progress
      process.stdout.write(`\r  📦 Uploaded: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    }
    
    stream.end();
    
    await new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', resolve);
    });
    
    console.log(`\n  ✅ Successfully uploaded: ${movie.title}`);
    
    // Generate signed URL for streaming
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });
    
    return {
      movieId: movie.id,
      fileName: movie.fileName,
      gcpUrl: `gs://${bucketName}/movies/${movie.fileName}`,
      streamingUrl: url,
      size: totalSize
    };
    
  } catch (error) {
    console.error(`\n  ❌ Error uploading ${movie.title}:`, error.message);
    return null;
  }
}

async function uploadAllMovies() {
  console.log('🎬 TeleHub Movie Upload to GCP\n');
  
  try {
    // Check if bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      console.error(`❌ Bucket ${bucketName} does not exist. Please create it first.`);
      process.exit(1);
    }
    
    console.log(`✅ Connected to bucket: ${bucketName}\n`);
    
    const results = [];
    
    for (const movie of publicDomainMovies) {
      const result = await downloadAndUploadMovie(movie);
      if (result) {
        results.push(result);
      }
      console.log(''); // Add spacing
    }
    
    // Save results to JSON file
    const outputPath = path.join(__dirname, '..', 'config', 'uploaded-movies.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n🎉 Upload Complete!');
    console.log(`📁 Movie data saved to: ${outputPath}`);
    console.log(`📊 Successfully uploaded: ${results.length}/${publicDomainMovies.length} movies`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadAllMovies();
}

export { uploadAllMovies };
