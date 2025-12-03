import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embeddings";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

let vectorstoreInstance: Chroma | null = null;

export const getVectorstore = async () => {
  if (!vectorstoreInstance) {
    vectorstoreInstance = await Chroma.fromExistingCollection(embeddings, {
      url: CHROMA_URL,
      collectionName: "peerspace_rag",
    });
  }
  return vectorstoreInstance;
};

// For backward compatibility
export const vectorstore = new Chroma(embeddings, {
  url: CHROMA_URL,
  collectionName: "peerspace_rag",
});