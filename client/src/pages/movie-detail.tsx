import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useSearchParams } from "@/hooks/useSearchParams";
import VideoPlayer from "@/components/movies/video-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, Calendar, Globe, ArrowLeft, Download, Share } from "lucide-react";
import type { Movie } from "@shared/schema";

export default function MovieDetail() {
  const [, setLocation] = useLocation();
  const { movieId } = useSearchParams();

  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ["/api/movies", movieId],
    enabled: !!movieId,
  });

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Video Player */}
      <div className="relative">
        {/* Background Image */}
        {movie.backdropUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${movie.backdropUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        
        <div className="relative container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movies
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <img
                src={movie.posterUrl || `https://via.placeholder.com/500x750/1a1a1a/white?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                {movie.bengaliTitle && (
                  <h2 className="text-2xl text-muted-foreground mb-4">{movie.bengaliTitle}</h2>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{movie.rating?.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{movie.year}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="capitalize">{movie.language}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres?.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                  {movie.isPublicDomain && (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Free to Watch
                    </Badge>
                  )}
                </div>

                <p className="text-lg leading-relaxed mb-6">{movie.overview}</p>

                <div className="flex flex-wrap gap-3">
                  {movie.videoUrl && (
                    <Button size="lg" className="px-8">
                      Watch Now
                    </Button>
                  )}
                  {movie.trailerUrl && (
                    <Button size="lg" variant="outline">
                      Watch Trailer
                    </Button>
                  )}
                  <Button size="lg" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      {movie.videoUrl && (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Watch {movie.title}</CardTitle>
              <CardDescription>
                Streaming from {movie.streamingPlatform === 'archive' ? 'Internet Archive' : movie.streamingPlatform}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoPlayer
                videoUrl={movie.videoUrl}
                title={movie.title}
                posterUrl={movie.posterUrl}
                className="aspect-video max-w-4xl mx-auto"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Movie Details Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Cast & Crew */}
          <Card>
            <CardHeader>
              <CardTitle>Cast & Crew</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {movie.director && (
                <div>
                  <h4 className="font-semibold">Director</h4>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold">Language</h4>
                <p className="text-muted-foreground capitalize">{movie.language}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Country</h4>
                <p className="text-muted-foreground capitalize">{movie.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tags & Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {movie.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}