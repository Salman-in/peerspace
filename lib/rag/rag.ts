import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { retriever } from "./retriever";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(`
You are a helpful assistant for PeerSpace, a college community platform.
Answer the question naturally and conversationally using the information below.
Never mention "context", "provided text", or "based on" in your response.
If you don't have enough information, simply say you don't know.

Information:
{context}

Question: {question}

Answer:`);

// Optimize LLM for speed: Use Flash model and lower max tokens
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-pro",
  temperature: 0.2,
  maxOutputTokens: 512,
  streaming: false,
});

const MAX_CONTEXT_CHARS = 3000; // Reduced from 4000 for faster processing

export const ragChain = RunnableSequence.from([
  // Retrieve docs
  async (input: { question: string }) => {
    const startTotal = Date.now();
    console.log("[RAG] Starting retrieval...");
    
    const startRetrieval = Date.now();
    const docs = await retriever.invoke(input.question);
    const retrievalTime = Date.now() - startRetrieval;
    console.log(`[RAG] ⚡ Retrieval took ${retrievalTime}ms`);

    console.log(`[RAG] Retrieved ${docs?.length || 0} documents`);
    if (docs && docs.length > 0) {
      console.log(
        "[RAG] First doc preview:",
        docs[0].pageContent.substring(0, 150)
      );
    }

    // Safeguard: handle undefined or empty results
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
      console.log("[RAG] No documents found");
      return {
        context: "",
        question: input.question,
      };
    }

    const context = docs
      .map((d) => d.pageContent || "")
      .join("\n\n")
      .slice(0, MAX_CONTEXT_CHARS); // Stricter context limit

    console.log(`[RAG] Context length: ${context.length} chars`);
    console.log(`[RAG] ⚡ Total prep took ${Date.now() - startTotal}ms`);
    return {
      context,
      question: input.question,
    };
  },
  // Format prompt
  prompt,
  // Call LLM
  llm,
  // Extract content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (result: any) => {
    return result?.content || "I don't have enough information to answer that.";
  },
]);
