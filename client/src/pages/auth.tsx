import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import AuthForm from "@/components/auth/auth-form";
import { Card, CardContent } from "@/components/ui/card";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center cinematic-gradient px-4">
      <div className="absolute inset-0 film-grain"></div>
      
      <Card className="w-full max-w-md mx-4 bg-slate-900/90 border-purple-800/30 backdrop-blur-sm relative z-10">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
              <span className="text-2xl font-bold text-gradient-gold">TeleHub</span>
            </div>
            <h2 className="text-2xl font-bold text-gradient-gold mb-2">Join TeleHub</h2>
            <p className="text-gray-400">Start your cinematic journey today</p>
          </div>
          
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
