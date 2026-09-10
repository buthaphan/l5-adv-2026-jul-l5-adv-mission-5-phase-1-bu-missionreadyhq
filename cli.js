import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./src/db.js";
import { seedData, clearData } from "./src/seeder.js";
import { seedAIData } from "./src/seederAI.js";

const flag = process.argv[2];

const run = async () => {
  try {
    if (flag === "--seed") {
      console.log("Starting database seeding process...");

      await connectDB(process.env.MONGO_URI);
      await seedData();

      console.log("Database seeding completed.");
    } else if (flag === "--clear") {
      console.log("Starting database clearing process...");

      await connectDB(process.env.MONGO_URI);
      await clearData();

      console.log("Database clearing completed.");
    } else if (flag === "--seedAI") {
      console.log("Starting AI database seeding process...");

      await connectDB(process.env.MONGO_URI);
      await seedAIData();

      console.log("AI database seeding completed.");
    } else {
      console.log("Usage: node cli.js --seed OR --clear OR --seedAI");
    }
  } finally {
    await mongoose.connection.close();
  }
};

run().catch((error) => {
  console.error("CLI error:", error.message);
  process.exit(1);
});
