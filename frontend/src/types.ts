export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin: string;
  preferences?: UserPreferences;
}

export interface Flashcard {
  id: number;
  userId: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastReviewed: string;
  createdAt: string;
  tags: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FlashcardStats {
  total: number;
  byDifficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  byCategory: {
    [key: string]: number;
  };
}

export interface ApiError {
  error: string;
  status?: number;
}

export type FlashcardFormData = Omit<Flashcard, 'id' | 'userId' | 'lastReviewed' | 'createdAt'>;

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultDifficulty: 'Easy' | 'Medium' | 'Hard';
  defaultCategory?: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  subjectId: string;
  name: string;
}

export interface Unit {
  id: string;
  courseId: string;
  name: string;
}

export interface BaseMaterial {
  id: string;
  unitId: string;
  name: string;
  type: string; // 'quiz', 'flashcards', 'video', etc.
}

export interface QuizMaterial extends BaseMaterial {
  type: 'quiz';
  questions: Array<{ question: string; answer: string }>; // Simplified for now
}

export interface FlashcardMaterial extends BaseMaterial {
  type: 'flashcards';
  cards: Array<{ front: string; back: string }>;
}

export interface VideoMaterial extends BaseMaterial {
  type: 'video';
  url: string;
}

export type Material = QuizMaterial | FlashcardMaterial | VideoMaterial; 