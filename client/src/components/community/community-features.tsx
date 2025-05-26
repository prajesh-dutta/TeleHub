import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Star, Heart } from "lucide-react";

export default function CommunityFeatures() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-800/50 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient-gold">Join the Community</h2>
          <p className="text-gray-400 text-lg">Connect with fellow movie lovers and share your passion for cinema</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Community Picks */}
          <Card className="bg-slate-800/50 border-purple-800/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-500">
                <Users className="w-6 h-6 mr-3" />
                Community Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">Discover movies recommended by our passionate community of film enthusiasts.</p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">CinemaLover92</p>
                    <p className="text-xs text-gray-400">recommended "The Maltese Falcon"</p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-white">24</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">FilmBuff2024</p>
                    <p className="text-xs text-gray-400">recommended "Citizen Kane"</p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-white">18</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">ClassicsFan</p>
                    <p className="text-xs text-gray-400">recommended "Vertigo"</p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-white">31</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Watch Parties */}
          <Card className="bg-slate-800/50 border-purple-800/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-500">
                <Calendar className="w-6 h-6 mr-3" />
                Watch Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">Join synchronized viewing sessions with friends and fellow movie fans.</p>
              
              <div className="space-y-4">
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <div className="w-full h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded mb-3 flex items-center justify-center">
                    <span className="text-white font-semibold">Silent Movie Night</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-white">Silent Movie Night</h4>
                  <p className="text-sm text-gray-400 mb-2">Tonight at 8:00 PM</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-500">12 participants</span>
                    <Button className="purple-gradient text-white px-3 py-1 text-xs">Join</Button>
                  </div>
                </div>
                
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <div className="w-full h-24 bg-gradient-to-r from-green-600 to-teal-600 rounded mb-3 flex items-center justify-center">
                    <span className="text-white font-semibold">Horror Classics</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-white">Horror Classics Marathon</h4>
                  <p className="text-sm text-gray-400 mb-2">Friday at 9:00 PM</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-500">8 participants</span>
                    <Button className="purple-gradient text-white px-3 py-1 text-xs">Join</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Movie Reviews */}
          <Card className="bg-slate-800/50 border-purple-800/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-500">
                <Star className="w-6 h-6 mr-3" />
                Latest Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">Read honest reviews from our community and share your own thoughts.</p>
              
              <div className="space-y-4">
                <div className="border-l-2 border-yellow-500 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-semibold text-white">9.5</span>
                    </div>
                    <span className="text-sm text-gray-400">Vertigo</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">"A masterpiece of psychological suspense that gets better with each viewing..."</p>
                  <p className="text-xs text-gray-500">by FilmCritic2023</p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-semibold text-white">8.8</span>
                    </div>
                    <span className="text-sm text-gray-400">Casablanca</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">"Timeless romance and unforgettable performances. A true classic that deserves its reputation..."</p>
                  <p className="text-xs text-gray-500">by MovieLover88</p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-semibold text-white">9.1</span>
                    </div>
                    <span className="text-sm text-gray-400">Citizen Kane</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">"Revolutionary cinematography and storytelling. Welles was ahead of his time..."</p>
                  <p className="text-xs text-gray-500">by CinemaStudent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
