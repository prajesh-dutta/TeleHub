import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Discover from "@/pages/discover";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import MovieDetail from "@/pages/movie-detail";
import GoogleCallback from "@/pages/google-callback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/auth/google/callback" component={GoogleCallback} />
      <Route path="/discover" component={Discover} />
      <Route path="/profile" component={Profile} />
      <Route path="/movie" component={MovieDetail} />
      <Route path="/community" component={Home} />
      <Route path="/kids" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
