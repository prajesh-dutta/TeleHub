import mongoose from 'mongoose';

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  subscriptionTier: { type: String, default: 'explorer', enum: ['explorer', 'cinephile', 'family'] },
  profile: {
    bio: String,
    favoriteGenres: [String],
    watchlist: [String], // Movie IDs
    favorites: [String], // Movie IDs - separate from watchlist
    followers: [String], // User IDs
    following: [String], // User IDs
    watchHistory: [{
      movieId: String,
      watchedAt: { type: Date, default: Date.now },
      progress: { type: Number, default: 0 } // percentage watched
    }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Movie Schema for MongoDB
const movieSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  overview: String,
  director: String,
  year: Number,
  runtime: Number,
  posterUrl: String,
  backdropUrl: String,
  videoUrl: String, // S3 URL for streaming
  trailerUrl: String,
  genres: [String],
  language: { type: String, default: 'english' },
  country: { type: String, default: 'usa' },
  rating: { type: Number, default: 0 },
  isPublicDomain: { type: Boolean, default: true },
  streamingPlatform: { type: String, default: 'telehub' },
  tags: [String],
  cast: [String],
  crew: [{
    name: String,
    role: String
  }],
  awards: [String],
  imdbId: String,
  tmdbId: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  reviewText: { type: String, required: true, minlength: 10 },
  helpfulVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Collection Schema
const collectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  movieIds: [String], // Array of movie IDs
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Watch Party Schema
const watchPartySchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: { type: Number, default: 50 },  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Comment Schema for movie discussions
const commentSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true, maxlength: 1000 },
  parentCommentId: { type: String }, // For reply functionality
  likes: [{ type: String }], // Array of user IDs who liked
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Rating Schema for movie ratings
const ratingSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  review: { type: String, maxlength: 500 }, // Optional short review
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Movie Discussion Schema for organized discussions
const discussionSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  username: { type: String, required: true },
  tags: [String],
  upvotes: [{ type: String }], // Array of user IDs
  downvotes: [{ type: String }], // Array of user IDs
  commentCount: { type: Number, default: 0 },
  isSticky: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Like Schema for tracking likes on various content
const likeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetId: { type: String, required: true }, // ID of liked content (comment, review, etc.)
  targetType: { type: String, required: true, enum: ['comment', 'review', 'discussion'] },
  createdAt: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.model('User', userSchema);
export const Movie = mongoose.model('Movie', movieSchema);
export const Review = mongoose.model('Review', reviewSchema);
export const Collection = mongoose.model('Collection', collectionSchema);
export const WatchParty = mongoose.model('WatchParty', watchPartySchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Rating = mongoose.model('Rating', ratingSchema);
export const Discussion = mongoose.model('Discussion', discussionSchema);
export const Like = mongoose.model('Like', likeSchema);

// Connect to MongoDB
export async function connectToMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// MongoDB Storage Implementation
export class MongoStorage {
  // User operations
  async getUser(id: string) {
    return await User.findById(id);
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async getUserByUsername(username: string) {
    return await User.findOne({ username });
  }

  async getUserByGoogleId(googleId: string) {
    return await User.findOne({ googleId });
  }

  async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(id: string, updates: any) {
    return await User.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
  }

  async deleteUser(id: string) {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  // Review operations
  async getReview(id: string) {
    return await Review.findById(id).populate('userId', 'username profileImageUrl');
  }

  async getReviewsByMovie(movieId: string) {
    return await Review.find({ movieId }).populate('userId', 'username profileImageUrl');
  }

  async getReviewsByUser(userId: string) {
    return await Review.find({ userId });
  }

  async createReview(reviewData: any) {
    const review = new Review(reviewData);
    return await review.save();
  }

  async updateReview(id: string, updates: any) {
    return await Review.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
  }

  async deleteReview(id: string) {
    const result = await Review.findByIdAndDelete(id);
    return !!result;
  }

  // Collection operations
  async getCollection(id: string) {
    return await Collection.findById(id).populate('userId', 'username profileImageUrl');
  }

  async getCollectionsByUser(userId: string) {
    return await Collection.find({ userId });
  }

  async getPublicCollections(limit = 20) {
    return await Collection.find({ isPublic: true }).limit(limit).populate('userId', 'username profileImageUrl');
  }

  async createCollection(collectionData: any) {
    const collection = new Collection(collectionData);
    return await collection.save();
  }

  async updateCollection(id: string, updates: any) {
    return await Collection.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
  }

  async deleteCollection(id: string) {
    const result = await Collection.findByIdAndDelete(id);
    return !!result;
  }

  // Watch Party operations
  async getWatchParty(id: string) {
    return await WatchParty.findById(id).populate('creatorId participants', 'username profileImageUrl');
  }

  async getWatchPartiesByUser(userId: string) {
    return await WatchParty.find({
      $or: [{ creatorId: userId }, { participants: userId }]
    }).populate('creatorId participants', 'username profileImageUrl');
  }

  async getUpcomingWatchParties(limit = 20) {
    return await WatchParty.find({
      isActive: true,
      scheduledTime: { $gt: new Date() }
    })
    .sort({ scheduledTime: 1 })
    .limit(limit)
    .populate('creatorId participants', 'username profileImageUrl');
  }

  async createWatchParty(watchPartyData: any) {
    const watchParty = new WatchParty(watchPartyData);
    return await watchParty.save();
  }

  async updateWatchParty(id: string, updates: any) {
    return await WatchParty.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteWatchParty(id: string) {
    const result = await WatchParty.findByIdAndDelete(id);
    return !!result;
  }

  // Movie operations
  async getMovie(id: string) {
    return await Movie.findOne({ id });
  }

  async getMovies(limit = 20, offset = 0) {
    return await Movie.find().skip(offset).limit(limit);
  }

  async getMoviesByGenre(genre: string, limit = 20) {
    return await Movie.find({ genres: { $in: [genre] } }).limit(limit);
  }

  async searchMovies(query: string, limit = 20) {
    return await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }).limit(limit);
  }

  async getFeaturedMovies(limit = 10) {
    return await Movie.find({ featured: true }).limit(limit);
  }

  async getPublicDomainMovies(limit = 20) {
    return await Movie.find({ isPublicDomain: true }).limit(limit);
  }

  async createMovie(movieData: any) {
    const movie = new Movie(movieData);
    return await movie.save();
  }

  async updateMovie(id: string, updates: any) {
    return await Movie.findOneAndUpdate({ id }, { ...updates, updatedAt: new Date() }, { new: true });
  }

  async deleteMovie(id: string) {
    const result = await Movie.findOneAndDelete({ id });
    return !!result;
  }

  // Favorites and Watchlist operations
  async addToFavorites(userId: string, movieId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { 'profile.favorites': movieId } },
      { new: true }
    );
  }

  async removeFromFavorites(userId: string, movieId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { 'profile.favorites': movieId } },
      { new: true }
    );
  }

  async addToWatchlist(userId: string, movieId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { 'profile.watchlist': movieId } },
      { new: true }
    );
  }

  async removeFromWatchlist(userId: string, movieId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { 'profile.watchlist': movieId } },
      { new: true }
    );
  }

  async getUserFavorites(userId: string) {
    const user = await User.findById(userId);
    if (!user?.profile?.favorites) return [];
    
    return await Movie.find({ id: { $in: user.profile.favorites } });
  }

  async getUserWatchlist(userId: string) {
    const user = await User.findById(userId);
    if (!user?.profile?.watchlist) return [];
    
    return await Movie.find({ id: { $in: user.profile.watchlist } });
  }

  async updateWatchHistory(userId: string, movieId: string, progress: number) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          'profile.watchHistory': {
            movieId,
            watchedAt: new Date(),
            progress
          }
        }
      },
      { new: true }
    );
  }

  async initializeClassicCinema(): Promise<void> {
    try {
      // Check if movies already exist
      const existingMovies = await Movie.find().limit(1);
      if (existingMovies.length > 0) {
        console.log('🎬 Movies already exist in database, skipping initialization');
        return;
      }

      console.log('🎬 Initializing classic cinema collection...');

      // Classic Films from Archive.org and other public sources
      const classicMovies = [
        {
          id: "pather-panchali-1955",
          title: "Pather Panchali",
          overview: "The first film in Satyajit Ray's Apu Trilogy, following a poor family in rural Bengal. This masterpiece captures the beauty and hardship of village life with profound humanity.",
          director: "Satyajit Ray",
          year: 1955,
          runtime: 125,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Pather_Panchali_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Pather_Panchali_scene.jpg/1024px-Pather_Panchali_scene.jpg",
          videoUrl: "https://archive.org/download/PatherPanchali1955/Pather%20Panchali%20%281955%29.mp4",
          trailerUrl: "https://archive.org/download/PatherPanchaliTrailer/trailer.mp4",
          genres: ["Drama", "Family", "Coming of Age"],
          language: "hindi",
          country: "india",
          rating: 8.4,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Apu Trilogy", "Rural India", "Neorealism", "Cannes Winner"]
        },
        {
          id: "aparajito-1956", 
          title: "Aparajito",
          overview: "The second film in the Apu Trilogy, following Apu's journey from childhood to adolescence as his family moves from village to city.",
          director: "Satyajit Ray",
          year: 1956,
          runtime: 113,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Aparajito_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Aparajito_scene.jpg/1024px-Aparajito_scene.jpg",
          videoUrl: "https://archive.org/download/Aparajito1956/Aparajito%20%281956%29.mp4",
          trailerUrl: "https://archive.org/download/AparajitoTrailer/trailer.mp4",
          genres: ["Drama", "Coming of Age", "Family"],
          language: "hindi",
          country: "india", 
          rating: 8.2,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Apu Trilogy", "Education", "Golden Lion Winner"]
        },
        {
          id: "apur-sansar-1959",
          title: "Apur Sansar",
          overview: "The final film in the Apu Trilogy, showing Apu's life as a young man, his marriage, and personal tragedy.",
          director: "Satyajit Ray",
          year: 1959,
          runtime: 105,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Apur_Sansar_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Apur_Sansar_scene.jpg/1024px-Apur_Sansar_scene.jpg",
          videoUrl: "https://archive.org/download/ApurSansar1959/Apur%20Sansar%20%281959%29.mp4",
          trailerUrl: "https://archive.org/download/ApurSansarTrailer/trailer.mp4",
          genres: ["Drama", "Romance", "Coming of Age"],
          language: "hindi",
          country: "india",
          rating: 8.3,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Apu Trilogy", "Marriage", "Loss"]
        },
        {
          id: "charulata-1964",
          title: "Charulata",
          overview: "Satyajit Ray's adaptation of Rabindranath Tagore's novel about a lonely housewife in 19th-century Bengal.",
          director: "Satyajit Ray",
          year: 1964,
          runtime: 117,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Charulata_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Charulata_scene.jpg/1024px-Charulata_scene.jpg",
          videoUrl: "https://archive.org/download/Charulata1964/Charulata%20%281964%29.mp4",
          trailerUrl: "https://archive.org/download/CharulataTrailer/trailer.mp4",
          genres: ["Drama", "Romance", "Period"],
          language: "hindi",
          country: "india",
          rating: 8.5,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Tagore Adaptation", "Women's Stories", "19th Century"]
        },
        {
          id: "jalsaghar-1958",
          title: "Jalsaghar",
          overview: "The story of a declining aristocrat who maintains his music room as the last symbol of his former glory.",
          director: "Satyajit Ray",
          year: 1958,
          runtime: 100,
          posterUrl: "https://upload.wikimedia.org/wikipedia/commons/j/j8/Jalsaghar_poster.jpg",
          backdropUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Jalsaghar_scene.jpg/1024px-Jalsaghar_scene.jpg",
          videoUrl: "https://archive.org/download/Jalsaghar1958/Jalsaghar%20%281958%29.mp4",
          trailerUrl: "https://archive.org/download/JalsagharTrailer/trailer.mp4",
          genres: ["Drama", "Music", "Period"],
          language: "hindi",
          country: "india",
          rating: 8.1,
          isPublicDomain: true,
          streamingPlatform: "archive",
          tags: ["Satyajit Ray", "Classical Music", "Aristocracy", "Decline"]
        }
      ];

      // Insert movies into database
      console.log(`🎭 Adding ${classicMovies.length} classic movies to database...`);
      await Movie.insertMany(classicMovies);
      
      console.log('✅ Classic cinema collection initialized successfully!');
      console.log(`🎬 Added ${classicMovies.length} movies to the database`);
      
    } catch (error) {
      console.error('❌ Failed to initialize classic cinema collection:', error);
      throw error;
    }
  }
}