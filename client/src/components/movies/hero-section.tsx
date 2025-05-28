import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Star, Sparkles, Film, Award, Heart, Crown } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-purple-950"></div>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
      
      {/* Film Strip Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute top-12 left-0 w-full h-4 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full h-4 bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "2s"}}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-300 font-semibold">Premium Cinema Collection</span>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          
          {/* Main Heading with Cinematic Typography */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              TELEHUB
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-light tracking-wider">
              CINEMA
            </span>
          </h1>
          
          {/* Elegant Subtitle */}
          <p className="text-xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the art of storytelling through our meticulously curated collection of 
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium"> cinematic masterpieces</span>
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/discover?publicDomain=true">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Play className="mr-3 h-7 w-7" />
                BEGIN JOURNEY
              </Button>
            </Link>
            
            <Link href="/discover">
              <Button variant="outline" size="lg" className="group border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-md transition-all duration-500 hover:border-purple-400/50 hover:shadow-lg">
                <Film className="mr-3 h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                EXPLORE COLLECTION
              </Button>
            </Link>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">8.5+</div>
              <div className="text-gray-400 font-medium">Average Rating</div>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <Film className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">5</div>
              <div className="text-gray-400 font-medium">Classic Films</div>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">4K</div>
              <div className="text-gray-400 font-medium">HD Quality</div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </section>
  );
}
