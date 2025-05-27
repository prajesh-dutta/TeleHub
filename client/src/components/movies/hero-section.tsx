import { Button } from "@/components/ui/button";
import { Play, Search, Film, Heart } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Clean title */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-32"></div>
            <Film className="mx-4 w-8 h-8 text-gray-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-32"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white">
            TeleHub
          </h1>
          
          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-48"></div>
            <Heart className="mx-4 w-6 h-6 text-gray-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-48"></div>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-light mb-6 text-gray-200">
          Premium Movie Collection
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
          Discover timeless cinema masterpieces from around the world. Experience classic films from legendary 
          directors and explore curated collections of high-quality movies available for streaming.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/discover?publicDomain=true">
            <Button className="bg-gray-900 text-white px-10 py-4 text-lg hover:bg-gray-800 transition-all shadow-lg">
              <Play className="w-5 h-5 mr-3" />
              Begin Journey
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="outline" className="border-gray-300 text-gray-800 px-10 py-4 text-lg hover:bg-gray-100 transition-all">
              <Search className="w-5 h-5 mr-3" />
              Explore Classics
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
