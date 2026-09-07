#!/usr/bin/env node

// Read the command line flag passed to the script (e.g., --seed or --clear)
const flag = process.argv[2];

if (flag === "--seed") {
  console.log("Starting database seeding process...");
} else if (flag === "--clear") {
  console.log("Starting database clearing process...");
} else {
  console.log("Usage: node cli.js --seed  OR  node cli.js --clear");
}
