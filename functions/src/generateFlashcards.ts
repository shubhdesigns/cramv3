import * as functions from "firebase-functions";
import { callGeminiAPI } from "./utils/gemini";

export const generateFlashcards = functions.https.onCall(async (data, context) => {
  const { topic } = data;
  const prompt = `Create 5 concise flashcards (Q&A) for ${topic}.`;
  const flashcards = await callGeminiAPI(prompt);
  return { flashcards };
}); 