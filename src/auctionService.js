import { Auction } from "../models/Auction.js";
import { buildAuctionEmbeddingText, generateEmbedding } from "./aiService.js";

export const searchAuctions = async (keyword) => {
  return await Auction.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  });
};

export const createAuction = async (auctionData) => {
  const embeddingText = buildAuctionEmbeddingText(auctionData);

  const embedding = await generateEmbedding(embeddingText);

  return await Auction.create({
    ...auctionData,
    embedding,
  });
};
