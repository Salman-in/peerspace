import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { Post, Reply } from '@/lib/models';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('peerspace');
    const posts = await db.collection<Post>('posts')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
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

    const client = await clientPromise;
    const db = client.db('peerspace');
    await db.collection<Post>('posts').insertOne(newPost);

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

    const client = await clientPromise;
    const db = client.db('peerspace');
    
    const post = await db.collection<Post>('posts').findOne({ id: postId });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this post' }, { status: 403 });
    }

    await db.collection<Post>('posts').deleteOne({ id: postId });

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

    const client = await clientPromise;
    const db = client.db('peerspace');
    
    const post = await db.collection<Post>('posts').findOne({ id: postId });
    
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

    await db.collection<Post>('posts').updateOne(
      { id: postId },
      { $push: { replies: newReply } }
    );

    return NextResponse.json({ reply: newReply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}
