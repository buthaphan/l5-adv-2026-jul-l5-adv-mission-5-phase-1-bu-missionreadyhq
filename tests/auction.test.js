import "dotenv/config";
import request from "supertest";

import { Auction } from "../models/Auction.js";
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
});
