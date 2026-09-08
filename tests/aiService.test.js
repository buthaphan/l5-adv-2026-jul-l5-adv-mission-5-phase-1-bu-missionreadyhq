import {
  generateEmbedding,
  buildAuctionEmbeddingText,
  calculateCosineSimilarity,
} from "../src/aiService.js";

describe("Azure OpenAI embedding service", () => {
  test("generateEmbedding() should return an embedding vector", async () => {
    const embedding = await generateEmbedding("second hand vehicle");

    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
  });

  test("should build embedding text from an auction", () => {
    const auction = {
      title: "Vintage Leather Jacket",
      description: "1980s genuine leather jacket.",
    };

    const text = buildAuctionEmbeddingText(auction);

    expect(text).toBe("Vintage Leather Jacket. 1980s genuine leather jacket.");
  });

  test("should build embedding text when an auction has no description", () => {
    const auction = {
      title: "Vintage Leather Jacket",
    };

    const text = buildAuctionEmbeddingText(auction);

    expect(text).toBe("Vintage Leather Jacket.");
  });

  test("should generate an embedding for an auction", async () => {
    const auction = {
      title: "Vintage Leather Jacket",
      description: "1980s genuine leather jacket.",
    };

    const embedding = await generateEmbedding(
      buildAuctionEmbeddingText(auction),
    );

    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
  });

  test("should calculate cosine similarity between two vectors", () => {
    const vectorA = [1, 0];
    const vectorB = [1, 0];

    const similarity = calculateCosineSimilarity(vectorA, vectorB);

    expect(similarity).toBe(1);
  });

  test("should return zero for perpendicular vectors", () => {
    const vectorA = [1, 0];
    const vectorB = [0, 1];

    const similarity = calculateCosineSimilarity(vectorA, vectorB);

    expect(similarity).toBe(0);
  });
});
