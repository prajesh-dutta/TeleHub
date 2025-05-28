import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, BarChart3 } from 'lucide-react';

interface Rating {
  _id: string;
  movieId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

interface MovieRatingsProps {
  movieId: string;
}

export default function MovieRatings({ movieId }: MovieRatingsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [movieId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}/ratings`);
      const data = await response.json();
      
      if (response.ok) {
        setRatings(data.ratings);
        setAverageRating(data.averageRating);
        
        // Find user's existing rating
        if (user) {
          const existingRating = data.ratings.find((r: Rating) => r.userId === user.id);
          if (existingRating) {
            setUserRating(existingRating);
            setSelectedRating(existingRating.rating);
            setReviewText(existingRating.review || '');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to rate this movie",
        variant: "destructive",
      });
      return;
    }

    if (selectedRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating between 1-10",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/movies/${movieId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          rating: selectedRating,
          review: reviewText.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Rating submitted",
          description: userRating ? "Your rating has been updated" : "Thank you for rating this movie!",
        });
        
        // Refresh ratings
        await fetchRatings();
      } else {
        throw new Error(data.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setSelectedRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = Array(10).fill(0);
    ratings.forEach(rating => {
      distribution[rating.rating - 1]++;
    });
    return distribution;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Ratings & Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const distribution = getRatingDistribution();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Ratings & Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating Display */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-yellow-500">
            {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
          </div>
          {averageRating > 0 && (
            <>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-muted-foreground">
                Based on {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
              </p>
            </>
          )}
        </div>

        {/* Rating Distribution */}
        {ratings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Rating Distribution
            </h4>
            <div className="space-y-1">
              {distribution.map((count, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="w-8">{index + 1}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ 
                        width: ratings.length > 0 ? `${(count / ratings.length) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Rating Form */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">
            {userRating ? 'Update Your Rating' : 'Rate This Movie'}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              {renderStars(selectedRating, true)}
              <p className="text-xs text-muted-foreground mt-1">
                Click stars to rate (1-10 scale)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Review (Optional)
              </label>
              <Textarea
                placeholder="Share your thoughts about this movie..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewText.length}/500 characters
              </p>
            </div>

            <Button 
              onClick={submitRating}
              disabled={isSubmitting || selectedRating === 0}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
            </Button>
          </div>
        </div>

        {/* Recent Reviews */}
        {ratings.filter(r => r.review).length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Recent Reviews</h4>
            <div className="space-y-4">
              {ratings
                .filter(rating => rating.review)
                .slice(0, 5)
                .map((rating) => (
                  <div key={rating._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {renderStars(rating.rating)}
                        <span className="text-sm font-medium">{rating.rating}/10</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rating.review}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
