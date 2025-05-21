import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";
import { callGeminiAPI } from "./utils/gemini";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = functions.config().gemini.key; // Set via Firebase CLI

export const chatTutor = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new HttpsError("unauthenticated", "Login required");
  const { message, sessionId } = data;
  if (!message || !sessionId) throw new HttpsError("invalid-argument", "Missing message or sessionId");

  // Get conversation history
  const sessionRef = db.collection("sessions").doc(sessionId);
  const session = (await sessionRef.get()).data() || {};
  const history = session.messages || [];

  // Compose prompt with history + new user message
  const prompt = [
    ...history.map((m: any) => `${m.speaker}: ${m.text}`),
    `user: ${message}`
  ].join("\n");

  try {
    const geminiResp = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    const answer = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help!";
    const updatedMsg = [
      ...history,
      { speaker: "user", text: message },
      { speaker: "assistant", text: answer }
    ];
    await sessionRef.set({ userId: context.auth.uid, messages: updatedMsg, updatedAt: Date.now() }, { merge: true });
    return { reply: answer };
  } catch (err) {
    throw new HttpsError("internal", "Gemini chat failed", err instanceof Error ? err.message : undefined);
  }
});