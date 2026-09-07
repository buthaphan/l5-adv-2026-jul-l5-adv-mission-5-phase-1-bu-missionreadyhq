import mongoose from "mongoose";
import { Auction } from "../models/Auction.js";
import { clearData } from "../src/seeder.js";

const TEST_MONGO_URI = "mongodb://localhost:27017/trademe_test_db";

describe("Task 5: CLI Seeder Tool - clearData()", () => {
  beforeAll(async () => {
    await mongoose.connect(TEST_MONGO_URI);
  });

  afterAll(async () => {
    await Auction.deleteMany({});
    await mongoose.connection.close();
  });

  test("clearData() should remove all documents from the auctions collection", async () => {
    // Arrange: Create a temporary document directly in MongoDB
    await Auction.create({
      title: "Temp Item",
      description: "To be deleted",
      start_price: 10,
      reserve_price: 20,
    });

    // Act: Call clearData()
    await clearData();

    // Assert: Verify database is empty
    const count = await Auction.countDocuments();
    expect(count).toBe(0);
  });
});
