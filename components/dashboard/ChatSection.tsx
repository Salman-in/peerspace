'use client';

import { useState, useEffect } from 'react';
import { Send, MessageCircle, Trash2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

const ChatSection = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          userName: user?.firstName || user?.username || 'Anonymous',
        }),
      });

      if (res.ok) {
        setContent('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: replyContent,
          userName: user?.firstName || user?.username || 'Anonymous',
        }),
      });

      if (res.ok) {
        setReplyContent('');
        setReplyingTo(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0f0f0f]">
      <div className="p-5 border-b border-[#2a2a2a]">
        <h2 className="text-lg font-medium text-[#e8e8e8]">Community Feed</h2>
        <p className="text-xs text-[#8e8e8e]">Share your thoughts with the community</p>
      </div>

      {/* Create Post */}
      <form onSubmit={handleCreatePost} className="p-4 border-b border-[#2a2a2a]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-4 py-3 rounded-md border border-[#3a3a3a] bg-[#1a1a1a] text-[#e8e8e8] placeholder-[#6e6e6e] focus:outline-none focus:ring-1 focus:ring-[#d4a574] focus:border-[#d4a574] transition text-sm resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#d4a574] text-[#1a1a1a] rounded-md hover:bg-[#c49564] focus:outline-none transition disabled:opacity-50 text-sm font-medium flex items-center space-x-2"
            disabled={!content.trim()}
          >
            <Send className="h-4 w-4" />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8e8e8e] text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-[#1a1a1a] rounded-md p-4 border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#d4a574] rounded-full flex items-center justify-center text-[#1a1a1a] font-medium text-sm">
                    {post.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#e8e8e8] text-sm">{post.userName}</p>
                    <p className="text-xs text-[#6e6e6e]">
                      {new Date(post.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {post.userId === user?.id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-[#8e8e8e] hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-[#e8e8e8] text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center space-x-4 text-[#8e8e8e]">
                <button 
                  onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  className="flex items-center space-x-1 hover:text-[#d4a574] transition text-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.replies.length > 0 ? post.replies.length : 'Reply'}</span>
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#2a2a2a] space-y-2">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-2">
                      <div className="w-6 h-6 bg-[#d4a574] rounded-full flex items-center justify-center text-[#1a1a1a] font-medium text-xs shrink-0">
                        {reply.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-[#e8e8e8] text-xs">{reply.userName}</p>
                          <p className="text-xs text-[#6e6e6e]">
                            {new Date(reply.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </p>
                        </div>
                        <p className="text-[#e8e8e8] text-xs mt-1">{reply.content}</p>
                        <button
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                          className="flex items-center space-x-1 text-[#8e8e8e] hover:text-[#d4a574] transition text-xs mt-1"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {replyingTo === post.id && (
                <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 px-3 py-2 rounded-md border border-[#3a3a3a] bg-[#0f0f0f] text-[#e8e8e8] placeholder-[#6e6e6e] focus:outline-none focus:ring-1 focus:ring-[#d4a574] focus:border-[#d4a574] transition text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleReply(post.id)}
                      disabled={!replyContent.trim()}
                      className="px-3 py-2 bg-[#d4a574] text-[#1a1a1a] rounded-md hover:bg-[#c49564] focus:outline-none transition disabled:opacity-50 text-xs font-medium"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSection;
