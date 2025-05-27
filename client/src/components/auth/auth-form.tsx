import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email, data.username, data.password);
      toast({
        title: "Account created!",
        description: "Welcome to TeleHub. Your account has been created successfully.",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {isLogin ? (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...loginForm.register("password")}
            />
            {loginForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={loginForm.formState.isSubmitting}
          >
            {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      ) : (
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...registerForm.register("email")}
            />
            {registerForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...registerForm.register("username")}
            />
            {registerForm.formState.errors.username && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...registerForm.register("password")}
            />
            {registerForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              {...registerForm.register("confirmPassword")}
            />
            {registerForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={registerForm.formState.isSubmitting}
          >
            {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      )}
      
      {/* Clean Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        variant="outline"
        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center group"
        onClick={() => window.location.href = '/api/auth/google'}
      >
        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>
      
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 transition-colors underline font-medium"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
