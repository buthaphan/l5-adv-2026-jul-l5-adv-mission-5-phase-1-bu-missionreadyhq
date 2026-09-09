# mission5-trademe-backend

## Overview

This project is a Node.js backend for an auction application developed as part of Mission 5.

The application uses MongoDB to store auction data and provides an API for searching auction items.

As an experimental enhancement, Azure OpenAI embeddings are used to provide semantic similarity search. This allows auction items to be matched based on the meaning of the search query rather than only exact keyword matches.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Jest
- Supertest
- Azure OpenAI
- OpenAI Node.js SDK
- dotenv

## Project Structure

```text
mission5-trademe-backend/
├── cli.js
├── models/
│   └── Auction.js
├── src/
│   ├── aiService.js
│   ├── app.js
│   ├── auctionService.js
│   ├── db.js
│   └── seeder.js
├── tests/
│   ├── aiService.test.js
│   ├── auction.test.js
│   ├── cli.test.js
│   ├── db.test.js
│   └── seeder.test.js
├── .env.example
├── package.json
└── README.md
```

## Prerequisites

Before running the project, install:

- Node.js
- MongoDB
- npm

For semantic search functionality, an Azure OpenAI resource and embedding model deployment are also required.

## Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd mission5-trademe-backend
npm install
```

Create an environment file from the provided example:

```bash
cp .env.example .env
```

Update `.env` with your local MongoDB and Azure OpenAI configuration.

## Environment Variables

The project uses the following environment variables:

```env
MONGO_URI=mongodb://localhost:27017/trademe
TEST_MONGO_URI=mongodb://localhost:27017/trademe_test_db

AZURE_OPENAI_ENDPOINT=your_openai_endpoint
AZURE_OPENAI_API_KEY=your_openai_key
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

### MongoDB

`MONGO_URI` is used by the application and CLI seeder.

`TEST_MONGO_URI` is used by the automated tests.

### Azure OpenAI

The Azure OpenAI variables are required for generating embeddings and using semantic search.

Do not commit the `.env` file or real API credentials to source control.

## Task 5: Seed Auction Data

The project includes a command-line tool for adding sample auction data to MongoDB and clearing the auction collection.

### Seed Sample Data

Make sure MongoDB is running, then run:

```bash
npm run seed
```

This inserts the sample auction data into MongoDB.

### Clear Auction Data

To remove all auction data:

```bash
npm run clear
```

The seed data contains sample auction items with the following fields:

- `title`
- `description`
- `start_price`
- `reserve_price`

The seed data is stored in `src/seeder.js` and is included in source control so team members can use the same data after cloning the repository.

## Task 6: Display Similar Auction Items

The application provides an API for searching auction items stored in MongoDB.

### Keyword Search

The keyword search endpoint is:

```text
GET /auctions/search?keyword=<search-term>
```

For example:

```text
GET /auctions/search?keyword=leather
```

The search checks both the auction title and description and is case-insensitive.

### Semantic Search

As an experimental AI enhancement, the project also supports semantic auction search using Azure OpenAI embeddings.

The process is:

```text
Search query
     ↓
Azure OpenAI embedding
     ↓
Query embedding vector
     ↓
Compare with auction embeddings
     ↓
Cosine similarity
     ↓
Rank auctions
     ↓
Apply similarity threshold
     ↓
Return similar auctions
```

The semantic search compares the meaning of the search query with the meaning represented by each auction's embedding.

A similarity threshold of `0.5` is used by default to exclude auctions with low semantic similarity.

## Running Tests

Run the complete automated test suite with:

```bash
npm test
```

The tests cover:

- MongoDB connection
- CLI seeding
- CLI data clearing
- Auction creation
- Keyword search
- Semantic search
- Embedding generation
- Cosine similarity
- Auction similarity calculation
- Similarity ranking
- Similarity threshold filtering

## Project Notes

The semantic search functionality is an experimental generative AI enhancement for Task 6. The required task can be completed using keyword-based MongoDB search; Azure OpenAI was added to explore how generative AI can improve auction search by identifying semantically similar items.
