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
    const docs = await retriever.invoke(input.question);

    console.log(`Retrieved ${docs?.length || 0} documents`);
    if (docs && docs.length > 0) {
      console.log("First doc preview:", docs[0].pageContent.substring(0, 200));
    }

    // Safeguard: handle undefined or empty results
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
      return {
        context: "",
        question: input.question,
      };
    }

    return {
      context: docs.map(d => d.pageContent || "").join("\n\n"),
      question: input.question,
    };
  },
  // Run the prompt + llm
  prompt,
  llm,
]);

// Now you can invoke:
(async () => {
const results = await ragChain.invoke({ question: "what is peerspace?" });
console.log(results);
})();