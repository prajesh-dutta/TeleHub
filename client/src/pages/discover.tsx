import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MovieGrid from "@/components/movies/movie-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { moviesService } from "@/lib/moviesApi";
import { useLocation } from "wouter";

export default function Discover() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || "all");
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || "title");
  const [currentPage, setCurrentPage] = useState(1);

  const setSearchParams = (params: URLSearchParams) => {
    const newLocation = location.split('?')[0] + '?' + params.toString();
    window.history.pushState({}, '', newLocation);
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ['discover-movies', { 
      query: searchQuery || undefined,
      genre: selectedGenre !== "all" ? selectedGenre : undefined,
      sortBy,
      page: currentPage,
      limit: 24 
    }],
    queryFn: () => moviesService.getMovies({
      query: searchQuery || undefined,
      genre: selectedGenre !== "all" ? selectedGenre : undefined,
      sortBy: sortBy as any,
      page: currentPage,
      limit: 24
    }),
  });

  const handleSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedGenre !== 'all') params.set('genre', selectedGenre);
    if (sortBy !== 'title') params.set('sortBy', sortBy);
    setSearchParams(params);
  };

  const genres = [
    "all", "Drama", "Comedy", "Romance", "Thriller", 
    "Family", "Musical", "Historical", "Biographical", "Social Drama"
  ];

  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "year", label: "Year" },
    { value: "rating", label: "Rating" },
    { value: "popularity", label: "Popularity" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-wide">
            Discover Movies
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore our vast collection of free movies - from timeless classics to hidden gems
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 inline-block px-6 py-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Movies'}
              </h2>
            </div>
            <p className="text-gray-600">
              {response ? `${response.total} movies found` : 'Loading...'}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-3 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              />
            </div>
            
            {/* Genre Select */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-56 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre} className="text-gray-900 hover:bg-gray-100">
                    {genre === "all" ? "All Genres" : genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-56 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-gray-900 hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 group"
            >
              <Filter className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="aspect-poster w-full rounded-lg bg-white border border-gray-200 animate-pulse">
                  <div className="h-full bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : response?.movies && response.movies.length > 0 ? (
            <>
              <MovieGrid movies={response.movies} />
              
              {/* Pagination */}
              {response.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-8 py-4 flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-3 text-gray-700">
                      <span>Page {currentPage} of {response.totalPages}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(response.totalPages, currentPage + 1))}
                      disabled={currentPage === response.totalPages}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 inline-block px-12 py-8">
                <div className="text-6xl mb-6 text-gray-400">🎬</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No movies found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
