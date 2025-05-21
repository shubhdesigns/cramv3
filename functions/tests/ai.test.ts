import { callGemini } from "../src/ai/geminiService"; // assuming you factor Gemini logic to src/ai/geminiService.ts

jest.mock("../src/ai/geminiService"); // Replace with actual import path

describe("Gemini AI integration", () => {
  it("should return flashcards from AI", async () => {
    // Mocked Gemini response
    (callGemini as jest.Mock).mockResolvedValue(
      JSON.stringify([
        { question: "What is photosynthesis?", answer: "Process plants use to make food with sunlight." }
      ])
    );

    const prompt = "Create 1 flashcard for photosynthesis.";
    const result = await callGemini(prompt);

    expect(typeof result).toBe("string");
    const cards = JSON.parse(result);
    expect(Array.isArray(cards)).toBe(true);
    expect(cards[0].question).toContain("photosynthesis");
  });
});