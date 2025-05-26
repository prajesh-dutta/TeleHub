import { useLocation } from "wouter";

export function useSearchParams() {
  const [location] = useLocation();
  
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  return {
    movieId: searchParams.get('id'),
    query: searchParams.get('q'),
    genre: searchParams.get('genre'),
  };
}