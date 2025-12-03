import fs from "fs";
import fetch from "node-fetch";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

// Use same model for NoRAG to ensure fair comparison
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-pro",
  temperature: 0.2,
});

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

// Check if answer contains specific factual data
const hasSpecificFacts = (answer, expected) => {
  const normalizedAnswer = normalize(answer);
  const normalizedExpected = normalize(expected);
  
  // Extract numbers/percentages from expected answer
  const expectedNumbers = normalizedExpected.match(/\d+/g) || [];
  const answerNumbers = normalizedAnswer.match(/\d+/g) || [];
  
  // Check if ALL critical numbers match (strict requirement)
  if (expectedNumbers.length === 0) return true; // No numbers to check
  if (answerNumbers.length === 0) return false; // Expected numbers but got none
  
  const numberMatch = expectedNumbers.every(num => answerNumbers.includes(num));
  
  return numberMatch;
};

// Check for vague/generic responses
const isVagueResponse = (answer) => {
  const vaguePhrases = [
    "i don't know",
    "i'm not sure",
    "cannot provide",
    "don't have access",
    "unable to answer",
    "typically",
    "generally",
    "usually",
    "varies",
    "may vary",
    "check with",
    "contact the",
    "consult"
  ];
  
  const normalizedAnswer = normalize(answer);
  return vaguePhrases.some(phrase => normalizedAnswer.includes(normalize(phrase)));
};

const tokenOverlapScore = (answer, expected) => {
  const a = new Set(normalize(answer).split(/\s+/));
  const b = new Set(normalize(expected).split(/\s+/));
  const intersection = [...a].filter((x) => b.has(x));
  return intersection.length / b.size;
};

const keywordScore = (answer, keywords) => {
  if (!keywords || keywords.length === 0) return 0;
  const normalizedAnswer = normalize(answer);
  const matched = keywords.filter(kw => normalizedAnswer.includes(normalize(kw)));
  return matched.length / keywords.length;
};

const combinedScore = (answer, expected, keywords) => {
  // If answer is vague, automatic fail
  if (isVagueResponse(answer)) {
    return {
      token: 0,
      keyword: 0,
      fact: 0,
      vague: true,
      combined: 0
    };
  }
  
  const tokenScore = tokenOverlapScore(answer, expected);
  const kwScore = keywordScore(answer, keywords);
  const factScore = hasSpecificFacts(answer, expected) ? 1.0 : 0.0;
  
  // Must have facts to pass - weight facts heavily
  return {
    token: tokenScore,
    keyword: kwScore,
    fact: factScore,
    vague: false,
    combined: factScore === 0 ? 0 : (tokenScore * 0.3 + kwScore * 0.3 + factScore * 0.4)
  };
};

// Stricter threshold - need 80% match
const THRESHOLD = 0.80;

const evalSet = JSON.parse(fs.readFileSync("./datasets/evalset.json", "utf8"));
const results = [];

// Limit to first 10 questions for faster testing
const testSet = evalSet.slice(0, 10);

for (const item of testSet) {
  const question = item.question;
  const expected = item.expected_answer;

  // RAG call
  const startRag = Date.now();
  const ragRes = await fetch("http://localhost:3000/api/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });
  const ragData = await ragRes.json();
  const rag = ragData.answer || "";
  const ragLatency = Date.now() - startRag;

  // No-RAG LLM call
  const startNoRag = Date.now();
  const llmRes = await model.invoke([{ role: "user", content: question }]);
  const noRag = llmRes.content || "";
  const noRagLatency = Date.now() - startNoRag;

  // Score evaluation
  const ragScores = combinedScore(rag, expected, item.keywords);
  const noRagScores = combinedScore(noRag, expected, item.keywords);

  const result = {
    id: item.id,
    question,
    expected,
    rag,
    ragScore: ragScores.combined.toFixed(2),
    ragCorrect: ragScores.combined >= THRESHOLD,
    ragLatency,
    noRag,
    noRagScore: noRagScores.combined.toFixed(2),
    noRagCorrect: noRagScores.combined >= THRESHOLD,
    noRagLatency,
    ragDetails: ragScores,
    noRagDetails: noRagScores
  };

  results.push(result);

  console.log(
    `Q${item.id}: RAG✅=${result.ragCorrect} (${ragScores.combined.toFixed(2)}, ${ragLatency}ms), ` +
    `NoRAG✅=${result.noRagCorrect} (${noRagScores.combined.toFixed(2)}, ${noRagLatency}ms)` +
    (ragScores.vague ? " ⚠️ RAG vague" : "") +
    (noRagScores.vague ? " ⚠️ NoRAG vague" : "") +
    (ragScores.fact === 0 && !ragScores.vague ? " ⚠️ RAG missing facts" : "") +
    (noRagScores.fact === 0 && !noRagScores.vague ? " ⚠️ NoRAG missing facts" : "")
  );
}

// Calculate summary stats
const ragCorrectCount = results.filter(r => r.ragCorrect).length;
const noRagCorrectCount = results.filter(r => r.noRagCorrect).length;
const avgRagLatency = (results.reduce((sum, r) => sum + r.ragLatency, 0) / results.length).toFixed(0);
const avgNoRagLatency = (results.reduce((sum, r) => sum + r.noRagLatency, 0) / results.length).toFixed(0);

console.log("\n" + "=".repeat(60));
console.log("📊 SUMMARY");
console.log("=".repeat(60));
console.log(`RAG:   ${ragCorrectCount}/${results.length} correct (${((ragCorrectCount/results.length)*100).toFixed(0)}%) | Avg: ${avgRagLatency}ms`);
console.log(`NoRAG: ${noRagCorrectCount}/${results.length} correct (${((noRagCorrectCount/results.length)*100).toFixed(0)}%) | Avg: ${avgNoRagLatency}ms`);
console.log(`\n💡 RAG Improvement: ${ragCorrectCount - noRagCorrectCount > 0 ? '+' : ''}${ragCorrectCount - noRagCorrectCount} more correct answers`);
console.log(`⚡ Speed: RAG is ${(avgRagLatency/avgNoRagLatency).toFixed(2)}x ${avgRagLatency < avgNoRagLatency ? 'faster' : 'slower'}`);
console.log("=".repeat(60));

fs.writeFileSync(
  "./datasets/rag_vs_no_rag.json",
  JSON.stringify(results, null, 2)
);
console.log("\n✅ Results saved to datasets/rag_vs_no_rag.json");
