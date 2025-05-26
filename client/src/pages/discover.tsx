import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MovieGrid from "@/components/movies/movie-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [publicDomainOnly, setPublicDomainOnly] = useState(false);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['/api/movies', { 
      search: searchQuery || undefined,
      genre: selectedGenre !== "all" ? selectedGenre : undefined,
      publicDomain: publicDomainOnly || undefined,
      limit: 24 
    }],
  });

  const genres = [
    "all", "action", "adventure", "animation", "comedy", "crime", 
    "documentary", "drama", "family", "fantasy", "history", "horror", 
    "music", "mystery", "romance", "science fiction", "thriller", "war", "western"
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 cinematic-gradient">
        <div className="absolute inset-0 film-grain"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-gold">
            Discover Movies
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore our vast collection of free movies, from timeless classics to hidden gems
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-purple-800/30 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-48 bg-slate-900/50 border-purple-800/30 text-white">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-purple-800/30">
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre} className="text-white hover:bg-purple-800/20">
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant={publicDomainOnly ? "default" : "outline"}
              onClick={() => setPublicDomainOnly(!publicDomainOnly)}
              className={publicDomainOnly 
                ? "purple-gradient text-white" 
                : "border-purple-800/30 text-purple-400 hover:bg-purple-800/20"
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              Free Only
            </Button>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="aspect-poster w-full rounded-lg" />
              ))}
            </div>
          ) : movies && movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No movies found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
