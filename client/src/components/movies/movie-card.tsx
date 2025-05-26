import { Movie } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  compact?: boolean;
  onPlay?: (movie: Movie) => void;
}

export default function MovieCard({ movie, compact = false }: MovieCardProps) {
  // Create a placeholder image URL with the movie title
  const imageUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  if (compact) {
    return (
      <div className="group cursor-pointer movie-card-hover">
        <div className="relative overflow-hidden rounded-lg mb-3 shadow-cinematic">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={movie.title}
              className="w-full aspect-poster object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full aspect-poster movie-poster-placeholder">
              <div className="text-center">
                <div className="text-2xl mb-2">🎬</div>
                <div className="text-sm font-semibold">{movie.title}</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4">
              <Button className="w-full btn-cinematic py-2 text-sm font-semibold">
                <Play className="w-4 h-4 mr-2" />
                {movie.isPublicDomain ? "Watch Free" : "Learn More"}
              </Button>
            </div>
          </div>
          {movie.isPublicDomain && (
            <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold">
              Free
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-sm mb-1 text-white truncate">{movie.title}</h3>
        <p className="text-xs text-gray-400">
          {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown'} • {movie.genres[0] || 'Unknown'}
        </p>
      </div>
    );
  }

  return (
    <Card className="group cursor-pointer movie-card-hover bg-slate-800/50 border-purple-800/30 overflow-hidden shadow-cinematic-lg">
      <div className="relative">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={movie.title}
            className="w-full aspect-backdrop object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full aspect-backdrop movie-poster-placeholder">
            <div className="text-center">
              <div className="text-4xl mb-4">🎬</div>
              <div className="text-lg font-bold">{movie.title}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-2 mb-2">
            {movie.isPublicDomain && (
              <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-xs font-bold shadow-lg">
                Featured
              </Badge>
            )}
            <Badge variant="secondary" className="bg-purple-800/30 text-purple-300 border-purple-700/50 text-xs">
              {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown'}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white text-shadow">{movie.title}</h3>
          <p className="text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
            {movie.overview || "A classic film waiting to be discovered."}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                <span className="text-white text-sm font-semibold">{movie.rating.toFixed(1)}</span>
              </div>
              {movie.runtime && (
                <span className="text-gray-400 text-sm">{movie.runtime} min</span>
              )}
            </div>
            <Button className="btn-cinematic hover:glow-purple">
              <Play className="w-4 h-4 mr-2" />
              {movie.isPublicDomain ? "Watch Free" : "Learn More"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
