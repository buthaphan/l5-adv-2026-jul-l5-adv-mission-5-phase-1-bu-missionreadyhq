# mission5-trademe-backend

## Overview

This project is a Node.js backend for an auction application developed as part of Mission 5.

The application uses MongoDB to store auction data and provides an API for searching auction items.

The project supports two search approaches:

- **Keyword search** using MongoDB text matching.
- **AI semantic search** using Azure OpenAI embeddings and cosine similarity.

The AI search is an experimental enhancement that allows auction items to be matched based on the meaning of a search query rather than only exact keywords.

---

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

---

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
│   ├── seeder.js
│   ├── seederAI.js
│   └── server.js
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

---

## Prerequisites

Install the following before running the project:

- **Node.js**
- **npm**
- **MongoDB**

For AI semantic search:

- **Azure OpenAI resource**
- **Azure OpenAI embedding model deployment**

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd l5-adv-2026-jul-l5-adv-mission-5-phase-1-bu-missionreadyhq
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create the environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Update `.env`** with the required MongoDB and Azure OpenAI configuration.

---

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/trademe
TEST_MONGO_URI=mongodb://localhost:27017/trademe_test_db

AZURE_OPENAI_ENDPOINT=your_openai_endpoint
AZURE_OPENAI_API_KEY=your_openai_key
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

> **Note:** Do not commit `.env` or real API credentials to source control.

- **MongoDB:** `MONGO_URI` is used by the application and CLI seeders. `TEST_MONGO_URI` is used by the automated tests.
- **Azure OpenAI:** The Azure OpenAI variables are required for generating embeddings and using AI semantic search.

---

## Running the Application

1. Make sure MongoDB is running.
2. Start the server:
   ```bash
   npm start
   ```

---

## Task 5: Seed Auction Data

### Seed Standard Auction Data

Run:

```bash
npm run seed
```

This inserts the standard sample auction data into MongoDB.

### Seed AI Auction Data

Run:

```bash
npm run seedAI
```

The AI seeder:

- Creates sample auction records.
- Builds text representing each auction.
- Generates an embedding using Azure OpenAI.
- Stores the auction and its embedding in MongoDB.

### Clear Auction Data

To remove all auction data:

```bash
npm run clear
```

---

## Task 6: Display Similar Auction Items

The API supports both keyword search and AI semantic search.

### Keyword Search

Keyword search is the default search mode.

```http
GET /auctions/search?keyword=<search-term>
```

**Example:**

```http
GET /auctions/search?keyword=leather
```

- The search checks the auction title and description and is case-insensitive.
- The search mode can also be specified explicitly:
  ```http
  GET /auctions/search?keyword=leather&mode=keyword
  ```

### AI Semantic Search

AI semantic search is selected using:

```http
GET /auctions/search?keyword=<search-term>&mode=ai
```

**Example:**

```http
GET /auctions/search?keyword=reliable%20ute%20for%20work&mode=ai
```

#### Semantic Search Process

```text
Search query
     ↓
Azure OpenAI
     ↓
Query embedding
     ↓
Retrieve auction embeddings
     ↓
Calculate cosine similarity
     ↓
Rank results
     ↓
Apply similarity threshold
     ↓
Return similar auctions
```

- A default similarity threshold of `0.5` is used to remove results with low semantic similarity.
- The embedding is stored in MongoDB because it is required for similarity calculations. However, the embedding is removed from the API response before results are returned to the client.

### Search Mode Selection

The frontend or API client selects the search strategy using the `mode` query parameter.

- **Keyword:** `GET /auctions/search?keyword=Toyota&mode=keyword`
- **AI:** `GET /auctions/search?keyword=reliable%20ute%20for%20work&mode=ai`

If `mode` is not provided, keyword search is used by default. This allows the existing keyword functionality to remain available while providing an experimental AI search option.

---

## Testing

Run the complete automated test suite:

```bash
npm test
```

The tests cover:

- MongoDB connection
- Database seeding
- Database clearing
- CLI commands
- Auction creation
- Keyword search
- Semantic search
- Embedding generation
- Cosine similarity
- Similarity ranking
- Similarity threshold filtering

**Current test result:**

```text
5 test suites passed
24 tests passed
```

---

## Project Notes

- The AI semantic search is an experimental enhancement for Task 6.
- The required auction search functionality can be implemented using traditional keyword-based MongoDB search. Azure OpenAI was added to investigate how semantic search can improve the relevance of auction results.
- The current semantic-search implementation retrieves auction embeddings and calculates similarity in the application layer.
- For large datasets, this approach requires the application to process many embeddings. A future enhancement will investigate **MongoDB Vector Search** to move nearest-neighbour searching into MongoDB and improve performance and scalability.
