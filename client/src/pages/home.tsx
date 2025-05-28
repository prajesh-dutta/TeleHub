import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/movies/hero-section";
import MovieGrid from "@/components/movies/movie-grid";
import CommunityFeatures from "@/components/community/community-features";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { moviesService } from "@/lib/moviesApi";

export default function Home() {
  const { data: featuredMovies, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-movies'],
    queryFn: () => moviesService.getFeaturedMovies(),
  });

  const { data: classicsMovies, isLoading: classicsLoading } = useQuery({
    queryKey: ['classics-movies'],
    queryFn: () => moviesService.getClassicsMovies(),
  });

  const { data: directorMovies, isLoading: directorLoading } = useQuery({
    queryKey: ['director-movies'],
    queryFn: () => moviesService.getDirectorMovies(),
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Add top padding to account for the taller navbar */}
      <div className="pt-20">
        <HeroSection />
      </div>
        {/* Movie Spotlight Section */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1 max-w-32"></div>
              <div className="mx-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-2xl">★</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent flex-1 max-w-32"></div>
            </div>
            
            <h2 className="text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text">
              Featured Classics
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Handpicked masterpieces from the golden age of cinema, now in stunning quality
            </p>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-30 blur-sm animate-pulse"></div>
                  <Skeleton className="relative h-96 w-full rounded-2xl bg-gray-800" />
                </div>
              ))}
            </div>
          ) : (
            <MovieGrid movies={featuredMovies || []} />
          )}
        </div>
      </section>      {/* Cinema Classics Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text mb-3">
                Cinema Classics
              </h2>
              <p className="text-gray-400 text-lg">Discover timeless masterpieces of world cinema</p>
            </div>
            <button className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105">
              <span className="font-medium">View All</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
          
          {classicsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-20 blur-sm animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                  <Skeleton className="relative aspect-[2/3] w-full rounded-xl bg-gray-800" />
                </div>
              ))}
            </div>
          ) : (
            <MovieGrid movies={classicsMovies || []} compact />
          )}
        </div>
      </section>      {/* Director Collection Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              Featured Director Collection
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">Explore legendary filmmaker's masterworks in high quality</p>
          </div>
          
          {directorLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 blur-sm animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                  <Skeleton className="relative aspect-[2/3] w-full rounded-xl bg-gray-800" />
                </div>
              ))}
            </div>
          ) : (
            <MovieGrid movies={directorMovies || []} compact />
          )}
        </div>
      </section>

      <CommunityFeatures />
    </div>
  );
}
