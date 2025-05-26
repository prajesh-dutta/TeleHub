import {
  users,
  movies,
  reviews,
  collections,
  watchParties,
  type User,
  type UpsertUser,
  type Movie,
  type InsertMovie,
  type Review,
  type InsertReview,
  type Collection,
  type InsertCollection,
  type WatchParty,
  type InsertWatchParty
} from "@shared/schema";
import { db } from "./db";
import { eq, like, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Movie operations
  getMovie(id: string): Promise<Movie | undefined>;
  getMovies(limit?: number, offset?: number): Promise<Movie[]>;
  getMoviesByGenre(genre: string, limit?: number): Promise<Movie[]>;
  getPublicDomainMovies(limit?: number): Promise<Movie[]>;
  searchMovies(query: string, limit?: number): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: string, updates: Partial<Movie>): Promise<Movie | undefined>;

  // Review operations
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByMovie(movieId: string): Promise<Review[]>;
  getReviewsByUser(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;

  // Collection operations
  getCollection(id: string): Promise<Collection | undefined>;
  getCollectionsByUser(userId: string): Promise<Collection[]>;
  getPublicCollections(limit?: number): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined>;
  deleteCollection(id: string): Promise<boolean>;

  // Watch Party operations
  getWatchParty(id: string): Promise<WatchParty | undefined>;
  getWatchPartiesByUser(userId: string): Promise<WatchParty[]>;
  getUpcomingWatchParties(limit?: number): Promise<WatchParty[]>;
  createWatchParty(watchParty: InsertWatchParty): Promise<WatchParty>;
  updateWatchParty(id: string, updates: Partial<WatchParty>): Promise<WatchParty | undefined>;
  deleteWatchParty(id: string): Promise<boolean>;

  // Initialize with Bengali cinema content
  initializeBengaliCinema(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeBengaliCinema();
  }

  async initializeBengaliCinema(): Promise<void> {
    try {
      // Check if movies already exist
      const existingMovies = await db.select().from(movies).limit(1);
      if (existingMovies.length > 0) return;

      // Bengali Classic Films from Archive.org and other public sources
      const bengaliClassics: InsertMovie[] = [
        {
          id: "pather-panchali-1955",
          title: "Pather Panchali",
          bengaliTitle: "পথের পাঁচালী",
          overview: "The first film in Satyajit Ray's Apu Trilogy, following a poor family in rural Bengal. This masterpiece captures the beauty and hardship of village life with profound humanity.",
          director: "Satyajit Ray",
          year: 1955,
          runtime: 125,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Pather_Panchali_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Pather_Panchali_scene.jpg/1024px-Pather_Panchali_scene.jpg",
          videoUrl: "https://archive.org/download/PatherPanchali1955/Pather%20Panchali%20%281955%29.mp4",
          trailerUrl: "https://archive.org/download/PatherPanchaliTrailer/trailer.mp4",
          genres: ["Drama", "Family", "Coming of Age"],
          language: "bengali",
          country: "india",
          rating: 8.4,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Apu Trilogy", "Rural Bengal", "Neorealism", "Cannes Winner"]
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
          videoUrl: "https://archive.org/download/Aparajito1956/Aparajito%20%281956%29.mp4",
          trailerUrl: "https://archive.org/download/AparajitoTrailer/trailer.mp4",
          genres: ["Drama", "Coming of Age", "Family"],
          language: "bengali",
          country: "india", 
          rating: 8.2,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Apu Trilogy", "Education", "Golden Lion Winner"]
        },
        {
          id: "apur-sansar-1959",
          title: "Apur Sansar",
          bengaliTitle: "অপুর সংসার",
          overview: "The final film in the Apu Trilogy, showing Apu's adult life as he struggles with love, loss, and responsibility.",
          director: "Satyajit Ray",
          year: 1959,
          runtime: 105,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Apur_Sansar_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Apur_Sansar_scene.jpg/1024px-Apur_Sansar_scene.jpg",
          videoUrl: "https://archive.org/download/ApurSansar1959/Apur%20Sansar%20%281959%29.mp4",
          trailerUrl: "https://archive.org/download/ApurSansarTrailer/trailer.mp4",
          genres: ["Drama", "Romance", "Family"],
          language: "bengali",
          country: "india",
          rating: 8.3,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Apu Trilogy", "Love", "Loss", "Masterpiece"]
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
          videoUrl: "https://archive.org/download/Charulata1964/Charulata%20%281964%29.mp4",
          trailerUrl: "https://archive.org/download/CharulataTrailer/trailer.mp4",
          genres: ["Drama", "Romance", "Period"],
          language: "bengali",
          country: "india",
          rating: 8.5,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Women", "19th Century", "Emotional Drama", "Silver Bear Winner"]
        },
        {
          id: "mahanagar-1963",
          title: "Mahanagar",
          bengaliTitle: "মহানগর",
          overview: "A progressive film about a woman who goes to work to support her family, challenging traditional gender roles in 1960s Calcutta.",
          director: "Satyajit Ray",
          year: 1963,
          runtime: 131,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Mahanagar_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Mahanagar_scene.jpg/1024px-Mahanagar_scene.jpg",
          videoUrl: "https://archive.org/download/Mahanagar1963/Mahanagar%20%281963%29.mp4",
          trailerUrl: "https://archive.org/download/MahanagarTrailer/trailer.mp4",
          genres: ["Drama", "Social", "Urban"],
          language: "bengali",
          country: "india",
          rating: 8.1,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Women's Rights", "Calcutta", "Social Change", "Working Women"]
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
          videoUrl: "https://archive.org/download/Jalsaghar1958/Jalsaghar%20%281958%29.mp4",
          trailerUrl: "https://archive.org/download/JalsagharTrailer/trailer.mp4",
          genres: ["Drama", "Music", "Period"],
          language: "bengali",
          country: "india",
          rating: 8.0,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Classical Music", "Aristocracy", "Decline", "Feudalism"]
        },
        {
          id: "devi-1960",
          title: "Devi",
          bengaliTitle: "দেবী",
          overview: "A powerful drama about religious fanaticism and its impact on a young woman believed to be a goddess incarnate.",
          director: "Satyajit Ray",
          year: 1960,
          runtime: 93,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Devi_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Devi_scene.jpg/1024px-Devi_scene.jpg",
          videoUrl: "https://archive.org/download/Devi1960/Devi%20%281960%29.mp4",
          trailerUrl: "https://archive.org/download/DeviTrailer/trailer.mp4",
          genres: ["Drama", "Religious", "Psychological"],
          language: "bengali",
          country: "india",
          rating: 7.9,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Religion", "Superstition", "Women", "Fanaticism"]
        },
        {
          id: "teen-kanya-1961",
          title: "Teen Kanya",
          bengaliTitle: "তিন কন্যা",
          overview: "Three short stories by Rabindranath Tagore adapted by Ray, exploring themes of love, sacrifice, and social change.",
          director: "Satyajit Ray",
          year: 1961,
          runtime: 114,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/t/t8/Teen_Kanya_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Teen_Kanya_scene.jpg/1024px-Teen_Kanya_scene.jpg",
          videoUrl: "https://archive.org/download/TeenKanya1961/Teen%20Kanya%20%281961%29.mp4",
          trailerUrl: "https://archive.org/download/TeenKanyaTrailer/trailer.mp4",
          genres: ["Drama", "Anthology", "Romance"],
          language: "bengali",
          country: "india",
          rating: 7.8,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Rabindranath Tagore", "Short Stories", "Anthology", "Literature"]
        }
      ];

      // Insert movies into database
      for (const movie of bengaliClassics) {
        await db.insert(movies).values(movie).onConflictDoNothing();
      }

      console.log("Bengali cinema collection initialized successfully!");
    } catch (error) {
      console.error("Error initializing Bengali cinema:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount! > 0;
  }

  // Movie operations
  async getMovie(id: string): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie || undefined;
  }

  async getMovies(limit = 20, offset = 0): Promise<Movie[]> {
    return await db.select().from(movies).limit(limit).offset(offset);
  }

  async getMoviesByGenre(genre: string, limit = 20): Promise<Movie[]> {
    const allMovies = await db.select().from(movies);
    return allMovies
      .filter(movie => movie.genres?.includes(genre))
      .slice(0, limit);
  }

  async getPublicDomainMovies(limit = 20): Promise<Movie[]> {
    return await db
      .select()
      .from(movies)
      .where(eq(movies.isPublicDomain, true))
      .limit(limit);
  }

  async searchMovies(query: string, limit = 20): Promise<Movie[]> {
    const allMovies = await db.select().from(movies);
    return allMovies
      .filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.bengaliTitle?.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview?.toLowerCase().includes(query.toLowerCase()) ||
        movie.director?.toLowerCase().includes(query.toLowerCase()) ||
        movie.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, limit);
  }

  async createMovie(movieData: InsertMovie): Promise<Movie> {
    const [movie] = await db
      .insert(movies)
      .values(movieData)
      .returning();
    return movie;
  }

  async updateMovie(id: string, updates: Partial<Movie>): Promise<Movie | undefined> {
    const [movie] = await db
      .update(movies)
      .set(updates)
      .where(eq(movies.id, id))
      .returning();
    return movie || undefined;
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, parseInt(id)));
    return review || undefined;
  }

  async getReviewsByMovie(movieId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.movieId, movieId));
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return review;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, parseInt(id)))
      .returning();
    return review || undefined;
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, parseInt(id)));
    return result.rowCount! > 0;
  }

  // Collection operations
  async getCollection(id: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, parseInt(id)));
    return collection || undefined;
  }

  async getCollectionsByUser(userId: string): Promise<Collection[]> {
    return await db.select().from(collections).where(eq(collections.userId, userId));
  }

  async getPublicCollections(limit = 20): Promise<Collection[]> {
    return await db
      .select()
      .from(collections)
      .where(eq(collections.isPublic, true))
      .limit(limit);
  }

  async createCollection(collectionData: InsertCollection): Promise<Collection> {
    const [collection] = await db
      .insert(collections)
      .values(collectionData)
      .returning();
    return collection;
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined> {
    const [collection] = await db
      .update(collections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(collections.id, parseInt(id)))
      .returning();
    return collection || undefined;
  }

  async deleteCollection(id: string): Promise<boolean> {
    const result = await db.delete(collections).where(eq(collections.id, parseInt(id)));
    return result.rowCount! > 0;
  }

  // Watch Party operations
  async getWatchParty(id: string): Promise<WatchParty | undefined> {
    const [watchParty] = await db.select().from(watchParties).where(eq(watchParties.id, parseInt(id)));
    return watchParty || undefined;
  }

  async getWatchPartiesByUser(userId: string): Promise<WatchParty[]> {
    const allParties = await db.select().from(watchParties);
    return allParties.filter(party => 
      party.creatorId === userId || party.participants?.includes(userId)
    );
  }

  async getUpcomingWatchParties(limit = 20): Promise<WatchParty[]> {
    const allParties = await db.select().from(watchParties);
    const now = new Date();
    return allParties
      .filter(party => party.isActive && party.scheduledTime && party.scheduledTime > now)
      .sort((a, b) => (a.scheduledTime?.getTime() || 0) - (b.scheduledTime?.getTime() || 0))
      .slice(0, limit);
  }

  async createWatchParty(watchPartyData: InsertWatchParty): Promise<WatchParty> {
    const [watchParty] = await db
      .insert(watchParties)
      .values(watchPartyData)
      .returning();
    return watchParty;
  }

  async updateWatchParty(id: string, updates: Partial<WatchParty>): Promise<WatchParty | undefined> {
    const [watchParty] = await db
      .update(watchParties)
      .set(updates)
      .where(eq(watchParties.id, parseInt(id)))
      .returning();
    return watchParty || undefined;
  }

  async deleteWatchParty(id: string): Promise<boolean> {
    const result = await db.delete(watchParties).where(eq(watchParties.id, parseInt(id)));
    return result.rowCount! > 0;
  }
}

export const storage = new DatabaseStorage();