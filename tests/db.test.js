import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/db.js";

const TEST_MONGO_URI = process.env.TEST_MONGO_URI;

describe("Database connection", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("connectDB() should connect to MongoDB", async () => {
    await connectDB(TEST_MONGO_URI);

    expect(mongoose.connection.readyState).toBe(1);
  });
});
