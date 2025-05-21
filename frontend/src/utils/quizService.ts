import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

// Type mirrors Quiz from data-model
export type Quiz = {
  quizId: string;
  title: string;
  questions: {
    questionId: string;
    text: string;
    choices: string[];
    answer: string;
  }[];
};

// Demo/mock: fallback quiz content
const MOCK_QUIZZES: Record<string, Quiz> = {
  "demo123": {
    quizId: "demo123",
    title: "Math Fundamentals",
    questions: [
      {
        questionId: "q1",
        text: "What is 3 x 3?",
        choices: ["6", "7", "8", "9"],
        answer: "9"
      },
      {
        questionId: "q2",
        text: "5 squared equals?",
        choices: ["10", "15", "25", "20"],
        answer: "25"
      },
    ],
  },
};

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  // Try Firestore first (futureproof)
  try {
    const ref = doc(db, "quizzes", quizId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as Quiz;
    }
  } catch (e) {
    // fail silently, attempt mock
  }
  // Fallback to mock
  return MOCK_QUIZZES[quizId] || null;
}