import { Movie } from "@shared/schema";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  compact?: boolean;
}

export default function MovieGrid({ movies, compact = false }: MovieGridProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 p-1">
        {movies.map((movie, index) => (
          <div 
            key={movie.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <MovieCard movie={movie} compact />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-1">
      {movies.map((movie, index) => (
        <div 
          key={movie.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
