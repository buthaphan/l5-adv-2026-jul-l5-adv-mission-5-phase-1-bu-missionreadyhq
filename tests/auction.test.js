import "dotenv/config";
import request from "supertest";

import { Auction } from "../models/Auction.js";
import { searchAuctions, createAuction } from "../src/auctionService.js";
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
});
