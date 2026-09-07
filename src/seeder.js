import { Auction } from "../models/Auction.js";

export const clearData = async () => {
  await Auction.deleteMany({});
};

export const seedData = async () => {
  // Reserved for Cycle 2
};
