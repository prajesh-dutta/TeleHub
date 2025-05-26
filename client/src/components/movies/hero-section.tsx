import { Button } from "@/components/ui/button";
import { Play, Search } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic background with multiple layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Film grain overlay */}
        <div className="absolute inset-0 film-grain"></div>
        
        {/* Additional depth with subtle patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 70%)
            `
          }}></div>
        </div>
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient-gold text-shadow-lg">
          Discover Cinema
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed text-shadow">
          Explore thousands of free movies, connect with fellow film lovers, and discover hidden gems in our curated collection of legal streaming content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Link href="/discover?publicDomain=true">
            <Button className="btn-cinematic px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg hover:glow-purple">
              <Play className="w-5 h-5 mr-2" />
              Start Watching Free
            </Button>
          </Link>
          <Link href="/discover">
            <Button className="btn-gold px-8 py-4 text-lg font-semibold transition-all">
              <Search className="w-5 h-5 mr-2" />
              Explore Collection
            </Button>
          </Link>
        </div>
        
        {/* Floating movie elements for visual interest */}
        <div className="absolute top-20 left-10 opacity-20 animate-pulse">
          <div className="w-16 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded transform rotate-12"></div>
        </div>
        <div className="absolute top-32 right-16 opacity-15 animate-pulse delay-1000">
          <div className="w-12 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded transform -rotate-6"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10 animate-pulse delay-2000">
          <div className="w-20 h-24 bg-gradient-to-br from-purple-700 to-purple-900 rounded transform rotate-6"></div>
        </div>
      </div>
      
      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
}
