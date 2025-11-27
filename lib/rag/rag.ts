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

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-pro",
  temperature: 0.2,
});

export const ragChain = RunnableSequence.from([
  // Retrieve docs
  async (input: { question: string }) => {
    console.log("[RAG] Starting retrieval...");
    const startRetrieval = Date.now();
    const docs = await retriever.invoke(input.question);
    console.log(`[RAG] Retrieval took ${Date.now() - startRetrieval}ms`);

    console.log(`[RAG] Retrieved ${docs?.length || 0} documents`);
    if (docs && docs.length > 0) {
      console.log("[RAG] First doc preview:", docs[0].pageContent.substring(0, 200));
    }

    // Safeguard: handle undefined or empty results
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
      console.log("[RAG] No documents found");
      return {
        context: "",
        question: input.question,
      };
    }

    const context = docs.map(d => d.pageContent || "").join("\n\n");
    console.log(`[RAG] Context length: ${context.length} chars`);
    return {
      context,
      question: input.question,
    };
  },
  // Run the prompt + llm
  prompt,
  async (promptValue: any) => {
    console.log("[RAG] Calling LLM...");
    const startLLM = Date.now();
    const result = await llm.invoke(promptValue);
    console.log(`[RAG] LLM took ${Date.now() - startLLM}ms`);
    return result;
  },
]);

// Now you can invoke:
// (async () => {
// const results = await ragChain.invoke({ question: "what is peerspace?" });
// console.log(results);
// })();