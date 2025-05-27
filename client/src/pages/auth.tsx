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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 px-4">
      
      <Card className="w-full max-w-md mx-4 bg-white border border-gray-200 shadow-md rounded-lg relative z-10 overflow-hidden">
        <CardContent className="pt-8 pb-6 relative z-10">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold text-gray-900 tracking-wide">TeleHub</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Join TeleHub</h2>
            <p className="text-gray-600 text-sm">Start your cinematic journey today</p>
          </div>
          
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
