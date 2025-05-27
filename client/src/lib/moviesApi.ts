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
  async getStreamingUrl(movieId: string, quality: string = '720p'): Promise<{ url: string }> {
    const response = await fetch(`/api/streaming/secure-url/${movieId}/${quality}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get streaming URL');
    }

    const data = await response.json();
    return { url: data.streamingUrl };
  }

  async getAvailableQualities(movieId: string): Promise<string[]> {
    const response = await fetch(`/api/streaming/qualities/${movieId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get available qualities');
    }

    const data = await response.json();
    return data.qualities || ['720p'];
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
      genre: 'Featured Director',
      sortBy: 'releaseDate', 
      sortOrder: 'asc',
      limit: 20
    }).then(response => response.movies);
  }
}

export const moviesService = new MoviesService();
