import fs from "fs";

const data = JSON.parse(fs.readFileSync("./datasets/results.json", "utf8"));
let correctCount = 0;
let totalLatency = 0;

for (const row of data) {
  if (row.correct) correctCount++;
  totalLatency += row.latency;
}

const avgLatency = totalLatency / data.length;
const accuracy = (correctCount / data.length) * 100;

console.log("✅ Accuracy:", accuracy.toFixed(2) + "%");
console.log("⏱ Avg Latency:", avgLatency.toFixed(1) + "ms");
console.log("📊 Total Queries Evaluated:", data.length);
