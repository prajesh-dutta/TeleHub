import fs from 'fs';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class SampleMovieUploader {  constructor() {
    // Initialize GCP Storage
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE
    });
    this.bucket = this.storage.bucket(process.env.GCP_STORAGE_BUCKET);
    
    // MongoDB connection
    this.mongoUri = process.env.DATABASE_URL;
  }

  async uploadMovie(movieDir) {
    try {
      console.log(`\n🎬 Processing movie: ${path.basename(movieDir)}`);
      
      // Read metadata
      const metadataPath = path.join(movieDir, 'metadata.json');
      if (!fs.existsSync(metadataPath)) {
        throw new Error('metadata.json not found');
      }
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      console.log(`📖 Title: ${metadata.title} (${metadata.year})`);
      
      // Generate unique movie ID
      const movieId = `${metadata.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${metadata.year}`;
      
      // File paths
      const movieFile = path.join(movieDir, 'movie.mp4');
      const posterFile = path.join(movieDir, 'poster.jpg');
      const backdropFile = path.join(movieDir, 'backdrop.jpg');
      
      const uploadResults = {};
      
      // Upload movie file if it exists and is not placeholder
      if (fs.existsSync(movieFile)) {
        const fileContent = fs.readFileSync(movieFile);        if (fileContent.toString().includes('placeholder')) {
          console.log('⚠️  Movie file is placeholder - skipping video upload');
          uploadResults.videoUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}/movie.mp4`;
        } else {
          console.log('🎥 Uploading movie file...');
          const videoDestination = `movies/${movieId}/movie.mp4`;
          await this.uploadFile(movieFile, videoDestination);
          uploadResults.videoUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/${videoDestination}`;
          console.log('✅ Movie file uploaded');
        }
      }
      
      // Upload poster if it exists and is not placeholder
      if (fs.existsSync(posterFile)) {
        const fileContent = fs.readFileSync(posterFile);        if (fileContent.toString().includes('placeholder')) {
          console.log('⚠️  Poster is placeholder - using default poster URL');
          uploadResults.posterUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}/poster.jpg`;
        } else {
          console.log('🖼️ Uploading poster...');
          const posterDestination = `movies/${movieId}/poster.jpg`;
          await this.uploadFile(posterFile, posterDestination);
          uploadResults.posterUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/${posterDestination}`;
          console.log('✅ Poster uploaded');
        }
      }
        // Upload backdrop if it exists and is not placeholder
      if (fs.existsSync(backdropFile)) {
        const fileContent = fs.readFileSync(backdropFile);        if (fileContent.toString().includes('placeholder')) {
          console.log('⚠️  Backdrop is placeholder - using default backdrop URL');
          uploadResults.backdropUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}/backdrop.jpg`;
        } else {
          console.log('🖼️ Uploading backdrop...');
          const backdropDestination = `movies/${movieId}/backdrop.jpg`;
          await this.uploadFile(backdropFile, backdropDestination);
          uploadResults.backdropUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/${backdropDestination}`;
          console.log('✅ Backdrop uploaded');
        }
      }
      
      // Save to MongoDB
      console.log('💾 Saving to MongoDB...');
      await this.saveToMongoDB(movieId, metadata, uploadResults);
      console.log('✅ Movie saved to database');
      
      console.log(`🎉 Successfully processed: ${metadata.title}`);
      return { movieId, ...uploadResults };
      
    } catch (error) {
      console.error(`❌ Error processing movie: ${error.message}`);
      throw error;
    }
  }
  
  async uploadFile(localPath, destination) {
    try {
      await this.bucket.upload(localPath, {
        destination: destination,
        metadata: {
          cacheControl: 'public, max-age=31536000', // 1 year cache
        }
      });
      return `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/${destination}`;
    } catch (error) {
      console.error(`Error uploading ${localPath}:`, error);
      throw error;
    }
  }
  
  async saveToMongoDB(movieId, metadata, uploadResults) {
    const client = new MongoClient(this.mongoUri);
    
    try {
      await client.connect();
      const db = client.db('telehub');
      const moviesCollection = db.collection('movies');
      
      // Check if movie already exists
      const existingMovie = await moviesCollection.findOne({ movieId });
      
      const movieDocument = {
        movieId,
        title: metadata.title,
        year: metadata.year,
        overview: metadata.overview,
        director: metadata.director,
        runtime: metadata.runtime,
        genres: metadata.genres,
        language: metadata.language,
        country: metadata.country,
        rating: metadata.rating,
        cast: metadata.cast,
        crew: metadata.crew,
        tags: metadata.tags,
        featured: metadata.featured || false,
        isPublicDomain: metadata.isPublicDomain || false,
        imdbId: metadata.imdbId,
        tmdbId: metadata.tmdbId,
        videoUrl: uploadResults.videoUrl,
        posterUrl: uploadResults.posterUrl,
        backdropUrl: uploadResults.backdropUrl,
        uploadedAt: new Date(),
        status: 'active'
      };
      
      if (existingMovie) {
        await moviesCollection.updateOne(
          { movieId },
          { $set: movieDocument }
        );
        console.log('📝 Updated existing movie in database');
      } else {
        await moviesCollection.insertOne(movieDocument);
        console.log('➕ Added new movie to database');
      }
      
    } finally {
      await client.close();
    }
  }
    async uploadAllSampleMovies() {
    const sampleMoviesDir = path.join(process.cwd(), 'sample-movies');
    
    console.log(`Looking for movies in: ${sampleMoviesDir}`);
    
    if (!fs.existsSync(sampleMoviesDir)) {
      throw new Error(`sample-movies directory not found at: ${sampleMoviesDir}`);
    }
    
    const movieDirs = fs.readdirSync(sampleMoviesDir)
      .filter(item => {
        const fullPath = path.join(sampleMoviesDir, item);
        return fs.statSync(fullPath).isDirectory();
      })
      .map(dir => path.join(sampleMoviesDir, dir));
    
    console.log(`\n🚀 Starting upload of ${movieDirs.length} sample movies...\n`);
    
    const results = [];
    
    for (const movieDir of movieDirs) {
      try {
        const result = await this.uploadMovie(movieDir);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process ${path.basename(movieDir)}:`, error.message);
        results.push({ error: error.message, movieDir: path.basename(movieDir) });
      }
    }
    
    console.log('\n📊 Upload Summary:');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (successful.length > 0) {
      console.log('\nSuccessful uploads:');
      successful.forEach(result => {
        console.log(`  • ${result.movieId}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\nFailed uploads:');
      failed.forEach(result => {
        console.log(`  • ${result.movieDir}: ${result.error}`);
      });
    }
    
    return results;
  }
}

// Run the upload process
async function main() {
  console.log('🚀 Starting TeleHub Sample Movie Uploader...');
  console.log('Current working directory:', process.cwd());
  
  const uploader = new SampleMovieUploader();
  
  try {
    await uploader.uploadAllSampleMovies();
    console.log('\n🎉 All done! Movies are now available in TeleHub.');
  } catch (error) {
    console.error('\n💥 Upload failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run if called directly
console.log('🚀 Script starting...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

// Always run main for now
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

export default SampleMovieUploader;
