import fs from "fs";
import fetch from "node-fetch"; // run: npm install node-fetch

const evalSet = JSON.parse(fs.readFileSync("./datasets/evalset.json", "utf8"));
const results = [];

for (const item of evalSet) {
  const start = Date.now();

  const res = await fetch("http://localhost:3000/api/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: item.question }), // ✅ API expects `query`
  });

  const data = await res.json();
  const answer = data.answer?.trim() || "No answer";
  const latency = Date.now() - start;
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const isCorrect = normalize(answer).includes(normalize(item.expected_answer));

  results.push({
    id: item.id,
    question: item.question,
    expected: item.expected_answer,
    answer,
    correct: isCorrect,
    latency,
  });

  console.log(`Q${item.id}: ✅ ${isCorrect} in ${latency}ms`);
}

fs.writeFileSync("./datasets/results.json", JSON.stringify(results, null, 2));
