import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Star, Sparkles, Film, Award, Heart, Crown } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vintage Cinema Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900"></div>
      
      {/* Vintage Film Grain */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='m32 16c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8 12c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12zm64-12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Art Deco Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-transparent to-orange-600/10"></div>
      
      {/* Vintage Film Strip Border */}
      <div className="absolute inset-0 border-8 border-amber-800/30">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
        <div className="absolute top-12 left-0 w-full h-4 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full h-4 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent"></div>
        
        {/* Film perforations */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute left-2 w-4 h-4 bg-amber-900/40 rounded-full" style={{ top: `${5 + i * 4.5}%` }}></div>
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute right-2 w-4 h-4 bg-amber-900/40 rounded-full" style={{ top: `${5 + i * 4.5}%` }}></div>
        ))}
      </div>
      
      {/* Vintage Spotlight Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-orange-200/15 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Vintage Cinema Badge */}
          <div className="inline-flex items-center gap-3 mb-12 px-8 py-4 bg-gradient-to-r from-amber-800/80 to-orange-800/80 backdrop-blur-md border-2 border-yellow-600/50 rounded-none relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-600"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-600"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-600"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-600"></div>
            
            <Crown className="h-6 w-6 text-yellow-300" />
            <span className="relative text-yellow-100 font-bold font-['Cinzel'] tracking-wider text-lg">★ CLASSIC CINEMA COLLECTION ★</span>
            <Award className="h-6 w-6 text-yellow-300" />
          </div>
          
          {/* Vintage Main Heading */}
          <h1 className="mb-8 leading-none">
            <span className="block text-6xl md:text-8xl lg:text-9xl font-black font-['Cinzel'] mb-4 text-transparent bg-gradient-to-b from-yellow-200 via-amber-100 to-orange-200 bg-clip-text drop-shadow-2xl">
              TELEHUB
            </span>
            <div className="relative">
              <span className="block text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-light tracking-[0.3em] text-amber-200 relative z-10">
                CINEMA
              </span>
              {/* Vintage underline decoration */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>
          </h1>
          
          {/* Vintage Subtitle with Ornamental Brackets */}
          <div className="relative mb-16">
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-6xl text-yellow-600/40 font-['Cinzel']">❮</div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-6xl text-yellow-600/40 font-['Cinzel']">❯</div>
            <p className="text-xl md:text-3xl text-amber-100 mb-8 max-w-4xl mx-auto leading-relaxed font-['Cormorant_Garamond'] font-light px-16">
              Experience the golden age of storytelling through our carefully preserved collection of 
              <span className="text-yellow-300 font-medium font-['Playfair_Display'] italic"> timeless masterpieces</span>
            </p>
            {/* Decorative flourish */}
            <div className="flex justify-center items-center space-x-4 text-yellow-600/60">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-yellow-600"></div>
              <span className="text-2xl">❈</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-yellow-600"></div>
            </div>
          </div>
          
          {/* Vintage Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
            <Link href="/discover?publicDomain=true">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white px-16 py-6 text-xl font-bold font-['Cinzel'] tracking-wider border-2 border-yellow-600/50 rounded-none shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>
                <Play className="mr-4 h-7 w-7" />
                ENTER THEATRE
              </Button>
            </Link>
            
            <Link href="/discover">
              <Button variant="outline" size="lg" className="group border-3 border-amber-600/70 text-amber-100 hover:bg-amber-800/30 px-16 py-6 text-xl font-bold font-['Cinzel'] tracking-wider rounded-none backdrop-blur-md transition-all duration-500 hover:border-yellow-400/80 hover:shadow-lg hover:text-yellow-200">
                <Film className="mr-4 h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                BROWSE COLLECTION
              </Button>
            </Link>
          </div>
          
          {/* Vintage Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-b from-amber-900/40 to-orange-900/40 backdrop-blur-md border-2 border-yellow-600/30 p-8 rounded-none hover:bg-amber-800/50 transition-all duration-300 group relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-yellow-500"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-yellow-500"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full border-2 border-yellow-400">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-5xl font-bold text-yellow-200 mb-3 group-hover:scale-110 transition-transform duration-300 font-['Playfair_Display']">8.5+</div>
              <div className="text-amber-300 font-semibold font-['Cinzel'] tracking-wider">AVERAGE RATING</div>
            </Card>
            
            <Card className="bg-gradient-to-b from-amber-900/40 to-orange-900/40 backdrop-blur-md border-2 border-yellow-600/30 p-8 rounded-none hover:bg-amber-800/50 transition-all duration-300 group relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-yellow-500"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-yellow-500"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full border-2 border-yellow-400">
                  <Film className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-5xl font-bold text-yellow-200 mb-3 group-hover:scale-110 transition-transform duration-300 font-['Playfair_Display']">5</div>
              <div className="text-amber-300 font-semibold font-['Cinzel'] tracking-wider">CLASSIC FILMS</div>
            </Card>
            
            <Card className="bg-gradient-to-b from-amber-900/40 to-orange-900/40 backdrop-blur-md border-2 border-yellow-600/30 p-8 rounded-none hover:bg-amber-800/50 transition-all duration-300 group relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-yellow-500"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-yellow-500"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full border-2 border-yellow-400">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-5xl font-bold text-yellow-200 mb-3 group-hover:scale-110 transition-transform duration-300 font-['Playfair_Display']">4K</div>
              <div className="text-amber-300 font-semibold font-['Cinzel'] tracking-wider">HD QUALITY</div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Vintage Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-600/20 text-4xl font-['Cinzel']"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {['★', '❈', '◆', '❖', '✦'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </section>
  );
}
