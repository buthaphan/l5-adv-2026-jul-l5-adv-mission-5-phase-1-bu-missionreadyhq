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
