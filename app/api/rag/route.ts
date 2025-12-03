import { ragChain } from "@/lib/rag/rag";
import { NextResponse } from "next/server";

const MAX_QUERY_LENGTH = 1000; // safeguard for excessively long queries

export async function POST(req: Request) {
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body?.query;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "`query` must be a non-empty string" }, { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: `Query too long (max ${MAX_QUERY_LENGTH} chars)` }, { status: 413 });
  }

  try {
    // Increased timeout for LLM API calls
    const resultPromise = ragChain.invoke({ question: query });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("RAG_TIMEOUT")), 60_000) // 60 seconds
    );

    const answer = await Promise.race([resultPromise, timeoutPromise]);

    return NextResponse.json({ answer }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    if (error?.message === "RAG_TIMEOUT") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }

    console.error("RAG pipeline error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}