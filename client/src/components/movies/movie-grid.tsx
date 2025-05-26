import { Movie } from "@shared/schema";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  compact?: boolean;
}

export default function MovieGrid({ movies, compact = false }: MovieGridProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
