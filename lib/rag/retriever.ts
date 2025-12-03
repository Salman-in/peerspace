import { vectorstore } from "./vectorstore";

const baseRetriever = vectorstore.asRetriever({
  k: 3,
  searchType: "similarity",
});

const MAX_CONTEXT_CHARS = 3500; // Limit total context size for faster LLM processing

export const retriever = {
  async invoke(query: string) {
    const start = Date.now();
    const docs = await baseRetriever.invoke(query);
    const retrievalTime = Date.now() - start;

    // Deduplicate based on content hash to avoid redundant context
    const seen = new Set();
    const uniqueDocs = docs.filter(d => {
      const hash = d.pageContent.slice(0, 100); // Simple hash using first 100 chars
      if (seen.has(hash)) return false;
      seen.add(hash);
      return true;
    });

    // Trim each doc to prevent excessive context
    const trimmedDocs = uniqueDocs.map(doc => ({
      ...doc,
      pageContent: doc.pageContent.slice(0, MAX_CONTEXT_CHARS / uniqueDocs.length)
    }));

    console.log(`[RETRIEVER] Query: "${query}"`);
    console.log(`[RETRIEVER] Retrieved ${docs.length} docs in ${retrievalTime}ms (${uniqueDocs.length} unique):`);
    trimmedDocs.forEach((doc, i) => {
      console.log(`  [${i + 1}] ${doc.metadata?.source || 'unknown'} (${doc.pageContent.length} chars)`);
    });

    return trimmedDocs;
  },
};