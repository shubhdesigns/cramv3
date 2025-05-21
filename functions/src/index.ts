/**
 * Cramtime Cloud Functions Backend Scaffold (TypeScript)
 * Includes:
 * - Gemini (Vertex AI) utility wrapper
 * - AI-powered function examples: generateFlashcards, generateQuiz
 * - Firestore trigger example (user onboarding)
 * - All exporting via index.ts, ready for npm run deploy
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch"; // For Gemini/Vertex AI HTTP calls
import { subjectsIndex, flashcardsIndex, quizzesIndex } from './utils/algolia';

admin.initializeApp();

/* =========== Gemini/Vertex AI API Utility ============= */
/**
 * Use this utility for Gemini API interactions.
 * In production, use secret manager/API key env variables.
 */
const GEMINI_API_URL = "https://vertex.googleapis.com/v1/models/gemini-pro:generateContent";
const GEMINI_PROJECT = process.env.GEMINI_PROJECT || ""; // GCP project ID, set in .env or runtime
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; // Secure this!
const REGION = "us-central1"; // Adjust as needed

/**
 * Call Gemini (Vertex AI) for generative tasks.
 */
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");
  const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${GEMINI_PROJECT}/locations/${REGION}/publishers/google/models/gemini-pro:streamGenerateContent`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Gemini API call failed: ${response.statusText}`);
  }
  const data = await response.json();
  // Adjust parsing to match Gemini's current return type
  return data.candidates?.[0]?.content || data.choices?.[0]?.message?.content || JSON.stringify(data);
}

/* ========== Cloud Functions: Generative AI ========== */

/**
 * Generate flashcards given a topic (invoked from frontend)
 * Input: { topic: string }
 * Output: { flashcards: {question, answer}[] }
 */
export const generateFlashcards = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { topic } = data;
  if (!topic) throw new functions.https.HttpsError("invalid-argument", "Missing topic");
  const prompt = `Create 5 concise Q&A flashcards (as JSON array) for ${topic}.`;
  const aiResponse = await callGemini(prompt);

  // Attempt to parse AI response into JSON (handle both plain text and JSON)
  let flashcards;
  try {
    flashcards = JSON.parse(aiResponse);
  } catch (err) {
    // fallback: naïvely split lines (if fail)
    flashcards = aiResponse.split('\n').map(str => ({ question: str, answer: '' }));
  }

  return { flashcards };
});

/**
 * Generate a quiz (MCQ or FRQ) for a subject/unit
 * Input: { subject: string, type: "MCQ" | "FRQ" }
 * Output: { questions: Question[] }
 */
export const generateQuiz = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { subject, type = "MCQ" } = data;
  if (!subject) throw new functions.https.HttpsError("invalid-argument", "Missing subject");

  const prompt = type === "MCQ"
    ? `Write 5 multiple-choice questions for the subject "${subject}", with 4 choices each, and indicate the correct answer as "answer". Return as JSON array [{text:"", choices:[], answer:""}].`
    : `Write 3 free-response questions (FRQ) for "${subject}" with sample answers. Return as JSON array [{text:"", answer:""}].`;

  const aiResponse = await callGemini(prompt);

  let questions;
  try {
    questions = JSON.parse(aiResponse);
  } catch (err) {
    questions = [{ text: aiResponse, choices: [], answer: "" }];
  }

  return { questions };
});

/* ========== Firestore Trigger Example ========== */

/**
 * On new user signup, initialize a default study dashboard
 */
export const onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;

    // Example: add a welcome dashboard field, or auto-enroll user in getting started unit
    await snap.ref.set(
      {
        onboardingComplete: false,
        dashboard: { nextAction: "start-first-quiz" },
      },
      { merge: true }
    );
    // Could send a welcome email here or write an analytics log.
  });

/* ========== Other Function Stubs (ready for expansion) ========== */

// export const scoreEssay = functions.https.onCall(...);
// export const tutorChat = functions.https.onCall(...);
// export const scheduleSession = functions.https.onCall(...);

/**
 * All functions are exported for Firebase deploy.
 * Add more handlers in src/ as needed; import and export here.
 */

// Subject sync
export const syncSubjectToAlgolia = functions.firestore.document('subjects/{id}').onWrite(async (change, context) => {
  const id = context.params.id;
  if (!change.after.exists) {
    await subjectsIndex.deleteObject(id);
    return;
  }
  const data = change.after.data();
  await subjectsIndex.saveObject({ ...data, objectID: id });
});

export const deleteSubjectFromAlgolia = functions.firestore.document('subjects/{id}').onDelete(async (snap, context) => {
  const id = context.params.id;
  await subjectsIndex.deleteObject(id);
});

// Flashcard sync
export const syncFlashcardToAlgolia = functions.firestore.document('users/{uid}/flashcards/{id}').onWrite(async (change, context) => {
  const id = context.params.id;
  const uid = context.params.uid;
  if (!change.after.exists) {
    await flashcardsIndex.deleteObject(id);
    return;
  }
  const data = change.after.data();
  await flashcardsIndex.saveObject({ ...data, objectID: id, uid });
});

export const deleteFlashcardFromAlgolia = functions.firestore.document('users/{uid}/flashcards/{id}').onDelete(async (snap, context) => {
  const id = context.params.id;
  await flashcardsIndex.deleteObject(id);
});

// Quiz sync
export const syncQuizToAlgolia = functions.firestore.document('users/{uid}/quizzes/{id}').onWrite(async (change, context) => {
  const id = context.params.id;
  const uid = context.params.uid;
  if (!change.after.exists) {
    await quizzesIndex.deleteObject(id);
    return;
  }
  const data = change.after.data();
  await quizzesIndex.saveObject({ ...data, objectID: id, uid });
});

export const deleteQuizFromAlgolia = functions.firestore.document('users/{uid}/quizzes/{id}').onDelete(async (snap, context) => {
  const id = context.params.id;
  await quizzesIndex.deleteObject(id);
});
 */

// Subject sync
export const syncSubjectToAlgolia = functions.firestore.document('subjects/{id}').onWrite(async (change, context) => {
  const id = context.params.id;
  if (!change.after.exists) {
    await subjectsIndex.deleteObject(id);
    return;
  }
  const data = change.after.data();
  await subjectsIndex.saveObject({ ...data, objectID: id });
});

export const deleteSubjectFromAlgolia = functions.firestore.document('subjects/{id}').onDelete(async (snap, context) => {
  const id = context.params.id;
  await subjectsIndex.deleteObject(id);
});

// Flashcard sync
export const syncFlashcardToAlgolia = functions.firestore.document('users/{uid}/flashcards/{id}').onWrite(async (change, context) => {
  const id = context.params.id;
  const uid = context.params.uid;
  if (!change.after.exists) {
    await flashcardsIndex.deleteObject(id);
    return;
  }
  const data = change.after.data();
  await flashcardsIndex.saveObject({ ...data, objectID: id, uid });
});

export const deleteFlashcardFromAlgolia = functions.firestore.document('users/{uid}/flashcards/{id}').onDelete(async (snap, context) => {
  const id = context.params.id;
  await flashcardsIndex.deleteObject(id);
});

// Quiz sync
export const syncQuizToAlgolia = functions.firestore.document('users/{uid}/quizzes/{id}').onWrite(async (change, context) => {
  const id = context.params.id;
  const uid = context.params.uid;
  if (!change.after.exists) {
    await quizzesIndex.deleteObject(id);
    return;
  }
  const data = change.after.data();
  await quizzesIndex.saveObject({ ...data, objectID: id, uid });
});

export const deleteQuizFromAlgolia = functions.firestore.document('users/{uid}/quizzes/{id}').onDelete(async (snap, context) => {
  const id = context.params.id;
  await quizzesIndex.deleteObject(id);
});