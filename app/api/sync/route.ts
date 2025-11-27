import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { Post } from '@/lib/models';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { embeddings } from '@/lib/rag/embeddings';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('peerspace');
    const posts = await db.collection<Post>('posts').find({}).toArray();

    if (posts.length === 0) {
      return NextResponse.json({ message: 'No posts to sync', synced: 0 });
    }

    const documents = posts.map(post => ({
      pageContent: `Post by ${post.userName}: ${post.content}\n${post.replies.map(r => `Reply by ${r.userName}: ${r.content}`).join('\n')}`,
      metadata: { 
        source: 'community_post',
        postId: post.id,
        timestamp: post.timestamp 
      }
    }));

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(documents);

    await Chroma.fromDocuments(splitDocs, embeddings, {
      url: process.env.CHROMA_URL || 'http://localhost:8000',
      collectionName: 'peerspace_rag',
    });

    return NextResponse.json({ 
      message: 'Posts synced to RAG system',
      synced: posts.length,
      chunks: splitDocs.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Failed to sync posts' }, { status: 500 });
  }
}