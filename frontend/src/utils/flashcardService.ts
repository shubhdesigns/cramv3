import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Flashcard } from "../components/Flashcards/FlashcardIsland";

const MOCK_FLASHCARDS: Flashcard[] = [
  {
    cardId: "c1",
    prompt: "What is the powerhouse of the cell?",
    answer: "The mitochondria.",
    status: "new",
  },
  {
    cardId: "c2",
    prompt: "What is the capital of France?",
    answer: "Paris",
    status: "in-progress",
  },
];

export async function getUserFlashcards(uid?: string): Promise<Flashcard[]> {
  if (!uid) {
    // Demo: return mock until Firebase Auth live
    return MOCK_FLASHCARDS;
  }
  // Real: fetch from `/users/{uid}/flashcards`
  const snapshot = await getDocs(collection(db, "users", uid, "flashcards"));
  return snapshot.docs.map(doc => ({ cardId: doc.id, ...doc.data() } as Flashcard));
}

export async function addUserFlashcard(flashcard: Omit<Flashcard, "cardId">, uid?: string) {
  if (!uid) return; // Extend: throw or log error if needed
  await addDoc(collection(db, "users", uid, "flashcards"), flashcard);
}