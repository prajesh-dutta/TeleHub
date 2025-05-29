import express from 'express';
import { GoogleCloudService } from './gcp.js';
import { MongoStorage } from './mongodb.js';
import multer from 'multer';

const router = express.Router();
const mongoStorage = new MongoStorage();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Stream movie endpoint
router.get('/stream/:movieId/:quality?', async (req, res) => {
  try {
    const { movieId, quality = '720p' } = req.params;
      // Get movie from database
    const movie = await mongoStorage.getMovie(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Generate filename based on movie ID and quality
    const fileName = `${movieId}-${quality}.mp4`;
    
    // Stream the movie
    await GoogleCloudService.streamMovie(req, res, fileName);
    
  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).json({ error: 'Failed to stream movie' });
  }
});

// Get secure streaming URL
router.get('/secure-url/:movieId/:quality?', async (req, res) => {
  try {    const { movieId, quality = '720p' } = req.params;
    const { expires = 2 } = req.query; // Hours
    
    const movie = await mongoStorage.getMovie(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const fileName = `${movieId}-${quality}.mp4`;
    const signedUrl = await GoogleCloudService.getSecureStreamingUrl(
      fileName, 
      parseInt(expires as string)
    );
    
    res.json({
      streamingUrl: signedUrl,
      expiresIn: `${expires} hours`,
      quality,
      movieId
    });
    
  } catch (error) {
    console.error('Error generating secure URL:', error);
    res.status(500).json({ error: 'Failed to generate streaming URL' });
  }
});

// Upload movie endpoint (admin only)
router.post('/upload', upload.single('movie'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No movie file provided' });
    }

    const { movieId, title, description, director, year } = req.body;
    
    // Upload to Google Cloud Storage
    const uploadResult = await GoogleCloudService.uploadMovieWithQualities(
      req.file.buffer,
      movieId,
      req.file.originalname
    );

    // Save movie metadata to database
    const movieData = {
      _id: movieId,
      title,
      description,
      director,
      year: parseInt(year),
      videoUrl: uploadResult.originalUrl,
      qualities: uploadResult.qualities,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      status: 'active'
    };    const savedMovie = await mongoStorage.createMovie(movieData);

    res.json({
      success: true,
      movie: savedMovie,
      upload: uploadResult
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload movie' });
  }
});

// Get movie qualities available
router.get('/qualities/:movieId', async (req, res) => {  try {
    const { movieId } = req.params;
    
    const movie = await mongoStorage.getMovie(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({
      movieId,
      qualities: movie.qualities || {
        '360p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}-360p.mp4`,
        '480p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}-480p.mp4`,
        '720p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}-720p.mp4`,
        '1080p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/movies/${movieId}-1080p.mp4`
      },
      defaultQuality: '720p'
    });

  } catch (error) {
    console.error('Error getting qualities:', error);
    res.status(500).json({ error: 'Failed to get movie qualities' });
  }
});

// Test Google Cloud connection
router.get('/test-gcp', async (req, res) => {
  try {
    const connectionResult = await GoogleCloudService.testConnection();
    res.json(connectionResult);  } catch (error) {
    console.error('GCP test failed:', error);
    res.status(500).json({ 
      error: 'Google Cloud connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// List all movies in storage
router.get('/storage/list', async (req, res) => {
  try {
    const movies = await GoogleCloudService.listMoviesInBucket();
    res.json({ movies, count: movies.length });
  } catch (error) {
    console.error('Error listing storage movies:', error);
    res.status(500).json({ error: 'Failed to list movies from storage' });
  }
});

// Get movie metadata from storage
router.get('/storage/metadata/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const metadata = await GoogleCloudService.getMovieMetadata(fileName);
    res.json(metadata);
  } catch (error) {
    console.error('Error getting movie metadata:', error);
    res.status(500).json({ error: 'Failed to get movie metadata' });
  }
});

// Delete movie from storage (admin only)
router.delete('/storage/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    await GoogleCloudService.deleteMovie(fileName);
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

export default router;
