import { vectorstore } from "./vectorstore";

export const retriever = vectorstore.asRetriever({
  k: 10,
  searchType: "similarity",
});