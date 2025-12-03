import { NextRequest, NextResponse } from "next/server";
import { retriever } from "@/lib/rag/retriever";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "`query` must be a non-empty string" },
        { status: 400 }
      );
    }

    const docs = await retriever.invoke(query);
    const sources = docs.map((doc) => ({
      source: doc.metadata?.source || "unknown",
      preview: doc.pageContent?.slice(0, 150),
    }));

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("[RETRIEVE API ERROR]", error);
    return NextResponse.json({ error: "Internal error during retrieval." }, { status: 500 });
  }
}
