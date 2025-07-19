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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
      {/* Vintage Paper Texture Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A574' fill-opacity='0.08'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <Navbar />
      
      {/* Add top padding to account for the taller navbar */}
      <div className="pt-20 relative z-10">
        <HeroSection />
      </div>
        {/* Vintage Movie Spotlight Section */}
      <section className="py-24 bg-gradient-to-b from-amber-100 via-orange-100 to-yellow-100 relative overflow-hidden">
        {/* Vintage background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/10 via-transparent to-orange-800/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        
        {/* Art Deco Border Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent flex-1 max-w-32"></div>
              <div className="mx-8 relative">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-700 to-orange-700 border-4 border-yellow-600 flex items-center justify-center relative">
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-yellow-500"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-yellow-500"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-yellow-500"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-500"></div>
                  <span className="text-yellow-200 font-bold text-3xl">★</span>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent flex-1 max-w-32"></div>
            </div>
            
            <h2 className="text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-amber-800 via-orange-700 to-red-800 bg-clip-text font-['Cinzel']">
              Featured Classics
            </h2>
            <div className="flex justify-center items-center mb-6">
              <div className="w-24 h-px bg-amber-600"></div>
              <span className="mx-4 text-3xl text-amber-700">❈</span>
              <div className="w-24 h-px bg-amber-600"></div>
            </div>
            <p className="text-amber-800 text-xl max-w-3xl mx-auto font-light leading-relaxed font-['Cormorant_Garamond']">
              Handpicked masterpieces from the golden age of cinema, now restored in stunning quality
            </p>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-1 border-2 border-amber-300 opacity-30 animate-pulse"></div>
                  <Skeleton className="relative h-96 w-full bg-amber-200" />
                </div>
              ))}
            </div>
          ) : (
            <MovieGrid movies={featuredMovies || []} />
          )}
        </div>
      </section>      {/* Vintage Cinema Classics Section */}
      <section className="py-20 bg-gradient-to-b from-orange-100 to-amber-100 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/10 via-transparent to-orange-800/10"></div>
        
        {/* Vintage decorative border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text mb-3 font-['Cinzel']">
                Cinema Classics
              </h2>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-px bg-amber-600"></div>
                <span className="text-amber-700 text-xl">◆</span>
                <div className="w-12 h-px bg-amber-600"></div>
              </div>
              <p className="text-amber-700 text-lg font-['Cormorant_Garamond']">Discover timeless masterpieces of world cinema</p>
            </div>
            <button className="group flex items-center space-x-3 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 border-2 border-yellow-600/50 transition-all duration-300 hover:scale-105 relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>
              <span className="font-bold font-['Cinzel'] tracking-wider">VIEW ALL</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-xl">→</span>
            </button>
          </div>
          
          {classicsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-1 border-2 border-amber-300 opacity-20 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                  <Skeleton className="relative aspect-[2/3] w-full bg-amber-200" />
                </div>
              ))}
            </div>
          ) : (
            <MovieGrid movies={classicsMovies || []} compact />
          )}
        </div>
      </section>      {/* Vintage Director Collection Section */}
      <section className="py-20 bg-gradient-to-b from-amber-100 to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/10 via-transparent to-amber-800/10"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
        
        {/* Vintage film strip decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-700 via-yellow-600 to-amber-700"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-transparent bg-gradient-to-r from-amber-800 via-orange-700 to-red-800 bg-clip-text font-['Cinzel']">
              Featured Director Collection
            </h2>
            <div className="flex justify-center items-center mb-6">
              <div className="w-20 h-px bg-amber-600"></div>
              <span className="mx-4 text-3xl text-amber-700">❖</span>
              <div className="w-20 h-px bg-amber-600"></div>
            </div>
            <p className="text-amber-800 text-xl max-w-2xl mx-auto font-['Cormorant_Garamond']">Explore legendary filmmaker's masterworks in pristine quality</p>
          </div>
          
          {directorLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-1 border-2 border-orange-300 opacity-20 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                  <Skeleton className="relative aspect-[2/3] w-full bg-orange-200" />
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
