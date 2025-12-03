import fs from "fs";
import fetch from "node-fetch";

// Load eval set
const evalSet = JSON.parse(fs.readFileSync("./datasets/evalset.json", "utf-8"));

let recallSum = 0, precisionSum = 0, mrrSum = 0, latencySum = 0;

const normalize = (s) => s.toLowerCase().split("/").pop();

for (const item of evalSet) {
  const start = Date.now();
  const res = await fetch("http://localhost:3000/api/retrieve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: item.question }),
  });
  const latency = Date.now() - start;

  const json = await res.json();

  if (!json.sources || !Array.isArray(json.sources)) {
    console.error(`Error in Q${item.id}: Invalid response`, json);
    continue;
  }

  const retrieved = json.sources.map((doc) => normalize(doc.source));
  const relevant = item.relevant_docs.map(normalize);

  const relevantRetrieved = retrieved.filter((doc) => relevant.includes(doc));
  const recall = relevantRetrieved.length > 0 ? 1 : 0;
  const precision = retrieved.length ? relevantRetrieved.length / retrieved.length : 0;
  const rank = retrieved.findIndex((doc) => relevant.includes(doc));
  const mrr = rank !== -1 ? 1 / (rank + 1) : 0;

  recallSum += recall;
  precisionSum += precision;
  mrrSum += mrr;
  latencySum += latency;

  console.log(`Q${item.id}: R@K=${recall}, P@K=${precision.toFixed(2)}, MRR=${mrr.toFixed(2)}, Latency=${latency}ms`);
  
  // Debug: Show mismatches
  if (recall === 0) {
    console.log(`  ❌ Expected: [${relevant.join(", ")}]`);
    console.log(`  ❌ Retrieved: [${retrieved.join(", ")}]`);
  }
}

console.log("\n=== Results ===");
console.log("Average Recall@K:", (recallSum / evalSet.length).toFixed(2));
console.log("Average Precision@K:", (precisionSum / evalSet.length).toFixed(2));
console.log("Average MRR:", (mrrSum / evalSet.length).toFixed(2));
console.log("Average Latency:", Math.round(latencySum / evalSet.length) + "ms");
