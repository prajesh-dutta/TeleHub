import { Movie } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, Heart, Plus, Info, Volume2 } from "lucide-react";
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
      <div className="group cursor-pointer relative">
        <div className="relative overflow-hidden rounded-xl mb-3 transform transition-all duration-500 hover:scale-105 hover:z-20">
          {/* Premium glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt={movieTitle}
                className="w-full aspect-[2/3] object-cover transition-all duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3 animate-pulse">🎬</div>
                  <div className="text-sm font-medium text-white/90 px-2">{movieTitle}</div>
                </div>
              </div>
            )}
            
            {/* Premium overlay with Netflix-style gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
              {/* Floating action buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                <Button
                  onClick={handleFavoriteToggle}
                  size="sm"
                  className="p-2 bg-black/70 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </Button>
                <Button
                  size="sm"
                  className="p-2 bg-black/70 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              {/* Premium content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  {movie.rating && (
                    <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-500/30">
                      <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                      <span className="text-yellow-400 text-xs font-bold">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <Badge className="bg-purple-500/20 backdrop-blur-sm text-purple-200 border border-purple-500/30 text-xs">
                    HD
                  </Badge>
                </div>
                
                <Button className="w-full bg-white/95 hover:bg-white text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Watch Now
                </Button>
              </div>
            </div>
            
            {/* Premium rating badge */}
            {movie.rating && (
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                  <span className="text-white text-xs font-bold">{movie.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Movie info with gradient text */}
        <div className="px-1">
          <h3 className="font-bold text-sm mb-1 text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text truncate">
            {movieTitle}
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            {movieYear || 'Unknown'} • {movie.genres?.[0] || 'Drama'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer relative">
      {/* Premium glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-700"></div>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-sm transition-all duration-700 hover:scale-105 hover:z-20 rounded-2xl">
        <div className="relative">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={movieTitle}
              className="w-full aspect-[16/9] object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
              </div>
              <div className="text-center z-10">
                <div className="text-8xl mb-6 animate-bounce">🎬</div>
                <div className="text-2xl font-bold text-white/90 px-4">{movieTitle}</div>
              </div>
            </div>
          )}
          
          {/* Netflix-style gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          {/* Premium floating controls */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
            <Button
              onClick={handleFavoriteToggle}
              size="sm"
              className="p-3 bg-black/70 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              size="sm"
              className="p-3 bg-black/70 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="p-3 bg-black/70 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Premium content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1 font-semibold">
                Premium
              </Badge>
              <Badge className="bg-black/60 backdrop-blur-sm text-white border border-white/20 px-3 py-1">
                {movieYear || 'Unknown'}
              </Badge>
              {movie.rating && (
                <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-yellow-400 text-sm font-bold">{movie.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-3xl font-bold mb-3 text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
              {movieTitle}
            </h3>
            
            <p className="text-gray-300 mb-6 line-clamp-2 text-base leading-relaxed">
              {movie.overview || "A premium cinematic experience waiting to be discovered. Immerse yourself in storytelling at its finest."}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {movie.runtime && (
                  <span className="text-gray-400 text-sm font-medium">{movie.runtime} min</span>
                )}
                {movie.director && (
                  <span className="text-gray-400 text-sm">Director: {movie.director}</span>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex gap-2">
                    {movie.genres.slice(0, 2).map((genre, index) => (
                      <Badge key={index} variant="outline" className="text-gray-300 border-gray-500 text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  className="bg-black/60 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:scale-105"
                >
                  <Info className="w-4 h-4 mr-2" />
                  More Info
                </Button>
                <Button className="bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
          
          {/* Premium shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-1000">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
