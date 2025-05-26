import { z } from "zod";

// User schema for MongoDB
export const userSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  googleId: z.string().optional(),
  profile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    favoriteGenres: z.array(z.string()).default([]),
    watchlist: z.array(z.string()).default([]),
    followers: z.array(z.string()).default([]),
    following: z.array(z.string()).default([])
  }).optional(),
  subscriptionTier: z.enum(['explorer', 'cinephile', 'family']).default('explorer'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Movie schema
export const movieSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  tmdbId: z.number().optional(),
  title: z.string(),
  overview: z.string().optional(),
  posterPath: z.string().optional().nullable(),
  backdropPath: z.string().optional().nullable(),
  releaseDate: z.string().optional(),
  runtime: z.number().optional(),
  genres: z.array(z.string()).default([]),
  rating: z.number().min(0).max(10).default(0),
  voteCount: z.number().default(0),
  isPublicDomain: z.boolean().default(false),
  streamingLinks: z.array(z.object({
    platform: z.string(),
    url: z.string()
  })).default([]),
  communityRating: z.number().min(0).max(10).default(0),
  tags: z.array(z.string()).default([])
});

// Review schema
export const reviewSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  userId: z.string(),
  movieId: z.string(),
  rating: z.number().min(1).max(10),
  reviewText: z.string().min(10),
  helpfulVotes: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Collection schema
export const collectionSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  movieIds: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Watch Party schema
export const watchPartySchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  creatorId: z.string(),
  movieId: z.string(),
  scheduledTime: z.date(),
  participants: z.array(z.string()).default([]),
  maxParticipants: z.number().default(50),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date())
});

// Insert schemas (omitting auto-generated fields)
export const insertUserSchema = userSchema.omit({ _id: true, id: true, createdAt: true, updatedAt: true });
export const insertMovieSchema = movieSchema.omit({ _id: true });
export const insertReviewSchema = reviewSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export const insertCollectionSchema = collectionSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export const insertWatchPartySchema = watchPartySchema.omit({ _id: true, createdAt: true });

// Types
export type User = z.infer<typeof userSchema>;
export type Movie = z.infer<typeof movieSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type WatchParty = z.infer<typeof watchPartySchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type InsertWatchParty = z.infer<typeof insertWatchPartySchema>;

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
