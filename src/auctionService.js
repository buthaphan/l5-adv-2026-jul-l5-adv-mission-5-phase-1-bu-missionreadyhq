import { Auction } from "../models/Auction.js";
import {
  buildAuctionEmbeddingText,
  generateEmbedding,
  calculateAuctionSimilarity,
  rankAuctionsBySimilarity,
  filterAuctionsBySimilarity,
} from "./aiService.js";

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

export const searchAuctionsBySimilarity = async (queryEmbedding) => {
  const auctions = await Auction.find({
    embedding: { $exists: true, $ne: [] },
  });

  const auctionsWithSimilarity = auctions.map((auction) => ({
    ...auction.toObject(),
    similarity: calculateAuctionSimilarity(queryEmbedding, auction),
  }));

  return rankAuctionsBySimilarity(auctionsWithSimilarity);
};

export const searchAuctionsBySemanticQuery = async (query, threshold = 0.5) => {
  const queryEmbedding = await generateEmbedding(query);
  const results = await searchAuctionsBySimilarity(queryEmbedding);

  return filterAuctionsBySimilarity(results, threshold);
};
