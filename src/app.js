import express from "express";
import {
  searchAuctions,
  searchAuctionsBySemanticQuery,
} from "./auctionService.js";

export const app = express();

app.use(express.json());

app.get("/auctions/search", async (req, res) => {
  const { keyword, mode = "keyword" } = req.query;

  if (!keyword) {
    return res.status(400).json({
      error: "Keyword is required",
    });
  }

  let auctions;

  if (mode === "ai") {
    auctions = await searchAuctionsBySemanticQuery(keyword);
  } else {
    auctions = await searchAuctions(keyword);
  }

  res.status(200).json(auctions);
});
