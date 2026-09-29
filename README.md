# TradeMe Auction Search API

A Node.js backend for an auction application using **MongoDB and Mongoose** for data persistence, with a REST API supporting both keyword and AI-powered semantic search.

The project demonstrates a progression from a conventional MongoDB search implementation to an experimental semantic-search capability using **Azure OpenAI embeddings**.

## What This Project Demonstrates

- Node.js and Express backend development
- MongoDB database integration
- Mongoose data modelling and persistence
- Structured auction seed data
- Database lifecycle tooling for seeding and clearing data
- CLI-based database operations
- Automated testing with Jest and Supertest
- MongoDB integration testing with a dedicated test database
- REST API design
- Keyword-based search
- AI semantic search using embeddings
- Cosine similarity calculation and result ranking
- Similarity threshold filtering
- Separation of database, service, API, and AI responsibilities

## Architecture

The core application follows a simple backend separation:

```text
HTTP Request
     │
     ▼
Express API
     │
     ▼
Auction Service
     │
     ▼
Mongoose Model
     │
     ▼
MongoDB
```

Semantic search extends the auction service with an embedding workflow:

```text
Search Query
     │
     ▼
Azure OpenAI
     │
     ▼
Query Embedding
     │
     ▼
Stored Auction Embeddings
     │
     ▼
Cosine Similarity
     │
     ▼
Rank Results
     │
     ▼
Apply Similarity Threshold
     │
     ▼
Return Results
```

## Data Model

Auction records are represented using a Mongoose schema with the following fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `title` | String | Auction title |
| `description` | String | Auction description |
| `start_price` | Number | Starting auction price |
| `reserve_price` | Number | Reserve price |
| `embedding` | Number[] | Vector representation used for semantic search |

The embedding field allows the same auction model to support both conventional auction data and AI-powered search.

## Seed Data and Database Lifecycle

The project includes structured sample auction data and command-line tools for managing the database.

Standard seed data includes examples from several auction categories, including clothing, vehicles, and property.

### Seed standard auction data

```bash
npm run seed
```

This inserts the standard sample auction records into MongoDB.

### Seed AI-enabled auction data

```bash
npm run seedAI
```

The AI seeding process:

1. Creates auction records.
2. Builds text from the auction title and description.
3. Generates an embedding using Azure OpenAI.
4. Stores the auction together with its embedding in MongoDB.

### Clear auction data

```bash
npm run clear
```

This removes the auction documents from the database.

The CLI provides the underlying commands directly:

```bash
node cli.js --seed
node cli.js --seedAI
node cli.js --clear
```

## Search API

The application exposes a search endpoint:

```http
GET /auctions/search
```

A keyword is required.

### Keyword search

```http
GET /auctions/search?keyword=leather
```

Keyword search checks both the auction title and description using a case-insensitive MongoDB regular-expression query.

### Semantic search

```http
GET /auctions/search?keyword=reliable%20ute%20for%20work&mode=ai
```

When `mode=ai` is selected:

1. The search query is converted into an embedding.
2. Auctions containing stored embeddings are retrieved.
3. Cosine similarity is calculated between the query and each auction.
4. Results are ranked by similarity.
5. Results below the similarity threshold are filtered out.

The default semantic similarity threshold is `0.5`.

If no search mode is supplied, the API uses keyword search.

## Testing

The project uses **Jest and Supertest** with a dedicated MongoDB test database.

The test suite covers:

- MongoDB connectivity
- Auction data persistence
- Database seeding and clearing
- CLI commands
- API search behaviour
- Mongoose model behaviour
- Semantic-search ranking and filtering
- Embedding generation and storage

The project follows a **TDD-oriented development approach**, using automated tests to drive and validate backend functionality.

The GitHub Actions workflow also runs the automated test suite against a MongoDB service container.

## AI Semantic Search

The semantic-search capability was added as an extension to the conventional keyword-search implementation.

The AI service is responsible for:

- Generating embeddings with Azure OpenAI
- Building embedding text from auction data
- Calculating cosine similarity
- Ranking auction results
- Applying similarity thresholds

Embeddings are stored with the auction documents in MongoDB but are removed from API responses before results are returned.

The current implementation calculates similarity in the application layer. For larger datasets, a future direction would be to investigate MongoDB Vector Search so nearest-neighbour searching can be handled closer to the database.

## Technology Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript ES Modules

### Testing

- Jest
- Supertest
- MongoDB integration testing
- TDD-oriented development

### AI

- Azure OpenAI
- OpenAI Node.js SDK
- Text embeddings
- Cosine similarity

### Tooling

- npm
- dotenv
- GitHub Actions

## Project Structure

```text
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

## Configuration

Create a local environment file from the example:

```bash
cp .env.example .env
```

Configure the MongoDB connection and, when using semantic search, the Azure OpenAI settings.

Example:

```env
MONGO_URI=mongodb://localhost:27017/trademe
TEST_MONGO_URI=mongodb://localhost:27017/trademe_test_db

AZURE_OPENAI_ENDPOINT=your_openai_endpoint
AZURE_OPENAI_API_KEY=your_openai_key
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

Do not commit `.env` files or real credentials to source control.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The server runs on port `3000` by default.

Run the automated tests:

```bash
npm test
```

MongoDB must be available for the application and integration tests.

## CI

The repository includes a GitHub Actions workflow that:

- starts a MongoDB service container
- sets up Node.js
- installs dependencies with `npm ci`
- runs the Jest test suite

The workflow also supplies the Azure OpenAI configuration required by the semantic-search tests through GitHub Actions secrets.

## Project Status

This project demonstrates the development of a backend application from conventional database-backed search through to an AI-enhanced semantic-search capability.

The implementation is intentionally focused on demonstrating backend engineering fundamentals—**MongoDB, Mongoose, data seeding, API design, automated testing, and service separation**—while exploring how embeddings can extend a traditional search experience.

## Author

**Banphot Uthaphan**

AI-Powered Full Stack Developer
