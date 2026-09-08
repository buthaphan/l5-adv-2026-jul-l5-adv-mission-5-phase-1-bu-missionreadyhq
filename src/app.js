import express from "express";
import { Auction } from "../models/Auction";

export const app = express();

app.use(express.json());

app.get("/auctions/search", async (req, res) => {
  const { keyword } = req.query;

  const auctions = await Auction.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  });

  res.status(200).json(auctions);
});
