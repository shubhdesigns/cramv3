import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios"; // for HTTP Gemini API calls
import { callGeminiAPI } from "./utils/gemini";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// Example Gemini API endpoint and API key (replace with real config)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = functions.config().gemini.key; // Set via Firebase CLI

export const generateQuiz = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new HttpsError("unauthenticated", "Login required");
  const { topic } = data;
  if (!topic) throw new HttpsError("invalid-argument", "Missing 'topic'");
  const prompt = `Generate 5 AP-style quiz questions for ${topic}.`;
  const questions = await callGeminiAPI(prompt);
  return { questions };
});