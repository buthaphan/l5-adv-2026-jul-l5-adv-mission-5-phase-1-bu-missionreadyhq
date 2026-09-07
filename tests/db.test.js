import mongoose from "mongoose";
import { connectDB } from "../src/db.js";

const TEST_MONGO_URI =
  process.env.TEST_MONGO_URI || "mongodb://localhost:27017/trademe_test_db";

describe("TradeMe database connection", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("connectDB should connect to MongoDB", async () => {
    await connectDB(TEST_MONGO_URI);

    expect(mongoose.connection.readyState).toBe(1);
  });
});
