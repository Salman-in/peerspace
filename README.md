# PeerSpace

A college community interaction platform with AI-powered assistance using RAG (Retrieval-Augmented Generation).

## Overview

PeerSpace is a Next.js application that enables students to interact with an AI assistant (PeerAI) that can answer questions about their college using information from PDFs and websites. The platform uses MongoDB for data persistence, ChromaDB for vector storage, and Google's Gemini AI for natural language responses.

## Features

- **AI Chat Assistant (PeerAI)**: Ask questions about your college and get intelligent responses
- **RAG Pipeline**: Retrieval-Augmented Generation for accurate, context-aware answers
- **Multi-Source Ingestion**: Ingest data from PDFs and websites
- **User Authentication**: Powered by Clerk
- **Persistent Data Storage**: MongoDB for posts and AI conversation history
- **Vector Storage**: ChromaDB for document embeddings

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: MongoDB for data persistence
- **AI/ML**: LangChain, Google Gemini AI, ChromaDB
- **Authentication**: Clerk
- **Databases**: MongoDB (user data), ChromaDB (vector storage)
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
MONGODB_URI=mongodb://admin:password@localhost:27017/peerspace?authSource=admin
CHROMA_URL=http://localhost:8000
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB and ChromaDB using Docker Compose:
```bash
docker-compose up -d
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The application uses two databases:

- **MongoDB**: Stores user posts and AI conversation history
  - Accessible at `mongodb://localhost:27017`
  - Database: `peerspace`
  - Collections: `posts`, `conversations`
  - Default credentials: `admin:password`

- **ChromaDB**: Stores document embeddings for RAG
  - Accessible at `http://localhost:8000`
  - Data persisted in `./chroma_data/` directory

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
echo "example.com" >> data/urls.txt

# Ingest all data
npm run ingest
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run ingest` - Ingest PDFs and URLs into ChromaDB
- `npm run reset-db` - Clear ChromaDB collection
- `npm run db:up` - Start MongoDB and ChromaDB containers
- `npm run db:down` - Stop all database containers
- `npm run db:logs` - View database container logs

## Docker Commands

```bash
# Start all services (MongoDB + ChromaDB)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# Start individual services
docker-compose up -d mongodb
docker-compose up -d chromadb
```

## How It Works

1. **Data Ingestion**: PDFs and web pages are scraped, chunked, and embedded using Google Gemini embeddings
2. **Vector Storage**: Embeddings are stored in ChromaDB for efficient similarity search
3. **Data Persistence**: User posts and AI conversation history are stored in MongoDB
4. **Community Knowledge**: Users can sync community posts to the RAG system via Settings page
5. **Query Processing**: User questions are embedded and matched against stored documents
6. **Response Generation**: Relevant context is retrieved and passed to Gemini AI to generate natural responses
7. **History Tracking**: All AI conversations are automatically saved to MongoDB for each user

## Syncing Community Posts to RAG

To make PeerAI answer questions based on community discussions:

1. Go to **Dashboard → Settings**
2. Scroll to the **RAG System** section
3. Click **Sync Posts to RAG** button
4. All community posts and replies will be indexed into the AI knowledge base
5. PeerAI can now answer questions using community-generated content

## Contributing

Feel free to submit issues and pull requests.
