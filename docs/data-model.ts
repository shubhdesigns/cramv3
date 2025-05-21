/**
 * Cramtime Firestore Data Model
 * --------------------------------------
 * Typed interfaces for every collection & document.
 * Use these for backend validation (Cloud Functions), frontend type safety, and
 * to guide security rules.
 */

/** ========== PUBLIC CONTENT ========== */

// Master list of supported subjects
export interface Subject {
  subjectId: string; // Firestore document ID
  name: string;
  examType: 'AP' | 'SAT' | 'ACT' | string;
  iconUrl?: string;
  description?: string;
}

// Each subject contains topic "units"
export interface Unit {
  unitId: string;
  title: string;
  description?: string;
  order: number;
}

// A pool of questions (MCQ or FRQ) for quizzes/exams
export type QuestionType = 'MCQ' | 'FRQ';
export interface Question {
  questionId: string;
  subjectId: string;
  unitId?: string; // Optional: linked topic/unit
  type: QuestionType;
  text: string;
  choices?: string[];      // For MCQ
  answer: string | string[]; // FRQ: acceptable answers
  explanation?: string;
  createdBy?: string;
  createdAt?: Date;
}

// Flashcards (public or user-generated)
export interface Flashcard {
  cardId: string;
  subjectId: string;
  prompt: string;
  answer: string;
  createdBy?: string;
  createdAt?: Date;
}

// A quiz combines multiple questions (by ID)
export interface Quiz {
  quizId: string;
  subjectId: string;
  title: string;
  questionIds: string[];
  createdBy: string;
  createdAt: Date;
}

// Past exam uploads or references
export interface PastExam {
  examId: string;
  subjectId: string;
  year: number;
  fileUrl: string;
  solutionUrl?: string;
  createdAt: Date;
}

/* ======== USERS (PRIVATE DATA) ========== */

// Firestore /users/{uid}
export type UserRole = 'student' | 'coach' | 'admin' | string;
export interface UserProfile {
  uid: string;           // Same as Firestore doc ID
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  photoUrl?: string;
  darkMode?: boolean;
  preferences?: Record<string, unknown>;
}

// Firestore /users/{uid}/progress/{quizId}
export interface QuizProgress {
  quizId: string;
  score: number;
  attempts: number;
  lastDate: Date;
  answers: UserAnswer[]; // See below
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  correct: boolean;
  submittedAt: Date;
}

// Firestore /users/{uid}/flashcards/{cardId}
export interface UserFlashcard {
  cardId: string;
  prompt: string;
  answer: string;
  status: 'learned' | 'new' | 'in-progress';
  createdAt: Date;
}

// Firestore /users/{uid}/sessions/{sessionId}
/** A tutor chat session record */
export interface ChatSession {
  sessionId: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
}
export interface ChatMessage {
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// Firestore /users/{uid}/schedules/{scheduleId}
/** User event (study slot, booked call, etc) */
export interface ScheduleItem {
  scheduleId: string;
  eventType: string;      // E.g. 'study', 'tutoring', ...
  timeSlot: string;       // ISO timestamp
  externalEventLink?: string; // (e.g. Calendly/Cal.com url)
}

// Firestore /schedules/{scheduleId}
export interface GlobalScheduleEvent {
  scheduleId: string;
  userId: string;
  eventType: string;
  timeSlot: string;
  calendarId?: string;
  externalEventLink?: string;
}

/** Firestore /sessions/{sessionId} (global - for analytics) */
export interface TutorSession {
  sessionId: string;
  userId: string;
  tutorQuery: string;
  chatHistory: ChatMessage[];
  timestamp: Date;
}

/* ========== UTILITY TYPES ========== */

/** Optional wrapper for Firestore Timestamps if not using Date objects:
import { Timestamp } from "firebase/firestore";
type FirestoreTimestamp = Timestamp;
*/

// Add/extend types as new features/collections are added!