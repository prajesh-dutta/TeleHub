import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/movies/hero-section";
import MovieGrid from "@/components/movies/movie-grid";
import CommunityFeatures from "@/components/community/community-features";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredMovies, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/movies', { limit: 6 }],
  });

  const { data: publicDomainMovies, isLoading: publicDomainLoading } = useQuery({
    queryKey: ['/api/movies', { publicDomain: true, limit: 12 }],
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection />
      
      {/* Movie Spotlight Section */}
      <section className="py-16 cinematic-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient-gold">Featured This Week</h2>
            <p className="text-gray-400 text-lg">Handpicked movies from our community of film enthusiasts</p>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <MovieGrid movies={featuredMovies || []} />
          )}
        </div>
      </section>

      {/* Free Cinema Theater Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gradient-gold mb-2">Free Cinema Theater</h2>
              <p className="text-gray-400">Discover timeless classics from the public domain</p>
            </div>
            <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
              View All →
            </button>
          </div>
          
          {publicDomainLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-poster w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <MovieGrid movies={publicDomainMovies || []} compact />
          )}
        </div>
      </section>

      <CommunityFeatures />
      
      {/* Kids Corner Preview */}
      <section className="py-16 purple-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Kids Corner
            </h2>
            <p className="text-gray-300 text-lg">Safe, educational, and fun movies for the whole family</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-3 border-4 border-yellow-400/30 group-hover:border-yellow-400 transition-colors">
                  <div className="aspect-poster bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">Kids Movie {i + 1}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">G</div>
                </div>
                <h3 className="font-semibold text-center text-yellow-400">Family Adventure</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="gold-gradient text-slate-900 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Explore Kids Corner
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
