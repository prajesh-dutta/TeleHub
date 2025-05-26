import { Movie } from "@shared/schema";

// Sample movie data for demonstration - in production this would come from TMDB API
export const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "The Cabinet of Dr. Caligari",
    overview: "Francis, a young man, recalls in his memory the horrible experiences he and his fiancée Jane recently went through. It is the end of the 19th century, and the small German town of Holstenwall is terrorized by Dr. Caligari.",
    posterPath: "/cabinet-of-dr-caligari.jpg",
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
    posterPath: "/metropolis.jpg",
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
    overview: "Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter's wife. Silent horror film.",
    posterPath: "/nosferatu.jpg", 
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
    overview: "The Tramp goes to the Klondike in search of gold and finds it and more.",
    posterPath: "/gold-rush.jpg",
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
    posterPath: "/battleship-potemkin.jpg",
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
    overview: "A boy leaves his small country town and heads to the big city to get a job. As soon as he makes it big his sweetheart will join him and marry him.",
    posterPath: "/safety-last.jpg",
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
  }
];

// Movie data management functions
export const getMoviesByGenre = (genre: string, movies: Movie[] = sampleMovies): Movie[] => {
  return movies.filter(movie => 
    movie.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
  );
};

export const getPublicDomainMovies = (movies: Movie[] = sampleMovies): Movie[] => {
  return movies.filter(movie => movie.isPublicDomain);
};

export const searchMovies = (query: string, movies: Movie[] = sampleMovies): Movie[] => {
  const lowerQuery = query.toLowerCase();
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.overview.toLowerCase().includes(lowerQuery) ||
    movie.genres.some(genre => genre.toLowerCase().includes(lowerQuery)) ||
    movie.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getFeaturedMovies = (limit: number = 6, movies: Movie[] = sampleMovies): Movie[] => {
  return movies
    .sort((a, b) => b.communityRating - a.communityRating)
    .slice(0, limit);
};
