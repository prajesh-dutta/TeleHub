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
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection />
      
      {/* Movie Spotlight Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-32"></div>
              <div className="mx-6 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-lg">★</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-32"></div>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Featured Classics
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Handpicked masterpieces from the golden age of cinema
            </p>
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

      {/* Bengali Classics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Cinema Classics</h2>
              <p className="text-gray-600">Discover timeless masterpieces of world cinema</p>
            </div>
            <button className="text-gray-900 hover:text-gray-700 transition-colors font-medium">
              View All →
            </button>
          </div>
          
          {classicsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-poster w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <MovieGrid movies={classicsMovies || []} compact />
          )}
        </div>
      </section>

      {/* Satyajit Ray Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Featured Director Collection
            </h2>
            <p className="text-gray-600 text-lg">Explore legendary filmmaker's masterworks</p>
          </div>
          
          {directorLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-poster w-full rounded-lg" />
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
