import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Star, Heart } from "lucide-react";

export default function CommunityFeatures() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-wide">
            Join the Community
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with fellow movie enthusiasts and share your passion for cinema
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Community Picks */}
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                Community Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Discover movies recommended by our passionate community of film lovers.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">MovieLover92</p>
                    <p className="text-xs text-gray-600">Recommended "The Maltese Falcon"</p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-sm text-gray-700">24</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">CinemaFan2024</p>
                    <p className="text-xs text-gray-600">Recommended "Citizen Kane"</p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-sm text-gray-700">18</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">ClassicLover</p>
                    <p className="text-xs text-gray-600">Recommended "Vertigo"</p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-sm text-gray-700">31</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Watch Parties */}
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Calendar className="w-6 h-6 mr-3 text-green-600" />
                Watch Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Join synchronized viewing sessions with friends and fellow movie enthusiasts.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3 flex items-center justify-center">
                    <span className="text-white font-semibold">Silent Movie Night</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-gray-900">Silent Movie Night</h4>
                  <p className="text-sm text-gray-600 mb-2">Tonight at 8:00 PM</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">12 participants</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Join</Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="w-full h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded mb-3 flex items-center justify-center">
                    <span className="text-white font-semibold">Horror Classics</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-gray-900">Horror Classics Marathon</h4>
                  <p className="text-sm text-gray-600 mb-2">Friday at 9:00 PM</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">8 participants</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Join</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Movie Reviews */}
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Read honest reviews from our community and share your own opinions.
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-400 pl-4 bg-gray-50 rounded-r-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">9.5</span>
                    </div>
                    <span className="text-sm text-gray-700">Vertigo</span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2 italic">
                    "A masterpiece of psychological mystery that gets better with each viewing..."
                  </p>
                  <p className="text-xs text-gray-500">- FilmCritic2023</p>
                </div>
                
                <div className="border-l-4 border-yellow-400 pl-4 bg-gray-50 rounded-r-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">8.8</span>
                    </div>
                    <span className="text-sm text-gray-700">Casablanca</span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2 italic">
                    "Timeless romance and unforgettable performances. A true classic that lives up to its reputation..."
                  </p>
                  <p className="text-xs text-gray-500">- MovieLover88</p>
                </div>
                
                <div className="border-l-4 border-yellow-400 pl-4 bg-gray-50 rounded-r-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">9.1</span>
                    </div>
                    <span className="text-sm text-gray-700">Citizen Kane</span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2 italic">
                    "Revolutionary cinematography and storytelling techniques. Welles was ahead of his time..."
                  </p>
                  <p className="text-xs text-gray-500">- CinemaStudent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
