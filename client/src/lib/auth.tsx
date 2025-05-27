import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  subscriptionTier: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    favoriteGenres?: string[];
  };
  preferences?: {
    language?: string;
    autoplay?: boolean;
    notifications?: boolean;
  };
  favorites?: string[];
  watchlist?: string[];
  watchHistory?: Array<{
    movieId: string;
    watchedAt: Date;
    progress: number;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface User extends AuthUser {}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  handleGoogleCallback: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password,
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/register", {
      email,
      username,
      password,
      confirmPassword: password,
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleGoogleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        localStorage.setItem("token", token);
        await checkAuth();
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error("Google callback failed:", error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    handleGoogleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Set authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem("token");
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Check if user has required subscription tier
 */
export function hasSubscriptionTier(user: AuthUser | null, requiredTier: 'explorer' | 'cinephile' | 'family'): boolean {
  if (!user) return false;

  const tierHierarchy = {
    explorer: 1,
    cinephile: 2,
    family: 3
  };

  const userTierLevel = tierHierarchy[user.subscriptionTier as keyof typeof tierHierarchy] || 0;
  const requiredTierLevel = tierHierarchy[requiredTier];

  return userTierLevel >= requiredTierLevel;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  return { isValid: true };
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): { isValid: boolean; message?: string } {
  if (username.length < 3) {
    return { isValid: false, message: "Username must be at least 3 characters long" };
  }

  if (username.length > 30) {
    return { isValid: false, message: "Username must be no more than 30 characters long" };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, and underscores" };
  }

  return { isValid: true };
}
