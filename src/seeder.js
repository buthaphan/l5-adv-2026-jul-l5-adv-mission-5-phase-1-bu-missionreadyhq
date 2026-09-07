import { Auction } from "../models/Auction.js";

const mockAuctions = [
  {
    title: "Vintage Leather Jacket",
    description: "1980s genuine leather jacket, size L, excellent condition.",
    start_price: 50,
    reserve_price: 100,
  },
  {
    title: "Designer Wool Overcoat",
    description: "Black tailored wool overcoat, unworn with tags attached.",
    start_price: 120,
    reserve_price: 200,
  },

  {
    title: "2015 Toyota Corolla Hatchback",
    description: "1.8L Automatic, 95,000 km, fresh WOF and registration.",
    start_price: 5000,
    reserve_price: 8500,
  },
  {
    title: "1998 Mazda MX-5 Convertible",
    description:
      "Manual transmission, soft top in good condition, ideal weekend cruiser.",
    start_price: 3500,
    reserve_price: 6000,
  },

  {
    title: "3-Bedroom Suburban House in Auckland",
    description:
      "Freehold title, 500 sqm section, fully renovated kitchen and bathroom.",
    start_price: 650000,
    reserve_price: 850000,
  },
  {
    title: "Modern 2-Bedroom City Apartment",
    description:
      "Central location, open plan living, private balcony, and secure parking space.",
    start_price: 400000,
    reserve_price: 520000,
  },
];

export const clearData = async () => {
  await Auction.deleteMany({});
};

export const seedData = async () => {
  await Auction.insertMany(mockAuctions);
};
