import "dotenv/config";
import request from "supertest";

import { Auction } from "../models/Auction.js";
import {
  searchAuctionsBySimilarity,
  createAuction,
  searchAuctionsBySemanticQuery,
} from "../src/auctionService.js";

import {
  generateEmbedding,
  filterAuctionsBySimilarity,
} from "../src/aiService.js";

import { app } from "../src/app.js";
import mongoose from "mongoose";

const TEST_MONGO_URI = process.env.TEST_MONGO_URI;

describe("Get /auction/search", () => {
  beforeAll(async () => {
    await mongoose.connect(TEST_MONGO_URI);
  });

  afterEach(async () => {
    await Auction.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should return auctions matching the keyword", async () => {
    await Auction.create([
      {
        title: "Vintage Leather Jacket",
        description: "1980s genuine leather jacket.",
        start_price: 50,
        reserve_price: 100,
      },
      {
        title: "Modern Wool Coat",
        description: "Black wool coat in excellent condition.",
        start_price: 80,
        reserve_price: 150,
      },
    ]);

    const response = await request(app)
      .get("/auctions/search")
      .query({ keyword: "leather" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Vintage Leather Jacket");
  });

  test("should return 400 when keyword is missing", async () => {
    const response = await request(app).get("/auctions/search");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Keyword is required");
  });

  test("should return an empty array when no actions match the keyword", async () => {
    const response = await request(app)
      .get("/auctions/search")
      .query({ keyword: "banana" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should match keywords regardless of letter case", async () => {
    await Auction.create({
      title: "Vintage Leather Jacket",
      description: "1980s genuine leather jacket.",
      start_price: 50,
      reserve_price: 100,
    });

    const response = await request(app)
      .get("/auctions/search")
      .query({ keyword: "LEATHER" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Vintage Leather Jacket");
  });

  test("should store an embedding on an auction", async () => {
    const auction = await Auction.create({
      title: "Vintage Leather Jacket",
      description: "1980s genuine leather jacket.",
      start_price: 50,
      reserve_price: 100,
      embedding: [0.1, 0.2, 0.3],
    });

    expect(auction.embedding).toEqual([0.1, 0.2, 0.3]);
  });

  test("should create an auction with an embedding", async () => {
    const auction = await createAuction({
      title: "Vintage Leather Jacket",
      description: "1980s genuine leather jacket.",
      start_price: 50,
      reserve_price: 100,
    });

    expect(auction.embedding).toBeDefined();
    expect(Array.isArray(auction.embedding)).toBe(true);
    expect(auction.embedding.length).toBeGreaterThan(0);
  });

  test("should return auctions ranked by semantic similarity", async () => {
    await Auction.create([
      {
        title: "Vintage Leather Jacket",
        description: "1980s genuine leather jacket.",
        start_price: 50,
        reserve_price: 100,
        embedding: [1, 0],
      },
      {
        title: "Modern Wool Coat",
        description: "Black wool coat in excellent condition.",
        start_price: 80,
        reserve_price: 150,
        embedding: [0, 1],
      },
    ]);

    const queryEmbedding = [1, 0];

    const results = await searchAuctionsBySimilarity(queryEmbedding);

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("Vintage Leather Jacket");
    expect(results[0].similarity).toBe(1);
  });

  test("should search auctions using a semantic query", async () => {
    const leatherJacketEmbedding = await generateEmbedding(
      "Vintage Leather Jacket. 1980s genuine leather jacket.",
    );

    const woolCoatEmbedding = await generateEmbedding(
      "Modern Wool Coat. Black wool coat in excellent condition.",
    );

    await Auction.create([
      {
        title: "Vintage Leather Jacket",
        description: "1980s genuine leather jacket.",
        start_price: 50,
        reserve_price: 100,
        embedding: leatherJacketEmbedding,
      },
      {
        title: "Modern Wool Coat",
        description: "Black wool coat in excellent condition.",
        start_price: 80,
        reserve_price: 150,
        embedding: woolCoatEmbedding,
      },
    ]);

    const results = await searchAuctionsBySemanticQuery(
      "second hand leather jacket",
      0,
    );

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("Vintage Leather Jacket");
  });

  test("should exclude auctions below the similarity threshold", async () => {
    const results = [
      {
        title: "Vintage Leather Jacket",
        similarity: 0.75,
      },
      {
        title: "Modern Wool Coat",
        similarity: 0.35,
      },
    ];

    const filteredResults = filterAuctionsBySimilarity(results, 0.5);

    expect(filteredResults).toHaveLength(1);
    expect(filteredResults[0].title).toBe("Vintage Leather Jacket");
  });

  test("should only return semantically relevant auctions", async () => {
    const leatherJacketEmbedding = await generateEmbedding(
      "Vintage Leather Jacket. 1980s genuine leather jacket.",
    );

    const woolCoatEmbedding = await generateEmbedding(
      "Modern Wool Coat. Black wool coat in excellent condition.",
    );

    await Auction.create([
      {
        title: "Vintage Leather Jacket",
        description: "1980s genuine leather jacket.",
        start_price: 50,
        reserve_price: 100,
        embedding: leatherJacketEmbedding,
      },
      {
        title: "Modern Wool Coat",
        description: "Black wool coat in excellent condition.",
        start_price: 80,
        reserve_price: 150,
        embedding: woolCoatEmbedding,
      },
    ]);

    const results = await searchAuctionsBySemanticQuery(
      "second hand leather jacket",
      0.5,
    );

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Vintage Leather Jacket");
  });
});
