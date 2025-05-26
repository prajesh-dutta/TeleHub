import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { connectToMongoDB, MongoStorage } from "./mongodb";
import { passport } from "./auth";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "telehub-secret-key";
const mongoStorage = new MongoStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection (temporarily disabled)
  // await connectToMongoDB();

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

  // Local login
  app.post('/api/auth/login', passport.authenticate('local'), (req: any, res) => {
    res.json({ 
      success: true, 
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        profileImageUrl: req.user.profileImageUrl
      }
    });
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

      // Create user
      const user = await mongoStorage.createUser({
        email,
        username,
        password: hashedPassword,
        subscriptionTier: 'explorer',
        profile: {
          favoriteGenres: [],
          watchlist: [],
          followers: [],
          following: []
        }
      });

      res.json({ 
        success: true, 
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username
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

  // Get current user
  app.get('/api/auth/me', (req: any, res) => {
    if (req.isAuthenticated()) {
      res.json({
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        profileImageUrl: req.user.profileImageUrl,
        subscriptionTier: req.user.subscriptionTier,
        profile: req.user.profile
      });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Movie routes
  app.get("/api/movies", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const movies = await storage.getMovies(limit, offset);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await storage.getMovie(req.params.id);
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
      const movies = await storage.getMoviesByGenre(req.params.genre, limit);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      res.status(500).json({ message: "Failed to fetch movies by genre" });
    }
  });

  app.get("/api/movies/search/:query", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movies = await storage.searchMovies(req.params.query, limit);
      res.json(movies);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  app.get("/api/movies/public-domain", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movies = await storage.getPublicDomainMovies(limit);
      res.json(movies);
    } catch (error) {
      console.error("Error fetching public domain movies:", error);
      res.status(500).json({ message: "Failed to fetch public domain movies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}