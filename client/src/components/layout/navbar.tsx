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

  return (    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-amber-900/90 via-orange-900/90 to-red-900/90 backdrop-blur-xl border-b-2 border-yellow-600/50 shadow-2xl">
      {/* Vintage ornamental border */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-red-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                {/* Vintage logo frame */}
                <div className="absolute -inset-3 border-2 border-yellow-600/30 rounded-none"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-none group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-r from-amber-700 to-orange-700 p-4 border-2 border-yellow-500">
                  <Film className="w-8 h-8 text-yellow-200" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-200 via-amber-100 to-orange-200 bg-clip-text font-['Cinzel'] tracking-wider">
                  TeleHub
                </span>
                <span className="text-sm text-yellow-300 tracking-[0.2em] font-medium font-['Playfair_Display'] italic">Classic Cinema</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex space-x-2 ml-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center space-x-3 px-6 py-3 transition-all duration-300 relative ${
                      location === item.href
                        ? "bg-gradient-to-r from-yellow-700/40 to-orange-700/40 text-yellow-200 border-b-2 border-yellow-500"
                        : "text-amber-200 hover:text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-800/20 hover:to-orange-800/20"
                    }`}
                  >
                    <div className="absolute inset-0 border border-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="font-semibold font-['Cinzel'] tracking-wider relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">            {/* Vintage Search bar */}
            <div className="relative hidden md:block">
              <div className="absolute -inset-1 border-2 border-yellow-600/30"></div>
              <div className="relative bg-gradient-to-r from-amber-800/60 to-orange-800/60 backdrop-blur-sm border-2 border-yellow-600/50 flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-300" />
                <Input
                  type="text"
                  placeholder="Search classics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 bg-transparent border-0 text-yellow-100 placeholder-yellow-400/70 focus:ring-2 focus:ring-yellow-500/50 font-['Libre_Baskerville']"
                />
              </div>
            </div>
            
            {/* Vintage Notifications */}
            <Button 
              variant="ghost" 
              size="sm"
              className="relative p-3 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-800/30 backdrop-blur-sm border border-yellow-600/30 transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border border-yellow-400 animate-pulse"></div>
            </Button>
            
            {user ? (
              <Link href="/profile">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 bg-gradient-to-r from-amber-800/60 to-orange-800/60 backdrop-blur-sm border-2 border-yellow-600/50 text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-700/40 hover:to-orange-700/40 px-6 py-3 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-yellow-400 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium font-['Cinzel']">{user.username}</span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-3 border-2 border-yellow-600/50 transition-all duration-300 hover:scale-105 shadow-lg font-['Cinzel'] tracking-wider">
                  <User className="w-4 h-4 mr-2" />
                  SIGN IN
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              className="lg:hidden text-yellow-300 hover:text-yellow-200 p-3 hover:bg-yellow-800/30 border border-yellow-600/30"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
        {/* Vintage Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-amber-900/95 via-orange-900/95 to-red-900/95 backdrop-blur-xl border-t-2 border-yellow-600/50">
          <div className="px-6 py-6 space-y-6">
            {/* Vintage Mobile search */}
            <div className="relative">
              <div className="absolute -inset-1 border-2 border-yellow-600/30"></div>
              <div className="relative bg-gradient-to-r from-amber-800/60 to-orange-800/60 backdrop-blur-sm border-2 border-yellow-600/50 flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-300" />
                <Input
                  type="text"
                  placeholder="Search classics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full bg-transparent border-0 text-yellow-100 placeholder-yellow-400/70 font-['Libre_Baskerville']"
                />
              </div>
            </div>
            
            {/* Vintage Mobile navigation */}
            <div className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-4 px-6 py-4 border-2 border-yellow-600/30 transition-all duration-300 relative ${
                      location === item.href
                        ? "bg-gradient-to-r from-yellow-700/40 to-orange-700/40 text-yellow-200 border-yellow-500"
                        : "text-amber-200 hover:text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-800/20 hover:to-orange-800/20"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-lg font-['Cinzel'] tracking-wider">{item.name}</span>
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
