import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { subjectsIndex, flashcardsIndex, quizzesIndex } from "./utils/algolia";

interface AlgoliaSyncResult {
  subjects: number;
  flashcards: number;
  quizzes: number;
  errors: string[];
}

/**
 * Bulk syncs all existing Firestore data to Algolia indices.
 * Admin only function to populate indices after initial setup.
 */
export const bulkSyncAlgolia = functions.https.onCall(
  async (data, context): Promise<AlgoliaSyncResult> => {
    // Require admin privileges
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can perform bulk sync operations."
      );
    }

    const db = admin.firestore();
    const result: AlgoliaSyncResult = {
      subjects: 0,
      flashcards: 0,
      quizzes: 0,
      errors: [],
    };

    try {
      // Sync subjects
      const subjectsSnapshot = await db.collection("subjects").get();
      const subjects = subjectsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        objectID: doc.id,
      }));

      if (subjects.length > 0) {
        await subjectsIndex.saveObjects(subjects);
        result.subjects = subjects.length;
      }

      // Sync flashcards - iterate through users
      const usersSnapshot = await db.collection("users").get();
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const flashcardsSnapshot = await db
          .collection(`users/${userId}/flashcards`)
          .get();

        const flashcards = flashcardsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          objectID: doc.id,
          uid: userId,
        }));

        if (flashcards.length > 0) {
          await flashcardsIndex.saveObjects(flashcards);
          result.flashcards += flashcards.length;
        }
      }

      // Sync quizzes - iterate through users
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const quizzesSnapshot = await db
          .collection(`users/${userId}/quizzes`)
          .get();

        const quizzes = quizzesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          objectID: doc.id,
          uid: userId,
        }));

        if (quizzes.length > 0) {
          await quizzesIndex.saveObjects(quizzes);
          result.quizzes += quizzes.length;
        }
      }
    } catch (error: any) {
      result.errors.push(error.message);
    }

    return result;
  }
); 
import * as admin from "firebase-admin";
import { subjectsIndex, flashcardsIndex, quizzesIndex } from "./utils/algolia";

interface AlgoliaSyncResult {
  subjects: number;
  flashcards: number;
  quizzes: number;
  errors: string[];
}

/**
 * Bulk syncs all existing Firestore data to Algolia indices.
 * Admin only function to populate indices after initial setup.
 */
export const bulkSyncAlgolia = functions.https.onCall(
  async (data, context): Promise<AlgoliaSyncResult> => {
    // Require admin privileges
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can perform bulk sync operations."
      );
    }

    const db = admin.firestore();
    const result: AlgoliaSyncResult = {
      subjects: 0,
      flashcards: 0,
      quizzes: 0,
      errors: [],
    };

    try {
      // Sync subjects
      const subjectsSnapshot = await db.collection("subjects").get();
      const subjects = subjectsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        objectID: doc.id,
      }));

      if (subjects.length > 0) {
        await subjectsIndex.saveObjects(subjects);
        result.subjects = subjects.length;
      }

      // Sync flashcards - iterate through users
      const usersSnapshot = await db.collection("users").get();
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const flashcardsSnapshot = await db
          .collection(`users/${userId}/flashcards`)
          .get();

        const flashcards = flashcardsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          objectID: doc.id,
          uid: userId,
        }));

        if (flashcards.length > 0) {
          await flashcardsIndex.saveObjects(flashcards);
          result.flashcards += flashcards.length;
        }
      }

      // Sync quizzes - iterate through users
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const quizzesSnapshot = await db
          .collection(`users/${userId}/quizzes`)
          .get();

        const quizzes = quizzesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          objectID: doc.id,
          uid: userId,
        }));

        if (quizzes.length > 0) {
          await quizzesIndex.saveObjects(quizzes);
          result.quizzes += quizzes.length;
        }
      }
    } catch (error: any) {
      result.errors.push(error.message);
    }

    return result;
  }
); 