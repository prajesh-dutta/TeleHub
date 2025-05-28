import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Reply, ThumbsUp } from "lucide-react";

interface Comment {
  _id: string;
  movieId: string;
  userId: string;
  username: string;
  content: string;
  parentCommentId?: string;
  likes: string[];
  replies: Comment[];
  createdAt: string;
}

interface MovieCommentsProps {
  movieId: string;
}

export default function MovieComments({ movieId }: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment on movies.",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/movies/${movieId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment("");
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully."
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/movies/${movieId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content: replyContent, parentCommentId: parentId })
      });

      if (response.ok) {
        const reply = await response.json();
        // Update the parent comment's replies
        setComments(comments.map(comment => 
          comment._id === parentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        ));
        setReplyContent("");
        setReplyToId(null);
        toast({
          title: "Reply added",
          description: "Your reply has been posted successfully."
        });
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        const { likes, isLiked } = await response.json();
        // Update comment likes in state
        setComments(comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: isLiked 
                ? [...comment.likes, user.id]
                : comment.likes.filter(id => id !== user.id)
            };
          }
          return comment;
        }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-900/50 rounded-xl p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
          Join the Discussion
        </h3>
        
        {user ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about this movie..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            <Button
              onClick={submitComment}
              disabled={!newComment.trim() || submitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        ) : (
          <p className="text-gray-400">Please sign in to join the discussion.</p>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          Comments ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-white font-medium">{comment.username}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-gray-300 mb-4 leading-relaxed">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleLike(comment._id)}
                  className={`flex items-center space-x-2 text-sm transition-colors ${
                    user && comment.likes.includes(user.id)
                      ? "text-red-400"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${
                    user && comment.likes.includes(user.id) ? "fill-current" : ""
                  }`} />
                  <span>{comment.likes.length}</span>
                </button>

                <button
                  onClick={() => setReplyToId(replyToId === comment._id ? null : comment._id)}
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyToId === comment._id && user && (
                <div className="mt-4 pl-4 border-l border-purple-500/30">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 resize-none mb-3"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => submitReply(comment._id)}
                      disabled={!replyContent.trim() || submitting}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {submitting ? "Posting..." : "Reply"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyToId(null);
                        setReplyContent("");
                      }}
                      className="border-white/20 text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l border-gray-700 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {reply.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium">{reply.username}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
