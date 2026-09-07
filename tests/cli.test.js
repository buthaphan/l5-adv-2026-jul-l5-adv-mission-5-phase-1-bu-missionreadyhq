import "dotenv/config";
import mongoose from "mongoose";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { Auction } from "../models/Auction.js";

const execFileAsync = promisify(execFile);

const TEST_MONGO_URI = process.env.TEST_MONGO_URI;

describe("CLI seeder", () => {
  beforeAll(async () => {
    await mongoose.connect(TEST_MONGO_URI);
  });

  afterEach(async () => {
    await Auction.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should seed auction data when --seed is provided", async () => {
    await execFileAsync("node", ["cli.js", "--seed"], {
      env: {
        ...process.env,
        MONGO_URI: TEST_MONGO_URI,
      },
    });

    const auctions = await Auction.find({});

    expect(auctions.length).toBeGreaterThan(0);
  });

  test("should clear auction data when --clear is provided", async () => {
    await Auction.create({
      title: "Temporary Auction",
      description: "This item should be deleted",
      start_price: 10,
      reserve_price: 20,
    });

    await execFileAsync("node", ["cli.js", "--clear"], {
      env: {
        ...process.env,
        MONGO_URI: TEST_MONGO_URI,
      },
    });

    const auctions = await Auction.find({});

    expect(auctions.length).toBe(0);
  });
});
