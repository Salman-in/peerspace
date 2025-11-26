# PeerSpace

A college community interaction platform with AI-powered assistance using RAG (Retrieval-Augmented Generation).

## Overview

PeerSpace is a Next.js application that enables students to interact with an AI assistant (PeerAI) that can answer questions about their college using information from PDFs and websites. The platform uses ChromaDB for vector storage and Google's Gemini AI for natural language responses.

## Features

- **AI Chat Assistant (PeerAI)**: Ask questions about your college and get intelligent responses
- **RAG Pipeline**: Retrieval-Augmented Generation for accurate, context-aware answers
- **Multi-Source Ingestion**: Ingest data from PDFs and websites
- **User Authentication**: Powered by Clerk
- **Persistent Vector Storage**: ChromaDB with Docker for data persistence

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **AI/ML**: LangChain, Google Gemini AI, ChromaDB
- **Authentication**: Clerk
- **Vector Database**: ChromaDB (Docker)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- Docker
- npm/yarn/pnpm

### Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key
CHROMA_URL=http://localhost:8000
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start ChromaDB (required for RAG functionality):
```bash
docker run -d -p 8000:8000 -v $(pwd)/chroma_data:/chroma/chroma --name chromadb chromadb/chroma
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Ingestion

### Adding Content

1. **PDFs**: Place PDF files in `data/pdfs/` folder
2. **URLs**: Add website URLs (one per line) in `data/urls.txt`

### Running Ingestion

```bash
# Ingest data into ChromaDB
npm run ingest

# Reset database (clear all data)
npm run reset-db
```

### Example

```bash
# Add PDFs
cp college-handbook.pdf data/pdfs/

# Add URLs
echo "https://sahyadri.edu.in" >> data/urls.txt
echo "https://sosc.org.in" >> data/urls.txt

# Ingest all data
npm run ingest
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run ingest` - Ingest PDFs and URLs into ChromaDB
- `npm run reset-db` - Clear ChromaDB collection

## Docker Commands

```bash
# Start ChromaDB
docker start chromadb

# Stop ChromaDB
docker stop chromadb

# Remove container
docker rm chromadb
```

## How It Works

1. **Data Ingestion**: PDFs and web pages are scraped, chunked, and embedded using Google Gemini embeddings
2. **Vector Storage**: Embeddings are stored in ChromaDB for efficient similarity search
3. **Query Processing**: User questions are embedded and matched against stored documents
4. **Response Generation**: Relevant context is retrieved and passed to Gemini AI to generate natural responses

## Contributing

Feel free to submit issues and pull requests.
