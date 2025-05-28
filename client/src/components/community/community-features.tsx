import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Star, Heart, Crown, Zap, Play } from "lucide-react";

export default function CommunityFeatures() {
  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1 max-w-32"></div>
            <div className="mx-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center border border-white/20">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent flex-1 max-w-32"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text tracking-wide">
            Join the Community
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Connect with fellow cinephiles and immerse yourself in premium movie experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Premium Community Picks */}
          <div className="group relative">
            {/* Premium glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-700"></div>
            
            <Card className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Community Picks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Discover premium movies curated by our passionate community of film connoisseurs.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">CinemaExpert</p>
                      <p className="text-sm text-gray-400">Recommended "Citizen Kane"</p>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs">
                          Editor's Choice
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-red-500/30">
                      <Heart className="w-4 h-4 text-red-400 mr-1 fill-current" />
                      <span className="text-sm text-red-300 font-semibold">47</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">FilmMaestro</p>
                      <p className="text-sm text-gray-400">Recommended "Vertigo"</p>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-pink-500/20 text-pink-200 border border-pink-500/30 text-xs">
                          Premium Pick
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-red-500/30">
                      <Heart className="w-4 h-4 text-red-400 mr-1 fill-current" />
                      <span className="text-sm text-red-300 font-semibold">32</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105">
                  Join Discussions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Premium Watch Parties */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-700"></div>
            
            <Card className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  Watch Parties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Join synchronized premium viewing sessions with friends and cinephiles worldwide.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <div className="w-full h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="relative flex items-center space-x-2 text-white font-bold">
                        <Crown className="w-5 h-5" />
                        <span>Premium Cinema Night</span>
                      </div>
                    </div>
                    <h4 className="font-bold mb-2 text-white">Premium Cinema Night</h4>
                    <p className="text-sm text-gray-300 mb-3">Tonight at 8:00 PM</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">24 cinephiles</span>
                        <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 text-xs">
                          VIP
                        </Badge>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded-lg">
                        <Play className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <div className="w-full h-24 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="relative flex items-center space-x-2 text-white font-bold">
                        <Zap className="w-5 h-5" />
                        <span>Thriller Marathon</span>
                      </div>
                    </div>
                    <h4 className="font-bold mb-2 text-white">Thriller Marathon</h4>
                    <p className="text-sm text-gray-300 mb-3">Friday at 9:00 PM</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">16 participants</span>
                        <Badge className="bg-red-500/20 text-red-200 border border-red-500/30 text-xs">
                          Hot
                        </Badge>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-lg">
                        <Play className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Movie Reviews */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-700"></div>
            
            <Card className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  Premium Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Read expert reviews from our premium community and share your cinematic insights.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-400 pl-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-sm rounded-r-xl p-4 border border-white/10">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-4 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        <span className="text-sm font-bold text-yellow-300">9.5</span>
                      </div>
                      <span className="text-sm text-white font-semibold">Vertigo</span>
                      <Badge className="ml-2 bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs">
                        Critic's Choice
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 italic leading-relaxed">
                      "A masterpiece of psychological mystery that transcends time. Hitchcock's direction combined with Jimmy Stewart's performance creates an unforgettable cinematic experience..."
                    </p>
                    <p className="text-xs text-gray-400">- CinemaExpert Pro</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-400 pl-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-r-xl p-4 border border-white/10">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-4 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        <span className="text-sm font-bold text-yellow-300">9.1</span>
                      </div>
                      <span className="text-sm text-white font-semibold">Citizen Kane</span>
                      <Badge className="ml-2 bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 text-xs">
                        Masterpiece
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 italic leading-relaxed">
                      "Revolutionary cinematography and storytelling techniques that redefined cinema. Welles was truly ahead of his time with this groundbreaking film..."
                    </p>
                    <p className="text-xs text-gray-400">- FilmHistorian</p>
                  </div>
                </div>
                
                <Button className="w-full mt-8 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105">
                  Write Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-30 blur-lg"></div>
            <div className="relative bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <h3 className="text-4xl font-bold mb-6 text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text">
                Ready to Join Our Premium Community?
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Connect with fellow movie lovers, discover hidden gems, and experience cinema like never before
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg">
                  <Crown className="w-5 h-5 mr-2" />
                  Join Premium
                </Button>
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg">
                  Explore Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
