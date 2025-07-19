import type { Express } from "express";
import { createServer, type Server } from "http";
import { connectToMongoDB, MongoStorage } from "./mongodb";
import { passport } from "./auth";
import { s3Service } from "./s3";
import streamingRoutes from "./streaming";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Request, Response } from "express";
import { CacheService } from "./redis";
import { VideoCompressionService } from "./video-compression";
import { ImageOptimizationService } from "./image-optimization";

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

  // Movie routes with caching
  app.get("/api/movies", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const page = Math.floor(offset / limit);
      
      // Try to get from cache first
      const cached = await CacheService.getCachedMovieList('all', page);
      if (cached) {
        console.log(`⚡ Cache hit for movies page ${page}`);
        return res.json(cached);
      }
      
      // Get from database
      const movies = await mongoStorage.getMovies(limit, offset);
      
      // Cache the result
      await CacheService.cacheMovieList('all', page, movies, 600); // 10 minutes
      
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
      // Try cache first
      const cached = await CacheService.getCachedMovie(req.params.id);
      if (cached) {
        console.log(`⚡ Cache hit for movie ${req.params.id}`);
        return res.json(cached);
      }
      
      const movie = await mongoStorage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      // Cache the movie
      await CacheService.cacheMovie(req.params.id, movie, 3600); // 1 hour
      
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
      const query = req.params.query;
      
      // Try cache first
      const cached = await CacheService.getCachedSearchResults(query);
      if (cached) {
        console.log(`⚡ Cache hit for search: ${query}`);
        return res.json(cached);
      }
      
      const movies = await mongoStorage.searchMovies(query, limit);
      
      // Cache search results
      await CacheService.cacheSearchResults(query, movies, 900); // 15 minutes
      
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

  // S3 streaming URL with caching
  app.get("/api/movies/:id/stream", authenticateToken, async (req: any, res) => {
    try {
      const movieId = req.params.id;
      const quality = req.query.quality || '720p';
      
      // Try to get cached streaming URL
      const cachedUrl = await CacheService.getCachedStreamingUrl(movieId, quality as string);
      if (cachedUrl) {
        console.log(`⚡ Cache hit for streaming URL: ${movieId}:${quality}`);
        return res.json({ streamingUrl: cachedUrl });
      }
      
      const movie = await mongoStorage.getMovie(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Extract S3 key from videoUrl
      const videoUrl = movie.videoUrl;
      if (videoUrl && videoUrl.includes('s3.')) {
        const urlParts = videoUrl.split('/');
        const key = urlParts.slice(-2).join('/'); // Get last two parts as key
        const streamingUrl = await s3Service.getStreamingUrl(key);
        
        // Cache the streaming URL for 5 minutes
        await CacheService.cacheStreamingUrl(movieId, quality as string, streamingUrl, 300);
        
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
  // Admin: Upload movie with video compression
  app.post("/api/admin/movies/upload", authenticateToken, upload.single('video'), async (req: any, res) => {
    try {
      // Check if user is admin (you can implement role-based access)
      const { movieId, title, description } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate video file
      const validation = await VideoCompressionService.validateVideo(file.path || '');
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }

      // Get optimal compression settings
      const qualities = await VideoCompressionService.getOptimalSettings(file.path || '');
      
      // Compress video to multiple qualities
      const compressionResult = await VideoCompressionService.compressVideoToQualities({
        inputBuffer: file.buffer,
        outputDir: '/tmp/video-processing',
        movieId,
        qualities,
        deleteOriginal: true
      });

      if (!compressionResult.success) {
        return res.status(500).json({ 
          message: "Video compression failed", 
          error: compressionResult.error 
        });
      }

      // Update movie with compressed video URLs
      const videoUrls: Record<string, string> = {};
      for (const output of compressionResult.outputs) {
        if (output.url) {
          videoUrls[output.quality] = output.url;
        }
      }

      await mongoStorage.updateMovie(movieId, { 
        videoUrl: videoUrls['720p'] || videoUrls[Object.keys(videoUrls)[0]], // Default quality
        qualities: videoUrls,
        title,
        description,
        processingStatus: 'completed'
      });

      // Invalidate cache for this movie
      await CacheService.clearCache(`movie:${movieId}`);
      await CacheService.invalidatePattern('movies:*');

      res.json({ 
        success: true, 
        message: 'Movie uploaded and processed successfully',
        qualities: Object.keys(videoUrls),
        compressionResults: compressionResult.outputs
      });
    } catch (error) {
      console.error("Error uploading movie:", error);
      res.status(500).json({ message: "Failed to upload movie" });
    }
  });

  // ===================== COMMENTS API =====================
  
  // Get comments for a movie
  app.get("/api/movies/:id/comments", async (req, res) => {
    try {
      const { id: movieId } = req.params;
      const { Comment } = await import('./mongodb');
      
      const comments = await Comment.find({ movieId, parentCommentId: { $exists: false } })
        .sort({ createdAt: -1 })
        .populate('replies')
        .lean();
        
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Add a comment to a movie
  app.post("/api/movies/:id/comments", authenticateToken, async (req: any, res) => {
    try {
      const { id: movieId } = req.params;
      const { content, parentCommentId } = req.body;
      const { Comment } = await import('./mongodb');
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Comment content is required" });
      }
      
      const comment = new Comment({
        movieId,
        userId: req.user.id,
        username: req.user.username,
        content: content.trim(),
        parentCommentId
      });
      
      await comment.save();
      
      // If it's a reply, add to parent's replies array
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, {
          $push: { replies: comment._id }
        });
      }
      
      res.json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Like/unlike a comment
  app.post("/api/comments/:id/like", authenticateToken, async (req: any, res) => {
    try {
      const { id: commentId } = req.params;
      const userId = req.user.id;
      const { Comment } = await import('./mongodb');
      
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      const likeIndex = comment.likes.indexOf(userId);
      if (likeIndex > -1) {
        // Unlike
        comment.likes.splice(likeIndex, 1);
      } else {
        // Like
        comment.likes.push(userId);
      }
      
      await comment.save();
      res.json({ likes: comment.likes.length, isLiked: likeIndex === -1 });
    } catch (error) {
      console.error("Error toggling comment like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // ===================== RATINGS API =====================
  
  // Get movie ratings and average
  app.get("/api/movies/:id/ratings", async (req, res) => {
    try {
      const { id: movieId } = req.params;
      const { Rating } = await import('./mongodb');
      
      const ratings = await Rating.find({ movieId }).lean();
      const average = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
        
      res.json({
        average: Math.round(average * 10) / 10,
        count: ratings.length,
        ratings: ratings.map(r => ({
          id: r._id,
          rating: r.rating,
          review: r.review,
          username: r.userId, // In real app, populate username
          createdAt: r.createdAt
        }))
      });
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Add/update user rating for a movie
  app.post("/api/movies/:id/rate", authenticateToken, async (req: any, res) => {
    try {
      const { id: movieId } = req.params;
      const { rating, review } = req.body;
      const userId = req.user.id;
      const { Rating } = await import('./mongodb');
      
      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: "Rating must be between 1 and 10" });
      }
      
      const existingRating = await Rating.findOne({ movieId, userId });
      
      if (existingRating) {
        // Update existing rating
        existingRating.rating = rating;
        existingRating.review = review;
        existingRating.updatedAt = new Date();
        await existingRating.save();
        res.json(existingRating);
      } else {
        // Create new rating
        const newRating = new Rating({
          movieId,
          userId,
          rating,
          review
        });
        await newRating.save();
        res.json(newRating);
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      res.status(500).json({ message: "Failed to save rating" });
    }
  });

  // ===================== DISCUSSIONS API =====================
  
  // Get discussions for a movie
  app.get("/api/movies/:id/discussions", async (req, res) => {
    try {
      const { id: movieId } = req.params;
      const { Discussion } = await import('./mongodb');
      
      const discussions = await Discussion.find({ movieId })
        .sort({ isSticky: -1, createdAt: -1 })
        .lean();
        
      res.json(discussions.map(d => ({
        ...d,
        score: d.upvotes.length - d.downvotes.length
      })));
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Failed to fetch discussions" });
    }
  });

  // Create a new discussion
  app.post("/api/movies/:id/discussions", authenticateToken, async (req: any, res) => {
    try {
      const { id: movieId } = req.params;
      const { title, content, tags } = req.body;
      const { Discussion } = await import('./mongodb');
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      
      const discussion = new Discussion({
        movieId,
        title: title.trim(),
        content: content.trim(),
        createdBy: req.user.id,
        username: req.user.username,
        tags: tags || []
      });
      
      await discussion.save();
      res.json(discussion);
    } catch (error) {
      console.error("Error creating discussion:", error);
      res.status(500).json({ message: "Failed to create discussion" });
    }
  });

  // Vote on a discussion
  app.post("/api/discussions/:id/vote", authenticateToken, async (req: any, res) => {
    try {
      const { id: discussionId } = req.params;
      const { type } = req.body; // 'up' or 'down'
      const userId = req.user.id;
      const { Discussion } = await import('./mongodb');
      
      const discussion = await Discussion.findById(discussionId);
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      // Remove existing votes
      discussion.upvotes = discussion.upvotes.filter(id => id !== userId);
      discussion.downvotes = discussion.downvotes.filter(id => id !== userId);
      
      // Add new vote
      if (type === 'up') {
        discussion.upvotes.push(userId);
      } else if (type === 'down') {
        discussion.downvotes.push(userId);
      }
      
      await discussion.save();
      
      res.json({
        upvotes: discussion.upvotes.length,
        downvotes: discussion.downvotes.length,
        score: discussion.upvotes.length - discussion.downvotes.length
      });
    } catch (error) {
      console.error("Error voting on discussion:", error);
      res.status(500).json({ message: "Failed to vote" });
    }
  });

  // ===================== MEDIA PROCESSING API =====================

  // Upload and optimize movie poster
  app.post("/api/admin/movies/:id/poster", authenticateToken, upload.single('poster'), async (req: any, res) => {
    try {
      const movieId = req.params.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No poster image uploaded" });
      }

      // Validate image
      const validation = await ImageOptimizationService.validateImage(file.buffer);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }

      // Optimize poster
      const optimizationResult = await ImageOptimizationService.optimizeMoviePoster(
        file.buffer,
        movieId,
        '/tmp/image-processing'
      );

      if (!optimizationResult.success) {
        return res.status(500).json({ 
          message: "Image optimization failed", 
          error: optimizationResult.error 
        });
      }

      // Update movie with poster URLs
      const posterUrls: Record<string, string> = {};
      for (const output of optimizationResult.outputs) {
        if (output.url) {
          posterUrls[`${output.size}_${output.format}`] = output.url;
        }
      }

      await mongoStorage.updateMovie(movieId, { 
        posterPath: posterUrls['medium_webp'] || posterUrls[Object.keys(posterUrls)[0]],
        posterVariants: posterUrls
      });

      // Invalidate cache
      await CacheService.clearCache(`movie:${movieId}`);

      res.json({ 
        success: true, 
        message: 'Poster uploaded and optimized successfully',
        variants: posterUrls
      });
    } catch (error) {
      console.error("Error uploading poster:", error);
      res.status(500).json({ message: "Failed to upload poster" });
    }
  });

  // Performance monitoring endpoint
  app.get("/api/performance/stats", async (req, res) => {
    try {
      const cacheStats = await CacheService.getCacheStats();
      
      // Simple performance metrics
      const performanceStats = {
        cache: cacheStats,
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version
        },
        timestamp: new Date().toISOString()
      };

      res.json(performanceStats);
    } catch (error) {
      console.error("Error getting performance stats:", error);
      res.status(500).json({ message: "Failed to get performance stats" });
    }
  });

  // Cache management endpoints
  app.post("/api/cache/clear", authenticateToken, async (req: any, res) => {
    try {
      const { pattern } = req.body;
      
      if (pattern) {
        await CacheService.invalidatePattern(pattern);
        res.json({ success: true, message: `Cleared cache pattern: ${pattern}` });
      } else {
        // Clear all cache
        await CacheService.invalidatePattern('*');
        res.json({ success: true, message: 'Cleared all cache' });
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      res.status(500).json({ message: "Failed to clear cache" });
    }
  });

  app.get("/api/cache/test", async (req, res) => {
    try {
      const result = await CacheService.testConnection();
      res.json(result);
    } catch (error) {
      console.error("Cache test failed:", error);
      res.status(500).json({ message: "Cache test failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}