import { Flashcard, FlashcardStats, FlashcardFormData } from '../types';
import { apiClient } from './api';

export async function getFlashcards(): Promise<Flashcard[]> {
  return apiClient.get<Flashcard[]>('/flashcards');
}

export async function createFlashcard(flashcard: FlashcardFormData): Promise<Flashcard> {
  const result = await apiClient.post<Flashcard>('/flashcards', flashcard);
  apiClient.clearCacheForEndpoint('/flashcards');
  return result;
}

export async function updateFlashcard(id: number, flashcard: Partial<FlashcardFormData>): Promise<Flashcard> {
  const result = await apiClient.put<Flashcard>(`/flashcards/${id}`, flashcard);
  apiClient.clearCacheForEndpoint('/flashcards');
  return result;
}

export async function deleteFlashcard(id: number): Promise<void> {
  await apiClient.delete(`/flashcards/${id}`);
  apiClient.clearCacheForEndpoint('/flashcards');
}

export async function getFlashcardStats(): Promise<FlashcardStats> {
  return apiClient.get<FlashcardStats>('/flashcards/stats');
}

export async function searchFlashcards(query: string): Promise<Flashcard[]> {
  return apiClient.get<Flashcard[]>(`/flashcards/search?q=${encodeURIComponent(query)}`);
}

export async function getFlashcardsByCategory(category: string): Promise<Flashcard[]> {
  return apiClient.get<Flashcard[]>(`/flashcards/category/${encodeURIComponent(category)}`);
}

export async function getFlashcardsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Flashcard[]> {
  return apiClient.get<Flashcard[]>(`/flashcards/difficulty/${difficulty}`);
}

export async function updateFlashcardReview(id: number, success: boolean): Promise<Flashcard> {
  const result = await apiClient.post<Flashcard>(`/flashcards/${id}/review`, { success });
  apiClient.clearCacheForEndpoint('/flashcards');
  return result;
}

export async function getFlashcardsByTags(tags: string[]): Promise<Flashcard[]> {
  return apiClient.get<Flashcard[]>(`/flashcards/tags?tags=${encodeURIComponent(tags.join(','))}`);
}

export async function getFlashcardsDueForReview(): Promise<Flashcard[]> {
  return apiClient.get<Flashcard[]>('/flashcards/due');
}

export async function getFlashcardHistory(id: number): Promise<{
  reviews: Array<{
    date: string;
    success: boolean;
    timeSpent: number;
  }>;
}> {
  return apiClient.get(`/flashcards/${id}/history`);
}

export async function bulkCreateFlashcards(flashcards: FlashcardFormData[]): Promise<Flashcard[]> {
  const result = await apiClient.post<Flashcard[]>('/flashcards/bulk', { flashcards });
  apiClient.clearCacheForEndpoint('/flashcards');
  return result;
}

export async function bulkUpdateFlashcards(updates: Array<{
  id: number;
  changes: Partial<FlashcardFormData>;
}>): Promise<Flashcard[]> {
  const result = await apiClient.put<Flashcard[]>('/flashcards/bulk', { updates });
  apiClient.clearCacheForEndpoint('/flashcards');
  return result;
}

export async function bulkDeleteFlashcards(ids: number[]): Promise<void> {
  await apiClient.delete(`/flashcards/bulk?ids=${ids.join(',')}`);
  apiClient.clearCacheForEndpoint('/flashcards');
} 