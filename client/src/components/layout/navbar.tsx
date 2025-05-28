import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, X, Film, Star, Play, Crown, Zap, Bell } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = [
    { name: "Home", href: "/", icon: Film },
    { name: "Movies", href: "/discover", icon: Play },
    { name: "Trending", href: "/discover?trending=true", icon: Zap },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                {/* Glow effect for logo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <Film className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text font-['Playfair_Display']">
                  TeleHub
                </span>
                <span className="text-sm text-purple-200 tracking-wider font-medium">Free Cinema</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex space-x-8 ml-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      location === item.href
                        ? "bg-white/20 backdrop-blur-sm text-white border border-white/20"
                        : "text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">            {/* Search bar */}
            <div className="relative hidden md:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-30 blur-sm"></div>
              <div className="relative bg-black/40 backdrop-blur-sm rounded-full border border-white/20 flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 rounded-full"
                />
              </div>
            </div>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm"
              className="relative p-3 text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
            
            {user ? (
              <Link href="/profile">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{user.username}</span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              className="lg:hidden text-gray-300 hover:text-white p-3 hover:bg-white/10 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
        {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="px-6 py-6 space-y-6">
            {/* Mobile search */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-30 blur-sm"></div>
              <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full bg-transparent border-0 text-white placeholder-gray-400 rounded-2xl"
                />
              </div>
            </div>
            
            {/* Mobile navigation */}
            <div className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                      location === item.href
                        ? "bg-white/20 backdrop-blur-sm text-white border border-white/20"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-lg">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
