import { apiClient } from './api';
import { FlashcardStats } from '../types';

export interface DashboardStats {
  totalFlashcards: number;
  cardsDueToday: number;
  cardsReviewedToday: number;
  averageAccuracy: number;
  streakDays: number;
  lastReviewDate: string;
  categories: Array<{
    name: string;
    count: number;
    accuracy: number;
  }>;
  recentActivity: Array<{
    type: 'review' | 'create' | 'update' | 'delete';
    timestamp: string;
    details: string;
  }>;
}

export interface LearningProgress {
  dailyProgress: Array<{
    date: string;
    cardsReviewed: number;
    accuracy: number;
  }>;
  categoryProgress: Array<{
    category: string;
    mastered: number;
    learning: number;
    notStarted: number;
  }>;
  difficultyProgress: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface StudySession {
  id: string;
  category: string;
  startTime: string;
  duration: number;
  cardsReviewed: number;
  accuracy: number;
  focusScore: number;
  notes?: string;
  areasForImprovement?: string[];
}

export interface StudyRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  dueCards: number;
  masteryLevel: number;
  lastReviewDate: string;
  suggestedActions?: string[];
  recommendedCategories?: string[];
  suggestedStudyTime?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  progress?: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: string;
  name?: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  type: string;
  target: number;
  current: number;
  progress: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  completedAt?: string;
  reward?: string;
  metric?: 'cards' | 'minutes' | 'accuracy';
  deadline?: string;
}

export interface LearningInsight {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  metrics?: { [key: string]: string | number };
  recommendations?: string[];
  tags?: string[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>('/dashboard/stats');
}

export async function getLearningProgress(): Promise<LearningProgress> {
  return apiClient.get<LearningProgress>('/dashboard/progress');
}

export async function getStudySessions(limit: number = 10): Promise<StudySession[]> {
  return apiClient.get<StudySession[]>(`/dashboard/sessions?limit=${limit}`);
}

export async function startStudySession(categories?: string[]): Promise<StudySession> {
  return apiClient.post<StudySession>('/dashboard/sessions/start', { categories });
}

export async function endStudySession(sessionId: string): Promise<StudySession> {
  return apiClient.post<StudySession>(`/dashboard/sessions/${sessionId}/end`, {});
}

export async function getStudyRecommendations(): Promise<StudyRecommendation[]> {
  interface RecommendationsResponse {
  recommendedCategories: string[];
  dueCards: number;
  suggestedStudyTime: number;
  }
  
  const response = await apiClient.get<RecommendationsResponse>('/dashboard/recommendations');
  // Transform the API response to match the StudyRecommendation[] type
  return [{
    category: 'General',
    priority: 'high',
    reason: 'Based on due cards',
    dueCards: response.dueCards,
    masteryLevel: 0,
    lastReviewDate: new Date().toISOString(),
    recommendedCategories: response.recommendedCategories,
    suggestedStudyTime: response.suggestedStudyTime
  }];
}

export async function getAchievements(): Promise<Achievement[]> {
  interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  progress: number;
  }
  
  const achievementsData = await apiClient.get<AchievementResponse[]>('/dashboard/achievements');
  // Transform the API response to match Achievement[] type
  return achievementsData.map((item) => ({
    id: item.id,
    title: item.name || '',
    description: item.description,
    type: 'achievement',
    progress: item.progress,
    unlocked: !!item.unlockedAt,
    unlockedAt: item.unlockedAt,
    name: item.name
  }));
}

export async function getStudyGoals(): Promise<StudyGoal[]> {
  interface GoalResponse {
  id: string;
  target: number;
  current: number;
  type: 'daily' | 'weekly' | 'monthly';
  metric: 'cards' | 'minutes' | 'accuracy';
  deadline?: string;
  }
  
  const goalsData = await apiClient.get<GoalResponse[]>('/dashboard/goals');
  // Transform the API response to match StudyGoal[] type
  return goalsData.map((item) => ({
    id: item.id,
    title: `${item.type} ${item.metric} goal`,
    description: `Achieve ${item.target} ${item.metric} ${item.type}`,
    type: item.type,
    target: item.target,
    current: item.current,
    progress: (item.current / item.target) * 100,
    startDate: new Date().toISOString(),
    endDate: item.deadline || new Date().toISOString(),
    completed: item.current >= item.target,
    metric: item.metric,
    deadline: item.deadline
  }));
}

export async function updateStudyGoal(goalId: string, updates: {
  target?: number;
  deadline?: string;
}): Promise<void> {
  return apiClient.put(`/dashboard/goals/${goalId}`, updates);
}

export async function getStudyInsights(): Promise<{
  bestTimeToStudy: string;
  mostEffectiveCategories: string[];
  recommendedStudyDuration: number;
  learningPatterns: Array<{
    pattern: string;
    effectiveness: number;
  }>;
}> {
  return apiClient.get('/dashboard/insights');
}

export async function exportStudyData(): Promise<{
  flashcards: any[];
  studyHistory: any[];
  achievements: any[];
  goals: any[];
}> {
  return apiClient.get('/dashboard/export');
}

export async function importStudyData(data: {
  flashcards?: any[];
  studyHistory?: any[];
  achievements?: any[];
  goals?: any[];
}): Promise<void> {
  return apiClient.post('/dashboard/import', data);
}

export async function getLearningInsights(): Promise<LearningInsight[]> {
  return apiClient.get<LearningInsight[]>('/api/dashboard/insights');
} 