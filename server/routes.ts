import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { connectToMongoDB, MongoStorage } from "./mongodb";
import { passport } from "./auth";
import { s3Service } from "./s3";
import streamingRoutes from "./streaming";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "telehub-secret-key";
const mongoStorage = new MongoStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection
  await connectToMongoDB();

  // Configure multer for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'telehub-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to authenticate JWT tokens
  const authenticateToken = (req: any, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'TeleHub API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Authentication Routes
  // Google OAuth
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth?error=google_auth_failed' }),
    (req, res) => {
      // Successful authentication, redirect to home
      res.redirect('/');
    }
  );

  // Local login with JWT
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await mongoStorage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (!user.password) {
        return res.status(400).json({ message: 'Please sign in with Google' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
          subscriptionTier: user.subscriptionTier
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, username, password } = req.body;

      // Check if user already exists
      const existingUser = await mongoStorage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user with JWT
      const user = await mongoStorage.createUser({
        email,
        username,
        password: hashedPassword,
        subscriptionTier: 'explorer',
        profile: {
          favoriteGenres: [],
          watchlist: [],
          favorites: [],
          followers: [],
          following: [],
          watchHistory: []
        }
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        success: true, 
        token,
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          subscriptionTier: user.subscriptionTier
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // Get current user with JWT authentication
  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await mongoStorage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        subscriptionTier: user.subscriptionTier,
        profile: user.profile
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user' });
    }
  });

  // Movie routes
  app.get("/api/movies", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const movies = await mongoStorage.getMovies(limit, offset);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const movies = await mongoStorage.getFeaturedMovies(limit);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching featured movies:", error);
      res.status(500).json({ message: "Failed to fetch featured movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await mongoStorage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  app.get("/api/movies/genre/:genre", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movies = await mongoStorage.getMoviesByGenre(req.params.genre, limit);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      res.status(500).json({ message: "Failed to fetch movies by genre" });
    }
  });

  app.get("/api/movies/search/:query", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movies = await mongoStorage.searchMovies(req.params.query, limit);
      res.json(movies);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  app.get("/api/movies/public-domain", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movies = await mongoStorage.getPublicDomainMovies(limit);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching public domain movies:", error);
      res.status(500).json({ message: "Failed to fetch public domain movies" });
    }
  });

  // Favorites and Watchlist routes
  app.post("/api/users/favorites/:movieId", authenticateToken, async (req: any, res) => {
    try {
      const user = await mongoStorage.addToFavorites(req.user.id, req.params.movieId);
      res.json({ success: true, message: 'Added to favorites', user: user?.profile });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete("/api/users/favorites/:movieId", authenticateToken, async (req: any, res) => {
    try {
      const user = await mongoStorage.removeFromFavorites(req.user.id, req.params.movieId);
      res.json({ success: true, message: 'Removed from favorites', user: user?.profile });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  app.get("/api/users/favorites", authenticateToken, async (req: any, res) => {
    try {
      const movies = await mongoStorage.getUserFavorites(req.user.id);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/users/watchlist/:movieId", authenticateToken, async (req: any, res) => {
    try {
      const user = await mongoStorage.addToWatchlist(req.user.id, req.params.movieId);
      res.json({ success: true, message: 'Added to watchlist', user: user?.profile });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/users/watchlist/:movieId", authenticateToken, async (req: any, res) => {
    try {
      const user = await mongoStorage.removeFromWatchlist(req.user.id, req.params.movieId);
      res.json({ success: true, message: 'Removed from watchlist', user: user?.profile });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  app.get("/api/users/watchlist", authenticateToken, async (req: any, res) => {
    try {
      const movies = await mongoStorage.getUserWatchlist(req.user.id);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  // Watch history
  app.post("/api/users/watch-history", authenticateToken, async (req: any, res) => {
    try {
      const { movieId, progress } = req.body;
      const user = await mongoStorage.updateWatchHistory(req.user.id, movieId, progress);
      res.json({ success: true, message: 'Watch history updated', user: user?.profile });
    } catch (error) {
      console.error("Error updating watch history:", error);
      res.status(500).json({ message: "Failed to update watch history" });
    }
  });

  // S3 streaming URL
  app.get("/api/movies/:id/stream", authenticateToken, async (req: any, res) => {
    try {
      const movie = await mongoStorage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Extract S3 key from videoUrl
      const videoUrl = movie.videoUrl;
      if (videoUrl && videoUrl.includes('s3.')) {
        const urlParts = videoUrl.split('/');
        const key = urlParts.slice(-2).join('/'); // Get last two parts as key
        const streamingUrl = await s3Service.getStreamingUrl(key);
        res.json({ streamingUrl });
      } else {
        // For public domain movies, return direct URL
        res.json({ streamingUrl: videoUrl });
      }
    } catch (error) {
      console.error("Error getting streaming URL:", error);
      res.status(500).json({ message: "Failed to get streaming URL" });
    }
  });

  // Google Cloud Streaming Routes
  app.use('/api/streaming', streamingRoutes);

  // Admin: Upload movie
  app.post("/api/admin/movies/upload", authenticateToken, upload.single('video'), async (req: any, res) => {
    try {
      // Check if user is admin (you can implement role-based access)
      const { movieId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const key = s3Service.generateMovieKey(movieId, 'video', 'mp4');
      await s3Service.uploadFile(key, file.buffer, file.mimetype);
      
      const videoUrl = s3Service.getPublicUrl(key);
      
      // Update movie with new video URL
      await mongoStorage.updateMovie(movieId, { videoUrl });

      res.json({ success: true, message: 'Movie uploaded successfully', videoUrl });
    } catch (error) {
      console.error("Error uploading movie:", error);
      res.status(500).json({ message: "Failed to upload movie" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}