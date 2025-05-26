import { z } from "zod";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  real,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  password: varchar("password"),
  subscriptionTier: varchar("subscription_tier").default('explorer'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Movies table with Bengali cinema focus
export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  bengaliTitle: varchar("bengali_title"),
  overview: text("overview"),
  director: varchar("director"),
  year: integer("year"),
  runtime: integer("runtime"),
  posterUrl: varchar("poster_url"),
  backdropUrl: varchar("backdrop_url"),
  videoUrl: varchar("video_url"), // Direct streaming URL
  trailerUrl: varchar("trailer_url"),
  genres: jsonb("genres").$type<string[]>().default([]),
  language: varchar("language").default('bengali'),
  country: varchar("country").default('india'),
  rating: real("rating").default(0),
  isPublicDomain: boolean("is_public_domain").default(true),
  streamingPlatform: varchar("streaming_platform").default('archive'),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  movieId: varchar("movie_id").references(() => movies.id),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  movieIds: jsonb("movie_ids").$type<string[]>().default([]),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Watch parties table
export const watchParties = pgTable("watch_parties", {
  id: serial("id").primaryKey(),
  creatorId: varchar("creator_id").references(() => users.id),
  movieId: varchar("movie_id").references(() => movies.id),
  scheduledTime: timestamp("scheduled_time"),
  participants: jsonb("participants").$type<string[]>().default([]),
  maxParticipants: integer("max_participants").default(50),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  collections: many(collections),
  watchParties: many(watchParties),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  reviews: many(reviews),
  watchParties: many(watchParties),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  movie: one(movies, { fields: [reviews.movieId], references: [movies.id] }),
}));

// Inferred types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Movie = typeof movies.$inferSelect;
export type InsertMovie = typeof movies.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;
export type WatchParty = typeof watchParties.$inferSelect;
export type InsertWatchParty = typeof watchParties.$inferInsert;

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
