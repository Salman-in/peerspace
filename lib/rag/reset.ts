import "dotenv/config";
import { ChromaClient } from "chromadb";

async function reset() {
  const client = new ChromaClient({
    path: process.env.CHROMA_URL || "http://localhost:8000",
  });

  try {
    await client.deleteCollection({ name: "peerspace_rag" });
    console.log("Collection deleted successfully!");
  } catch (error) {
    console.log("Collection doesn't exist or already deleted");
  }
}

reset();
