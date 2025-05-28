import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import VideoPlayer from "@/components/movies/video-player";
import MovieComments from "@/components/movies/movie-comments";
import MovieRatings from "@/components/movies/movie-ratings";
import MovieDiscussions from "@/components/movies/movie-discussions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, Calendar, Globe, ArrowLeft, Heart, Plus, Share, Users } from "lucide-react";
import { moviesService } from "@/lib/moviesApi";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Movie } from "@shared/schema";

export default function MovieDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/movie/:id");
  const movieId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ['movie', movieId],
    queryFn: () => moviesService.getMovie(movieId!),
    enabled: !!movieId,
  });

  // Update favorite/watchlist status when user or movie changes
  useState(() => {
    if (user && movie) {
      setIsFavorite(user.favorites?.includes(movie.id) || false);
      setIsInWatchlist(user.watchlist?.includes(movie.id) || false);
    }
  });

  const handleFavoriteToggle = async () => {
    if (!user || !movie) {
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

  const handleWatchlistToggle = async () => {
    if (!user || !movie) {
      toast({
        title: "Login required",
        description: "Please log in to add movies to watchlist",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWatchlist) {
        await moviesService.removeFromWatchlist(movie.id);
        setIsInWatchlist(false);
        toast({
          title: "Removed from watchlist",
          description: `${movie.title} has been removed from your watchlist`,
        });
      } else {
        await moviesService.addToWatchlist(movie.id);
        setIsInWatchlist(true);
        toast({
          title: "Added to watchlist",
          description: `${movie.title} has been added to your watchlist`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 bg-white p-12 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">Movie not found</h1>
          <Button onClick={() => setLocation("/")} className="bg-gray-900 text-white hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Player */}
      <div className="relative">
        {/* Background Image */}
        {movie.backdropUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${movie.backdropUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        
        <div className="relative container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button 
            className="mb-8 border border-gray-300 text-white hover:border-gray-100" 
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Movies
          </Button>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={movie.posterUrl || `https://via.placeholder.com/500x750/6b7280/f9fafb?text=${encodeURIComponent(movie.title)}`}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-5xl font-bold mb-4 text-white">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {movie.rating && (
                    <div className="flex items-center">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 mr-2" />
                      <span className="font-semibold text-white text-lg">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {movie.year && (
                    <div className="flex items-center text-white">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-lg">{movie.year}</span>
                    </div>
                  )}
                  
                  {movie.runtime && (
                    <div className="flex items-center text-white">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-lg">{movie.runtime} min</span>
                    </div>
                  )}
                  
                  {movie.language && (
                    <div className="flex items-center text-white">
                      <Globe className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="capitalize text-lg">{movie.language}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {movie.genres?.map((genre) => (
                    <Badge key={genre} className="bg-gray-900 text-white">
                      {genre}
                    </Badge>
                  ))}
                  <Badge className="bg-green-600 text-white">
                    Free to Watch
                  </Badge>
                </div>

                <p className="text-xl leading-relaxed mb-8 text-gray-200">{movie.overview}</p>

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white text-black px-10 py-3 text-lg hover:bg-gray-100">
                    Watch Now
                  </Button>
                  
                  <Button 
                    className={`border border-white text-white px-8 py-3 hover:bg-white hover:text-black ${isFavorite ? 'bg-red-600 border-red-600' : ''}`}
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-red-500 text-white' : 'text-white'}`} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  <Button 
                    className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black"
                    onClick={handleWatchlistToggle}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                  
                  <Button className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black">
                    <Share className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-gray-900 mb-2">
              Watch {movie.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Classic Cinema - Free to Enjoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoPlayer
              movieId={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl || undefined}
              className="aspect-video max-w-5xl mx-auto"
            />
          </CardContent>
        </Card>
      </div>

      {/* Movie Details Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Cast & Crew */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-3 text-gray-600" />
                Cast & Crew
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {movie.director && (
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Director</h4>
                  <p className="text-gray-600">{movie.director}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Language</h4>
                <p className="text-gray-600 capitalize">{movie.language}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Country</h4>
                <p className="text-gray-600 capitalize">{movie.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tags & Categories */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <Badge className="w-6 h-6 mr-3 text-gray-600" />
                Tags & Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {movie.tags?.map((tag) => (
                  <Badge key={tag} className="bg-gray-100 text-gray-800 border border-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Features Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments" className="mt-6">
            <MovieComments movieId={movie.id} />
          </TabsContent>
          
          <TabsContent value="ratings" className="mt-6">
            <MovieRatings movieId={movie.id} />
          </TabsContent>
          
          <TabsContent value="discussions" className="mt-6">
            <MovieDiscussions movieId={movie.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}