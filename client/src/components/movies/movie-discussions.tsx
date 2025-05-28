import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, ThumbsDown, Plus, Pin } from 'lucide-react';

interface Discussion {
  _id: string;
  movieId: string;
  title: string;
  content: string;
  createdBy: string;
  username: string;
  tags: string[];
  upvotes: string[];
  downvotes: string[];
  commentCount: number;
  isSticky: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MovieDiscussionsProps {
  movieId: string;
}

export default function MovieDiscussions({ movieId }: MovieDiscussionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, [movieId]);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}/discussions`);
      const data = await response.json();
      
      if (response.ok) {
        setDiscussions(data);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDiscussion = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to create a discussion",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content for the discussion",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/movies/${movieId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Discussion created",
          description: "Your discussion has been posted successfully",
        });
        
        // Reset form and refresh discussions
        setTitle('');
        setContent('');
        setTags('');
        setShowCreateForm(false);
        await fetchDiscussions();
      } else {
        throw new Error(data.error || 'Failed to create discussion');
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteOnDiscussion = async (discussionId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to vote on discussions",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/discussions/${discussionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ voteType }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the discussion in state
        setDiscussions(discussions.map(discussion => 
          discussion._id === discussionId ? data : discussion
        ));
      } else {
        throw new Error(data.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting on discussion:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVoteScore = (discussion: Discussion) => {
    return discussion.upvotes.length - discussion.downvotes.length;
  };

  const hasUserVoted = (discussion: Discussion, voteType: 'upvote' | 'downvote') => {
    if (!user) return false;
    const votes = voteType === 'upvote' ? discussion.upvotes : discussion.downvotes;
    return votes.includes(user.id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Discussions
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Discussions ({discussions.length})
          </div>
          <Button
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Discussion Form */}
        {showCreateForm && (
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h4 className="font-semibold">Create New Discussion</h4>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                placeholder="Enter discussion title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                placeholder="Share your thoughts, theories, or questions about this movie..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length}/1000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (Optional)</label>
              <Input
                placeholder="theory, plot, characters, easter-eggs (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={createDiscussion}
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? 'Creating...' : 'Create Discussion'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setTitle('');
                  setContent('');
                  setTags('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Discussions List */}
        {discussions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No discussions yet. Be the first to start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions
              .sort((a, b) => {
                // Sticky discussions first, then by creation date
                if (a.isSticky && !b.isSticky) return -1;
                if (!a.isSticky && b.isSticky) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((discussion) => (
                <div key={discussion._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                      <Button
                        size="sm"
                        variant={hasUserVoted(discussion, 'upvote') ? 'default' : 'ghost'}
                        onClick={() => voteOnDiscussion(discussion._id, 'upvote')}
                        className="h-8 w-8 p-0"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      
                      <span className={`text-sm font-medium ${
                        getVoteScore(discussion) > 0 ? 'text-green-600' : 
                        getVoteScore(discussion) < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {getVoteScore(discussion)}
                      </span>
                      
                      <Button
                        size="sm"
                        variant={hasUserVoted(discussion, 'downvote') ? 'default' : 'ghost'}
                        onClick={() => voteOnDiscussion(discussion._id, 'downvote')}
                        className="h-8 w-8 p-0"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {discussion.isSticky && (
                          <Pin className="h-4 w-4 text-blue-600" />
                        )}
                        <h4 className="font-semibold text-lg">{discussion.title}</h4>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-3">{discussion.content}</p>
                      
                      {/* Tags */}
                      {discussion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {discussion.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>by {discussion.username}</span>
                          <span>•</span>
                          <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                          {discussion.commentCount > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {discussion.commentCount} comment{discussion.commentCount !== 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
