import { Movie } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, Heart } from "lucide-react";
import { useState } from "react";
import { moviesService } from "@/lib/moviesApi";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  movie: Movie;
  compact?: boolean;
  onPlay?: (movie: Movie) => void;
}

export default function MovieCard({ movie, compact = false }: MovieCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(
    user?.favorites?.includes(movie.id) || false
  );
  const [isInWatchlist, setIsInWatchlist] = useState(
    user?.watchlist?.includes(movie.id) || false
  );

  // Use poster from MongoDB or create placeholder
  const imageUrl = movie.posterUrl || null;
  const movieYear = movie.year;
  const movieTitle = movie.title;

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add movies to favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        await moviesService.removeFromFavorites(movie.id);
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: `${movie.title} has been removed from your favorites`,
        });
      } else {
        await moviesService.addToFavorites(movie.id);
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: `${movie.title} has been added to your favorites`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  if (compact) {
    return (
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-3">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={movieTitle}
              className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🎬</div>
                <div className="text-sm font-medium text-gray-600">{movieTitle}</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <Button className="w-full bg-white text-black hover:bg-gray-100">
                <Play className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
          <Button
            onClick={handleFavoriteToggle}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </Button>
        </div>
        <h3 className="font-medium text-sm mb-1 text-gray-900 truncate">{movieTitle}</h3>
        <p className="text-xs text-gray-500">
          {movieYear || 'Unknown'} • {movie.genres?.[0] || 'Drama'}
        </p>
      </div>
    );
  }

  return (
    <Card className="group cursor-pointer overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={movieTitle}
            className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <div className="text-xl font-medium text-gray-600">{movieTitle}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-2 mb-3">
            <Badge className="bg-gray-900 text-white">
              Classic Cinema
            </Badge>
            <Badge variant="secondary">
              {movieYear || 'Unknown'}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">{movieTitle}</h3>
          <p className="text-white/90 mb-4 line-clamp-2 text-sm leading-relaxed">
            {movie.overview || "A classic film waiting to be discovered."}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {movie.rating && (
                <div className="flex items-center bg-black/50 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-white text-sm font-semibold">{movie.rating.toFixed(1)}</span>
                </div>
              )}
              {movie.runtime && (
                <span className="text-gray-300 text-sm">{movie.runtime} min</span>
              )}
              {movie.director && (
                <span className="text-gray-300 text-sm">Director: {movie.director}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleFavoriteToggle}
                variant="ghost"
                size="sm"
                className="p-2 bg-black/50 hover:bg-black/70 text-white"
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
              </Button>
              <Button className="bg-white text-black hover:bg-gray-100">
                <Play className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
