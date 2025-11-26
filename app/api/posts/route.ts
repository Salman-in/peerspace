import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

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

let posts: Post[] = [];

export async function GET() {
  return NextResponse.json({ posts: posts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )});
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, userName } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Post content required' }, { status: 400 });
    }

    const newPost: Post = {
      id: Date.now().toString(),
      userId,
      userName: userName || 'Anonymous',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      replies: [],
    };

    posts.unshift(newPost);

    if (posts.length > 100) {
      posts = posts.slice(0, 100);
    }

    return NextResponse.json({ post: newPost });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (posts[postIndex].userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this post' }, { status: 403 });
    }

    posts.splice(postIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, content, userName } = await req.json();

    if (!postId || !content || !content.trim()) {
      return NextResponse.json({ error: 'Post ID and content required' }, { status: 400 });
    }

    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const newReply: Reply = {
      id: Date.now().toString(),
      userId,
      userName: userName || 'Anonymous',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    post.replies.push(newReply);

    return NextResponse.json({ reply: newReply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}
