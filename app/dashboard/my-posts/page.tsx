'use client';

import { useState, useEffect } from 'react';
import { Trash2, Heart, MessageCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: number;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useUser();

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      const myPosts = data.posts.filter((post: Post) => post.userId === user?.id);
      setPosts(myPosts);
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

  return (
    <div className="flex-1 h-screen bg-[#0f0f0f] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#e8e8e8]">My Posts</h1>
          <p className="text-sm text-[#8e8e8e] mt-1">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1a1a] rounded-md border border-[#2a2a2a]">
            <p className="text-[#8e8e8e] text-sm">You haven't created any posts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
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
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-[#8e8e8e] hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[#e8e8e8] text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center space-x-4 text-[#8e8e8e]">
                  <div className="flex items-center space-x-1 text-xs">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
