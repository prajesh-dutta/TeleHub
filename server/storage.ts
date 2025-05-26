import { 
  User, 
  Movie, 
  Review, 
  Collection, 
  WatchParty,
  InsertUser, 
  InsertMovie, 
  InsertReview, 
  InsertCollection, 
  InsertWatchParty 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private movies: Map<string, Movie> = new Map();
  private reviews: Map<string, Review> = new Map();
  private collections: Map<string, Collection> = new Map();
  private watchParties: Map<string, WatchParty> = new Map();
  private currentId: number = 1;

  constructor() {
    this.initializeMovies();
  }

  private generateId(): string {
    return (this.currentId++).toString();
  }

  private initializeMovies() {
    // Initialize with classic public domain movies
    const movies: Movie[] = [
      {
        id: "1",
        title: "The Cabinet of Dr. Caligari",
        overview: "Francis, a young man, recalls in his memory the horrible experiences he and his fiancée Jane recently went through. A groundbreaking work of German Expressionist cinema.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1920-02-26",
        runtime: 76,
        genres: ["Horror", "Mystery", "Thriller"],
        rating: 8.0,
        voteCount: 45000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/the-cabinet-of-dr-caligari" }
        ],
        communityRating: 8.2,
        tags: ["german expressionism", "silent film", "classic horror"]
      },
      {
        id: "2", 
        title: "Metropolis",
        overview: "In a futuristic city sharply divided between the rich and the poor, the son of the city's mastermind meets a prophet who predicts the coming of a savior to mediate their differences.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1927-01-10",
        runtime: 153,
        genres: ["Science Fiction", "Drama"],
        rating: 8.3,
        voteCount: 78000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/metropolis" }
        ],
        communityRating: 8.5,
        tags: ["silent film", "dystopian", "german expressionism"]
      },
      {
        id: "3",
        title: "Nosferatu",
        overview: "Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter's wife. A masterpiece of silent horror cinema.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1922-03-04",
        runtime: 94,
        genres: ["Horror", "Fantasy"],
        rating: 7.9,
        voteCount: 52000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/nosferatu" }
        ],
        communityRating: 8.0,
        tags: ["vampire", "silent film", "german expressionism"]
      },
      {
        id: "4",
        title: "The Gold Rush",
        overview: "The Tramp goes to the Klondike in search of gold and finds it and more. Charlie Chaplin's beloved comedy masterpiece.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1925-06-26", 
        runtime: 95,
        genres: ["Comedy", "Adventure"],
        rating: 8.2,
        voteCount: 42000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/the-gold-rush" }
        ],
        communityRating: 8.3,
        tags: ["charlie chaplin", "silent comedy", "classic"]
      },
      {
        id: "5",
        title: "Battleship Potemkin",
        overview: "In the midst of the Russian Revolution of 1905, the crew of the battleship Potemkin mutiny against the brutal, tyrannical regime of the vessel's officers.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1925-12-21",
        runtime: 75,
        genres: ["Drama", "History"],
        rating: 8.0,
        voteCount: 35000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/battleship-potemkin" }
        ],
        communityRating: 8.1,
        tags: ["soviet montage", "silent film", "revolution"]
      },
      {
        id: "6",
        title: "Safety Last!",
        overview: "A boy leaves his small country town and heads to the big city to get a job. Harold Lloyd's death-defying comedy featuring the famous clock tower scene.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1923-04-01",
        runtime: 70,
        genres: ["Comedy", "Romance"],
        rating: 8.1,
        voteCount: 28000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/safety-last" }
        ],
        communityRating: 8.2,
        tags: ["harold lloyd", "silent comedy", "clock tower"]
      },
      {
        id: "7",
        title: "The Third Man",
        overview: "A writer of westerns goes to Vienna to meet his friend Harry Lime but finds that his friend has died in suspicious circumstances.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1949-08-31",
        runtime: 104,
        genres: ["Film Noir", "Thriller", "Mystery"],
        rating: 9.2,
        voteCount: 156000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/the-third-man" }
        ],
        communityRating: 9.1,
        tags: ["film noir", "post-war", "vienna", "zither score"]
      },
      {
        id: "8",
        title: "Birth of a Nation",
        overview: "The Stoneman family finds itself in danger when the Civil War breaks out. A controversial but historically significant film.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1915-02-08",
        runtime: 195,
        genres: ["Drama", "History"],
        rating: 6.2,
        voteCount: 25000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/birth-of-a-nation" }
        ],
        communityRating: 6.5,
        tags: ["silent film", "civil war", "controversial"]
      },
      {
        id: "9",
        title: "Casablanca",
        overview: "A cynical nightclub owner protects an old flame and her husband from Nazis in Morocco. One of the greatest films ever made.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1942-11-26",
        runtime: 102,
        genres: ["Romance", "Drama", "War"],
        rating: 9.5,
        voteCount: 180000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/casablanca" }
        ],
        communityRating: 9.4,
        tags: ["romance", "world war ii", "classic", "humphrey bogart"]
      },
      {
        id: "10",
        title: "Citizen Kane",
        overview: "Following the death of publishing tycoon Charles Foster Kane, reporters scramble to discover the meaning of his final word: 'Rosebud.'",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1941-04-17",
        runtime: 119,
        genres: ["Drama", "Mystery"],
        rating: 9.1,
        voteCount: 142000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/citizen-kane" }
        ],
        communityRating: 9.2,
        tags: ["orson welles", "masterpiece", "cinematography", "deep focus"]
      },
      {
        id: "11",
        title: "The Maltese Falcon",
        overview: "A private detective takes on a case that involves him with three eccentric criminals, a gorgeous liar, and their quest for a priceless statuette.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1941-10-03",
        runtime: 100,
        genres: ["Film Noir", "Crime", "Mystery"],
        rating: 8.5,
        voteCount: 89000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/maltese-falcon" }
        ],
        communityRating: 8.6,
        tags: ["film noir", "detective", "humphrey bogart", "dashiell hammett"]
      },
      {
        id: "12",
        title: "Vertigo",
        overview: "A former police detective juggles wrestling with his personal demons and becoming obsessed with a woman who reminds him of a murder case.",
        posterPath: undefined,
        backdropPath: undefined,
        releaseDate: "1958-05-09",
        runtime: 128,
        genres: ["Thriller", "Romance", "Mystery"],
        rating: 9.3,
        voteCount: 125000,
        isPublicDomain: true,
        streamingLinks: [
          { platform: "Internet Archive", url: "https://archive.org/details/vertigo" }
        ],
        communityRating: 9.1,
        tags: ["alfred hitchcock", "psychological thriller", "obsession", "san francisco"]
      }
    ];

    movies.forEach(movie => {
      this.movies.set(movie.id, movie);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Movie operations
  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovies(limit = 20, offset = 0): Promise<Movie[]> {
    const movies = Array.from(this.movies.values());
    return movies.slice(offset, offset + limit);
  }

  async getMoviesByGenre(genre: string, limit = 20): Promise<Movie[]> {
    const movies = Array.from(this.movies.values())
      .filter(movie => movie.genres.some(g => g.toLowerCase().includes(genre.toLowerCase())))
      .slice(0, limit);
    return movies;
  }

  async getPublicDomainMovies(limit = 20): Promise<Movie[]> {
    const movies = Array.from(this.movies.values())
      .filter(movie => movie.isPublicDomain)
      .slice(0, limit);
    return movies;
  }

  async searchMovies(query: string, limit = 20): Promise<Movie[]> {
    const lowerQuery = query.toLowerCase();
    const movies = Array.from(this.movies.values())
      .filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.overview?.toLowerCase().includes(lowerQuery) ||
        movie.genres.some(genre => genre.toLowerCase().includes(lowerQuery)) ||
        movie.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, limit);
    return movies;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const movie: Movie = { ...insertMovie };
    this.movies.set(movie.id, movie);
    return movie;
  }

  async updateMovie(id: string, updates: Partial<Movie>): Promise<Movie | undefined> {
    const movie = this.movies.get(id);
    if (!movie) return undefined;

    const updatedMovie = { ...movie, ...updates };
    this.movies.set(id, updatedMovie);
    return updatedMovie;
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByMovie(movieId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.movieId === movieId);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.userId === userId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const review: Review = {
      ...insertReview,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reviews.set(review.id, review);
    return review;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;

    const updatedReview = { ...review, ...updates, updatedAt: new Date() };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.reviews.delete(id);
  }

  // Collection operations
  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollectionsByUser(userId: string): Promise<Collection[]> {
    return Array.from(this.collections.values()).filter(collection => collection.userId === userId);
  }

  async getPublicCollections(limit = 20): Promise<Collection[]> {
    return Array.from(this.collections.values())
      .filter(collection => collection.isPublic)
      .slice(0, limit);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const collection: Collection = {
      ...insertCollection,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.collections.set(collection.id, collection);
    return collection;
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;

    const updatedCollection = { ...collection, ...updates, updatedAt: new Date() };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteCollection(id: string): Promise<boolean> {
    return this.collections.delete(id);
  }

  // Watch Party operations
  async getWatchParty(id: string): Promise<WatchParty | undefined> {
    return this.watchParties.get(id);
  }

  async getWatchPartiesByUser(userId: string): Promise<WatchParty[]> {
    return Array.from(this.watchParties.values())
      .filter(party => party.creatorId === userId || party.participants.includes(userId));
  }

  async getUpcomingWatchParties(limit = 20): Promise<WatchParty[]> {
    const now = new Date();
    return Array.from(this.watchParties.values())
      .filter(party => party.scheduledTime > now && party.isActive)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
      .slice(0, limit);
  }

  async createWatchParty(insertWatchParty: InsertWatchParty): Promise<WatchParty> {
    const watchParty: WatchParty = {
      ...insertWatchParty,
      createdAt: new Date()
    };
    this.watchParties.set(watchParty.id, watchParty);
    return watchParty;
  }

  async updateWatchParty(id: string, updates: Partial<WatchParty>): Promise<WatchParty | undefined> {
    const watchParty = this.watchParties.get(id);
    if (!watchParty) return undefined;

    const updatedWatchParty = { ...watchParty, ...updates };
    this.watchParties.set(id, updatedWatchParty);
    return updatedWatchParty;
  }

  async deleteWatchParty(id: string): Promise<boolean> {
    return this.watchParties.delete(id);
  }
}

export const storage = new MemStorage();
