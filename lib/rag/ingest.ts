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
  
  // Remove script, style, and other non-content tags
  $("script, style, nav, header, footer, iframe, noscript").remove();
  
  // Extract text from body
  const text = $("body").text()
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
  
  return [{
    pageContent: text,
    metadata: { source: url }
  }];
}

async function ingest() {
  const docs = [];

  // Ingest PDFs from a folder
  const pdfFolder = path.join(process.cwd(), "data/pdfs");
  if (fs.existsSync(pdfFolder)) {
    const pdfFiles = fs.readdirSync(pdfFolder).filter(f => f.endsWith(".pdf"));
    for (const file of pdfFiles) {
      console.log(`Ingesting PDF: ${file}`);
      const pdfDocs = await ingestPDF(path.join(pdfFolder, file));
      docs.push(...pdfDocs);
    }
  }

  // Ingest URLs from a file
  const urlsFile = path.join(process.cwd(), "data/urls.txt");
  if (fs.existsSync(urlsFile)) {
    const urls = fs.readFileSync(urlsFile, "utf-8")
      .split("\n")
      .filter(u => u.trim() && !u.startsWith("#"));
    for (const url of urls) {
      console.log(`Ingesting URL: ${url}`);
      const urlDocs = await ingestURL(url);
      docs.push(...urlDocs);
    }
  }

  // Ingest raw text
  const rawText = `
  PeerSpace is a college community interaction platform.
  Students can discuss, post and everything.
  Sahydri is a college located in Mangalore, India.
  Full name is Sahydri College of Engineering and Management.
  `;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const textDocs = await splitter.createDocuments([rawText]);
  docs.push(...textDocs);

  // Split all documents
  const splitDocs = await splitter.splitDocuments(docs);

  // Push into Chroma vector DB
  await Chroma.fromDocuments(splitDocs, embeddings, {
    url: "http://localhost:8000",
    collectionName: "peerspace_rag",
  });

  console.log(`Successfully ingested ${splitDocs.length} document chunks into Chroma!`);
}

ingest();
