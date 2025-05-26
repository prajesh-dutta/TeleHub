import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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