import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, X, Film, Star } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/discover" },
    { name: "Free Movies", href: "/discover?publicDomain=true" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <Film className="w-8 h-8 text-gray-900" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">TeleHub</span>
                <span className="text-xs text-gray-600 tracking-wide">Movie Streaming</span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-8 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors duration-200 ${
                    location === item.href
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>
            
            {user ? (
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  <User className="w-4 h-4 mr-2" />
                  {user.username}
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="bg-gray-900 text-white hover:bg-gray-800">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 w-full"
              />
            </div>
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 transition-colors ${
                  location === item.href
                    ? "text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
