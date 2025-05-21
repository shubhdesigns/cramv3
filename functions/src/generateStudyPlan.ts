import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = functions.config().gemini.key; // Set via Firebase CLI

export const generateStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new HttpsError("unauthenticated", "Login required");
  const { examDate, subjects, hoursPerDay } = data;
  if (!examDate || !Array.isArray(subjects) || !hoursPerDay)
    throw new HttpsError("invalid-argument", "Missing required fields: examDate, subjects, hoursPerDay.");
  // Gemini prompt can be as elaborate as needed:
  const prompt = `Create a day-by-day personalized study plan for a student preparing for these subjects: ${subjects.join(", ")}. The exam is on ${examDate}. The student can study about ${hoursPerDay} hours per day. Output as JSON array by date, subject, and topic.`;
  try {
    const geminiResp = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    const planText = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let plan: any[] = [];
    try { plan = JSON.parse(planText); } catch { plan = [{ note: "AI plan formatting error" }]; }
    // Optionally save to Firestore for user
    await db.collection("users").doc(context.auth.uid).collection("plans").add({
      generatedAt: Date.now(),
      examDate,
      subjects,
      hoursPerDay,
      plan,
    });
    return { plan };
  } catch (err) {
    throw new HttpsError("internal", "Study plan generation failed", err instanceof Error ? err.message : undefined);
  }
});