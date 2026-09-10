import { Auction } from "../models/Auction.js";
import { buildAuctionEmbeddingText, generateEmbedding } from "./aiService.js";

const mockAuctions = [
  {
    title: "2015 Toyota Corolla Hatchback",
    description:
      "1.8L automatic hatchback, 95,000 km, fresh WOF and registration, economical and reliable daily driver.",
    start_price: 5000,
    reserve_price: 8500,
  },
  {
    title: "2008 Toyota Hilux Ute",
    description:
      "Reliable second-hand Toyota Hilux ute, 2.5L diesel, manual transmission, suitable for work and everyday driving.",
    start_price: 7500,
    reserve_price: 10000,
  },
  {
    title: "1998 Mazda MX-5 Convertible",
    description:
      "Manual transmission, soft top in good condition, lightweight sports car and ideal weekend cruiser.",
    start_price: 3500,
    reserve_price: 6000,
  },
  {
    title: "2018 Ford Ranger XLT",
    description:
      "4WD double cab ute with 3.2L diesel engine, automatic transmission, tow bar and good service history.",
    start_price: 18000,
    reserve_price: 23000,
  },
  {
    title: "2020 Mazda CX-5 SUV",
    description:
      "Modern family SUV with 2.5L petrol engine, automatic transmission, reversing camera and low kilometres.",
    start_price: 16000,
    reserve_price: 21000,
  },
  {
    title: "2017 Honda Civic Sedan",
    description:
      "Reliable four-door sedan with 1.8L petrol engine, automatic transmission, economical fuel consumption and clean interior.",
    start_price: 7000,
    reserve_price: 11000,
  },
  {
    title: "Apple MacBook Pro 14-inch",
    description:
      "Apple laptop with M2 Pro processor, 16GB RAM and 512GB SSD, suitable for software development and professional work.",
    start_price: 1200,
    reserve_price: 1800,
  },
  {
    title: "Gaming Desktop PC",
    description:
      "High-performance gaming computer with dedicated graphics card, 32GB RAM, 1TB SSD and suitable for modern PC games.",
    start_price: 900,
    reserve_price: 1400,
  },
  {
    title: "iPhone 15 Pro",
    description:
      "Premium Apple smartphone with 256GB storage, high-quality camera system, excellent condition and unlocked for use on multiple networks.",
    start_price: 700,
    reserve_price: 1000,
  },
  {
    title: "Vintage Leather Jacket",
    description:
      "1980s genuine leather jacket, size L, excellent condition with classic styling and minimal signs of wear.",
    start_price: 50,
    reserve_price: 100,
  },
  {
    title: "Mountain Bike",
    description:
      "Hardtail mountain bike with aluminium frame, hydraulic disc brakes and 27.5-inch wheels, suitable for trails and recreational riding.",
    start_price: 300,
    reserve_price: 500,
  },
  {
    title: "Professional Cordless Drill Set",
    description:
      "18V cordless power drill with two batteries, charger and carrying case, suitable for construction, repairs and DIY projects.",
    start_price: 150,
    reserve_price: 250,
  },
];

export const seedAIData = async () => {
  const auctionsWithEmbeddings = [];

  for (const auction of mockAuctions) {
    const embeddingText = buildAuctionEmbeddingText(auction);
    const embedding = await generateEmbedding(embeddingText);

    auctionsWithEmbeddings.push({
      ...auction,
      embedding,
    });
  }

  await Auction.insertMany(auctionsWithEmbeddings);
};
