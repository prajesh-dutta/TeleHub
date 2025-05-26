import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Film, Star, Users, Calendar } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Profile Header */}
      <section className="py-16 cinematic-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gradient-gold mb-2">{user.username}</h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="bg-purple-800/20 text-purple-400 border-purple-800/30">
                  {user.subscriptionTier?.charAt(0).toUpperCase() + user.subscriptionTier?.slice(1)} Plan
                </Badge>
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since 2024
                </div>
              </div>
              
              <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800/50 border-purple-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-yellow-500">
                  <Film className="w-5 h-5 mr-2" />
                  Movies Watched
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">42</div>
                <p className="text-gray-400 text-sm">This month: +7</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-yellow-500">
                  <Star className="w-5 h-5 mr-2" />
                  Reviews Written
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">12</div>
                <p className="text-gray-400 text-sm">Average rating: 8.2</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-yellow-500">
                  <Users className="w-5 h-5 mr-2" />
                  Following
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">28</div>
                <p className="text-gray-400 text-sm">Followers: 15</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Watchlist and Collections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-gradient-gold">My Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-12 h-16 bg-purple-800 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">The Cabinet of Dr. Caligari</h4>
                      <p className="text-sm text-gray-400">1920 • Horror</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-12 h-16 bg-purple-800 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">Metropolis</h4>
                      <p className="text-sm text-gray-400">1927 • Sci-Fi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-12 h-16 bg-purple-800 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">Nosferatu</h4>
                      <p className="text-sm text-gray-400">1922 • Horror</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 border-purple-800/30 text-purple-400 hover:bg-purple-800/20">
                  View All
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-gradient-gold">My Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Film Noir Classics</h4>
                    <p className="text-sm text-gray-400 mb-2">8 movies</p>
                    <Badge variant="secondary" className="bg-green-800/20 text-green-400 border-green-800/30">
                      Public
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Silent Era Gems</h4>
                    <p className="text-sm text-gray-400 mb-2">12 movies</p>
                    <Badge variant="secondary" className="bg-gray-700/20 text-gray-400 border-gray-700/30">
                      Private
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Horror Favorites</h4>
                    <p className="text-sm text-gray-400 mb-2">6 movies</p>
                    <Badge variant="secondary" className="bg-green-800/20 text-green-400 border-green-800/30">
                      Public
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 border-purple-800/30 text-purple-400 hover:bg-purple-800/20">
                  Create New Collection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
