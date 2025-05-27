import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { moviesService } from "@/lib/moviesApi";
import Navbar from "@/components/layout/navbar";
import MovieGrid from "@/components/movies/movie-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Film, Star, Users, Calendar, Heart, Bookmark } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's favorites and watchlist
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => moviesService.getFavorites(),
    enabled: !!user,
  });

  const { data: watchlist, isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => moviesService.getWatchlist(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Profile Header */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">{user.username}</h1>
              <p className="text-gray-600 mb-2 text-lg">Movie Enthusiast</p>
              <p className="text-gray-500 mb-6">{user.email}</p>
              
              <div className="flex items-center gap-6 mb-8">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                  {user.subscriptionTier?.charAt(0).toUpperCase() + user.subscriptionTier?.slice(1)} Member
                </Badge>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Member since 2024
                </div>
              </div>
              
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 px-6 py-3"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content - Favorites and Watchlist */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-gray-800">
                  <Heart className="w-6 h-6 mr-3 text-red-500" />
                  Favorite Movies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-2">{favorites?.length || 0}</div>
                <p className="text-gray-500 text-sm">Movies you love</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-gray-800">
                  <Bookmark className="w-6 h-6 mr-3 text-blue-500" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-2">{watchlist?.length || 0}</div>
                <p className="text-gray-500 text-sm">Movies to watch</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-gray-800">
                  <Film className="w-6 h-6 mr-3 text-green-500" />
                  Watch Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-2">24h</div>
                <p className="text-gray-500 text-sm">Movies watched</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Favorites and Watchlist Tabs */}
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 p-2">
              <TabsTrigger 
                value="favorites" 
                className="flex items-center gap-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
              <TabsTrigger 
                value="watchlist" 
                className="flex items-center gap-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Bookmark className="w-5 h-5" />
                Watchlist
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites" className="mt-12">
              <div className="mb-8 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Favorite Movies</h3>
                <p className="text-gray-600">Your most loved collection</p>
              </div>
              
              {favoritesLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-poster w-full rounded-lg" />
                  ))}
                </div>
              ) : favorites && favorites.length > 0 ? (
                <MovieGrid movies={favorites} compact />
              ) : (
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">No favorites yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Start exploring movies and add your favorites to build your personal collection
                    </p>
                    <Button 
                      onClick={() => setLocation('/discover')} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Discover Movies
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="watchlist" className="mt-12">
              <div className="mb-8 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Watch Later</h3>
                <p className="text-gray-600">Movies saved for your next viewing session</p>
              </div>
              
              {watchlistLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-poster w-full rounded-lg" />
                  ))}
                </div>
              ) : watchlist && watchlist.length > 0 ? (
                <MovieGrid movies={watchlist} compact />
              ) : (
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Bookmark className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">No movies in watchlist</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Add movies you want to watch later to your watchlist
                    </p>
                    <Button 
                      onClick={() => setLocation('/discover')} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Browse Movies
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
