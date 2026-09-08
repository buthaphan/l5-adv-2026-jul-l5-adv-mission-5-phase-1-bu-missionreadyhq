import { generateEmbedding } from "../src/aiService.js";

describe("Azure OpenAI embedding service", () => {
  test("generateEmbedding() should return an embedding vector", async () => {
    const embedding = await generateEmbedding("second hand vehicle");

    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
  });
});
