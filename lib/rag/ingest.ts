import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "./embeddings";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import * as fs from "fs";
import * as path from "path";

async function ingestPDF(filePath: string) {
  const loader = new PDFLoader(filePath);
  return await loader.load();
}

async function ingestURL(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const cheerio = await import("cheerio");
  const $ = cheerio.load(html);

  $("script, style, nav, header, footer, iframe, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

  return [
    {
      pageContent: text,
      metadata: { source: url },
    },
  ];
}

function extractContentFromJSON(entry: any): string | null {
  if (typeof entry === "string") return entry;
  if (typeof entry === "object") {
    if (entry.content) return entry.content;
    if (entry.body) return entry.body;
    if (entry.text) return entry.text;
    if (entry.message) return entry.message;
    if (entry.description) return entry.description;
    if (entry.answer) return entry.answer;
  }
  return null;
}

async function ingest() {
  const docs = [];

  // PDFs
  const pdfFolder = path.join(process.cwd(), "data/pdfs");
  if (fs.existsSync(pdfFolder)) {
    const pdfFiles = fs.readdirSync(pdfFolder).filter((f) => f.endsWith(".pdf"));
    for (const file of pdfFiles) {
      console.log(`Ingesting PDF: ${file}`);
      const pdfDocs = await ingestPDF(path.join(pdfFolder, file));
      docs.push(...pdfDocs);
    }
  }

  // URLs
  const urlsFile = path.join(process.cwd(), "data/urls.txt");
  if (fs.existsSync(urlsFile)) {
    const urls = fs
      .readFileSync(urlsFile, "utf-8")
      .split("\n")
      .filter((u) => u.trim() && !u.startsWith("#"));
    for (const url of urls) {
      console.log(`Ingesting URL: ${url}`);
      const urlDocs = await ingestURL(url);
      docs.push(...urlDocs);
    }
  }

  // .txt files
  const textFolders = ["data", "data/docs"];
  for (const folder of textFolders) {
    const fullPath = path.join(process.cwd(), folder);
    if (fs.existsSync(fullPath)) {
      const textFiles = fs.readdirSync(fullPath).filter((f) => f.endsWith(".txt") && f !== "urls.txt");
      for (const file of textFiles) {
        console.log(`Ingesting text file: ${file}`);
        const content = fs.readFileSync(path.join(fullPath, file), "utf-8");
        docs.push({
          pageContent: content,
          metadata: { source: `${folder}/${file}` },
        });
      }
    }
  }

  // JSON files (flexible structure)
  const jsonFolder = path.join(process.cwd(), "data/json");
  if (fs.existsSync(jsonFolder)) {
    const jsonFiles = fs.readdirSync(jsonFolder).filter((f) => f.endsWith(".json"));
    for (const file of jsonFiles) {
      console.log(`Ingesting JSON file: ${file}`);
      const raw = fs.readFileSync(path.join(jsonFolder, file), "utf-8");
      const data = JSON.parse(raw);
      const fullContent = JSON.stringify(data, null, 2);
      
      docs.push({
        pageContent: fullContent,
        metadata: { source: file },
      });
    }
  }

  // Chunking
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // Push to Chroma
  await Chroma.fromDocuments(splitDocs, embeddings, {
    url: "http://localhost:8000",
    collectionName: "peerspace_rag",
    collectionMetadata: {
      description: "Main collection for peerspace RAG",
    },
  });

  console.log(`Successfully ingested ${splitDocs.length} document chunks into Chroma!`);
}

ingest();
