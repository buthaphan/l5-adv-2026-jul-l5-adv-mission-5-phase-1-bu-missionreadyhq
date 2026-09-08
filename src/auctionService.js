import { Auction } from "../models/Auction.js";

export const searchAuctions = async (keyword) => {
  return await Auction.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  });
};
