import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

export const saveProgress = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new HttpsError("unauthenticated", "User must be logged in.");
  const { quizId, score, total, answers } = data;
  if (!quizId || typeof score !== "number" || typeof total !== "number" || !Array.isArray(answers))
    throw new HttpsError("invalid-argument", "Missing or invalid quiz progress fields.");

  const ref = db.collection("users").doc(context.auth.uid).collection("progress").doc(quizId);
  await ref.set({
    quizId,
    score,
    total,
    attempts: functions.firestore.FieldValue.increment(1),
    lastDate: Date.now(),
    answers,
  }, { merge: true });

  return { ok: true };
});