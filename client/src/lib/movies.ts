import { Movie } from "@shared/schema";
import { getAuthHeaders } from "./auth";

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  genre?: string;
  year?: string;
  sortBy?: 'title' | 'releaseDate' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class MoviesService {
  private baseUrl = '/api';

  async getMovies(params: SearchParams = {}): Promise<MoviesResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/movies?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return response.json();
  }

  async getMovie(id: string): Promise<Movie> {
    const response = await fetch(`${this.baseUrl}/movies/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }

    return response.json();
  }

  async getStreamingUrl(movieId: string): Promise<{ url: string }> {
    const response = await fetch(`${this.baseUrl}/movies/${movieId}/stream`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get streaming URL');
    }

    return response.json();
  }

  async getFavorites(): Promise<Movie[]> {
    const response = await fetch(`${this.baseUrl}/favorites`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    return response.json();
  }

  async addToFavorites(movieId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ movieId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(movieId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/favorites/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove from favorites');
    }
  }

  async getWatchlist(): Promise<Movie[]> {
    const response = await fetch(`${this.baseUrl}/watchlist`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch watchlist');
    }

    return response.json();
  }

  async addToWatchlist(movieId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ movieId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to watchlist');
    }
  }

  async removeFromWatchlist(movieId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/watchlist/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove from watchlist');
    }
  }

  async updateWatchProgress(movieId: string, progress: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/movies/${movieId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ progress }),
    });

    if (!response.ok) {
      throw new Error('Failed to update watch progress');
    }
  }

  async getFeaturedMovies(): Promise<Movie[]> {
    const response = await fetch(`${this.baseUrl}/movies/featured`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured movies');
    }

    return response.json();
  }

  async getClassicsMovies(): Promise<Movie[]> {
    return this.getMovies({ 
      genre: 'Classic', 
      sortBy: 'releaseDate', 
      sortOrder: 'asc',
      limit: 20
    }).then(response => response.movies);
  }

  async getDirectorMovies(): Promise<Movie[]> {
    return this.getMovies({ 
      query: 'Classic Director',
      sortBy: 'releaseDate', 
      sortOrder: 'asc',
      limit: 20
    }).then(response => response.movies);
  }
}

export const moviesService = new MoviesService();

// Sample movie data
const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "A Trip to the Moon",
    overview: "Professor Barbenfouillis and five of his colleagues from the Astronomical Club travel to the moon by being shot in a capsule from a giant cannon.",
    posterPath: "/trip-to-moon.jpg",
    releaseDate: "1902-09-01",
    runtime: 14,
    genres: ["Adventure", "Comedy", "Fantasy"],
    rating: 8.1,
    voteCount: 15000,
    isPublicDomain: true,
    streamingLinks: [
      { platform: "Internet Archive", url: "https://archive.org/details/le-voyage-dans-la-lune" }
    ],
    communityRating: 8.0,
    tags: ["Georges Méliès", "silent film", "early cinema"]
  },
  {
    id: "2",
    title: "The Cabinet of Dr. Caligari",
    overview: "Hypnotist Dr. Caligari uses a somnambulist, Cesare, to commit murders.",
    posterPath: "/dr-caligari.jpg",
    releaseDate: "1920-02-26",
    runtime: 76,
    genres: ["Horror", "Thriller"],
    rating: 8.0,
    voteCount: 32000,
    isPublicDomain: true,
    streamingLinks: [
      { platform: "Internet Archive", url: "https://archive.org/details/the-cabinet-of-dr-caligari" }
    ],
    communityRating: 8.2,
    tags: ["german expressionism", "silent film", "horror"]
  },
  {
    id: "3",
    title: "Nosferatu",
    overview: "Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter's wife.",
    posterPath: "/nosferatu.jpg",
    releaseDate: "1922-03-04",
    runtime: 94,
    genres: ["Horror", "Fantasy"],
    rating: 7.9,
    voteCount: 28000,
    isPublicDomain: true,
    streamingLinks: [
      { platform: "Internet Archive", url: "https://archive.org/details/nosferatu-1922" }
    ],
    communityRating: 7.8,
    tags: ["german expressionism", "vampire", "silent horror"]
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
