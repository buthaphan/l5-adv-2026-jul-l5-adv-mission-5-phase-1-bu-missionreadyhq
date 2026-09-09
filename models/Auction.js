import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_price: { type: Number, required: true },
  reserve_price: { type: Number, required: true },
  embedding: { type: [Number], default: [] },
});

export const Auction = mongoose.model("Auction", auctionSchema);
