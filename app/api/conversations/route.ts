import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { Conversation } from '@/lib/models';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('peerspace');
    const conversations = await db.collection<Conversation>('conversations')
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    
    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer required' }, { status: 400 });
    }

    const conversation: Conversation = {
      id: Date.now().toString(),
      userId,
      question: question.trim(),
      answer: answer.trim(),
      timestamp: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db('peerspace');
    await db.collection<Conversation>('conversations').insertOne(conversation);

    return NextResponse.json({ conversation });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('peerspace');
    await db.collection<Conversation>('conversations').deleteMany({ userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear conversations' }, { status: 500 });
  }
}