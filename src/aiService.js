import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/v1/`,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
});

export const generateEmbedding = async (text) => {
  const response = await client.embeddings.create({
    model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
    input: text,
  });

  return response.data[0].embedding;
};

export const buildAuctionEmbeddingText = (auction) => {
  return `${auction.title}. ${auction.description || ""}`.trim();
};

export const calculateCosineSimilarity = (vectorA, vectorB) => {
  const dotProduct = vectorA.reduce(
    (sum, value, index) => sum + value * vectorB[index],
    0,
  );

  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, value) => sum + value * value, 0),
  );

  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, value) => sum + value * value, 0),
  );

  return dotProduct / (magnitudeA * magnitudeB);
};
