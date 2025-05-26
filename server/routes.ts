import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  insertReviewSchema, 
  insertCollectionSchema,
  insertWatchPartySchema 
} from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "telehub-secret-key";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
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
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Create user
      const user = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        subscriptionTier: 'explorer'
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          subscriptionTier: user.subscriptionTier
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          subscriptionTier: user.subscriptionTier,
          profile: user.profile
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        subscriptionTier: user.subscriptionTier,
        profile: user.profile
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Movie routes
  app.get("/api/movies", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const genre = req.query.genre as string;
      const publicDomain = req.query.publicDomain === 'true';
      const search = req.query.search as string;

      let movies;
      if (search) {
        movies = await storage.searchMovies(search, limit);
      } else if (genre) {
        movies = await storage.getMoviesByGenre(genre, limit);
      } else if (publicDomain) {
        movies = await storage.getPublicDomainMovies(limit);
      } else {
        movies = await storage.getMovies(limit, offset);
      }

      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await storage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Review routes
  app.get("/api/reviews/movie/:movieId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByMovie(req.params.movieId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reviews", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        id: Date.now().toString()
      });

      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Collection routes
  app.get("/api/collections/user/:userId", async (req, res) => {
    try {
      const collections = await storage.getCollectionsByUser(req.params.userId);
      res.json(collections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/collections/public", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const collections = await storage.getPublicCollections(limit);
      res.json(collections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/collections", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertCollectionSchema.parse({
        ...req.body,
        userId: req.user.id,
        id: Date.now().toString()
      });

      const collection = await storage.createCollection(validatedData);
      res.json(collection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Watch Party routes
  app.get("/api/watch-parties/upcoming", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const watchParties = await storage.getUpcomingWatchParties(limit);
      res.json(watchParties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/watch-parties", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertWatchPartySchema.parse({
        ...req.body,
        creatorId: req.user.id,
        id: Date.now().toString()
      });

      const watchParty = await storage.createWatchParty(validatedData);
      res.json(watchParty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User profile routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return public profile data only
      res.json({
        id: user.id,
        username: user.username,
        profile: user.profile,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        subscriptionTier: user.subscriptionTier,
        profile: user.profile
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
