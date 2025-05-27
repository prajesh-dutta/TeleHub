import express from "express";
import { createServer } from "http";
import path from "path";
import { setupVite } from "./vite.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Sample Bengali movies data for development
const sampleMovies = [
  {
    id: "pather-panchali-1955",
    title: "Pather Panchali",
    bengaliTitle: "পথের পাঁচালী",
    overview: "The first film in Satyajit Ray's acclaimed Apu Trilogy, following a poor Bengali family in rural India. A masterpiece of world cinema.",
    director: "Satyajit Ray",
    year: 1955,
    runtime: 125,
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Pather_Panchali_poster.jpg",
    backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Pather_Panchali_scene.jpg/1024px-Pather_Panchali_scene.jpg",
    genres: ["Drama", "Family", "Coming of Age"],
    language: "bengali",
    country: "india",
    rating: 8.4,
    isPublicDomain: true,
    featured: true
  },
  {
    id: "aparajito-1956",
    title: "Aparajito",
    bengaliTitle: "অপরাজিত",
    overview: "The second film in the Apu Trilogy, following Apu's journey from childhood to adolescence as his family moves from village to city.",
    director: "Satyajit Ray",
    year: 1956,
    runtime: 113,
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Aparajito_poster.jpg",
    backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Aparajito_scene.jpg/1024px-Aparajito_scene.jpg",
    genres: ["Drama", "Coming of Age", "Family"],
    language: "bengali",
    country: "india",
    rating: 8.2,
    isPublicDomain: true,
    featured: true
  },
  {
    id: "charulata-1964",
    title: "Charulata",
    bengaliTitle: "চারুলতা",
    overview: "Satyajit Ray's exploration of a lonely housewife's emotional awakening in 19th century Bengal. Often considered Ray's masterpiece.",
    director: "Satyajit Ray",
    year: 1964,
    runtime: 117,
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Charulata_poster.jpg",
    backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Charulata_scene.jpg/1024px-Charulata_scene.jpg",
    genres: ["Drama", "Romance", "Period"],
    language: "bengali",
    country: "india",
    rating: 8.5,
    isPublicDomain: true,
    featured: true
  },
  {
    id: "jalsaghar-1958",
    title: "Jalsaghar",
    bengaliTitle: "জলসাঘর",
    overview: "The story of a decadent zamindar's obsession with music and his gradual decline, featuring beautiful classical Indian music.",
    director: "Satyajit Ray",
    year: 1958,
    runtime: 100,
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/j/j7/Jalsaghar_poster.jpg",
    backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/m/m8/Jalsaghar_scene.jpg/1024px-Jalsaghar_scene.jpg",
    genres: ["Drama", "Music", "Period"],
    language: "bengali",
    country: "india",
    rating: 8.0,
    isPublicDomain: true,
    featured: false
  }
];

const app = express();
app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Mock user data
const mockUser = {
  id: "dev-user",
  email: "demo@telehub.com",
  username: "Bengali Cinema Fan",
  subscriptionTier: "explorer",
  favorites: [] as string[],
  watchlist: [] as string[]
};

// API Routes for development
app.get('/api/movies', (req, res) => {
  const { genre, query, limit = 20 } = req.query;
  let filteredMovies = [...sampleMovies];
  
  if (genre && genre !== 'all') {
    filteredMovies = filteredMovies.filter(movie => 
      movie.genres.some(g => g.toLowerCase().includes(genre.toString().toLowerCase()))
    );
  }
  
  if (query) {
    const searchTerm = query.toString().toLowerCase();
    filteredMovies = filteredMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.bengaliTitle?.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json({
    movies: filteredMovies.slice(0, Number(limit)),
    total: filteredMovies.length,
    page: 1,
    totalPages: Math.ceil(filteredMovies.length / Number(limit))
  });
});

app.get('/api/movies/featured', (req, res) => {
  res.json(sampleMovies.filter(movie => movie.featured));
});

app.get('/api/movies/:id', (req, res) => {
  const movie = sampleMovies.find(m => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
});

app.get('/api/movies/:id/stream', (req, res) => {
  // Mock streaming URL for development
  res.json({ 
    url: `https://storage.googleapis.com/telehub-movies/movies/${req.params.id}-720p.mp4`
  });
});

// GCP Streaming API mock endpoints
app.get('/api/streaming/secure-url/:movieId/:quality?', (req, res) => {
  const { movieId, quality = '720p' } = req.params;
  // Mock signed URL for development
  res.json({
    streamingUrl: `https://storage.googleapis.com/telehub-movies/movies/${movieId}-${quality}.mp4?expires=123456789`,
    expiresIn: '2 hours',
    quality,
    movieId
  });
});

app.get('/api/streaming/qualities/:movieId', (req, res) => {
  // Mock available qualities
  res.json({
    movieId: req.params.movieId,
    qualities: ['360p', '480p', '720p', '1080p']
  });
});

app.get('/api/streaming/test-connection', (req, res) => {
  // Mock connection test
  res.json({
    success: true,
    message: 'Google Cloud Storage connection successful (development mode)',
    bucket: process.env.GCP_STORAGE_BUCKET || 'telehub-movies'
  });
});

// User authentication endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    user: mockUser,
    token: 'mock-jwt-token'
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUser);
});

// Favorites and watchlist endpoints
app.get('/api/favorites', (req, res) => {
  res.json(mockUser.favorites.map(id => sampleMovies.find(m => m.id === id)).filter(Boolean));
});

app.post('/api/favorites', (req, res) => {
  const { movieId } = req.body;
  if (!mockUser.favorites.includes(movieId)) {
    mockUser.favorites.push(movieId);
  }
  res.json({ success: true });
});

app.delete('/api/favorites/:movieId', (req, res) => {
  mockUser.favorites = mockUser.favorites.filter(id => id !== req.params.movieId);
  res.json({ success: true });
});

app.get('/api/watchlist', (req, res) => {
  res.json(mockUser.watchlist.map(id => sampleMovies.find(m => m.id === id)).filter(Boolean));
});

app.post('/api/watchlist', (req, res) => {
  const { movieId } = req.body;
  if (!mockUser.watchlist.includes(movieId)) {
    mockUser.watchlist.push(movieId);
  }
  res.json({ success: true });
});

app.delete('/api/watchlist/:movieId', (req, res) => {
  mockUser.watchlist = mockUser.watchlist.filter(id => id !== req.params.movieId);
  res.json({ success: true });
});

// Watch progress endpoint
app.post('/api/movies/:id/progress', (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 5002;
const server = createServer(app);

// Setup Vite middleware for development
async function startServer() {
  console.log('🎬 TeleHub Development Server');
  console.log('============================');
  console.log('✅ Using sample Bengali movie data');
  console.log('✅ Mock authentication enabled');
  console.log('✅ All features available for testing');

  try {
    await setupVite(app, server);
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('🎭 Sample movies available:');
      sampleMovies.forEach(movie => {
        console.log(`   - ${movie.title} (${movie.year})`);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
