import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getDashboardStats,
  getLearningProgress,
  getStudySessions,
  getStudyRecommendations,
  getAchievements,
  getStudyGoals,
  getLearningInsights,
  DashboardStats,
  LearningProgress,
  StudySession,
  StudyRecommendation,
  Achievement,
  StudyGoal,
  LearningInsight
} from '../../services/dashboard';
import { StatsOverview } from './StatsOverview';
import { ProgressCharts } from './ProgressCharts';
import { StudyRecommendations } from './StudyRecommendations';
import { StudySessions } from './StudySessions';
import { Achievements } from './Achievements';
import { StudyGoals } from './StudyGoals';
import { LearningInsights } from './LearningInsights';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [sessions, setSessions] = useState<StudySession[] | null>(null);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [goals, setGoals] = useState<StudyGoal[] | null>(null);
  const [insights, setInsights] = useState<LearningInsight[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          statsData,
          progressData,
          sessionsData,
          recommendationsData,
          achievementsData,
          goalsData,
          insightsData
        ] = await Promise.all([
          getDashboardStats(),
          getLearningProgress(),
          getStudySessions(),
          getStudyRecommendations(),
          getAchievements(),
          getStudyGoals(),
          getLearningInsights()
        ]);

        setStats(statsData);
        setProgress(progressData);
        setSessions(sessionsData);
        setRecommendations(recommendationsData);
        setAchievements(achievementsData);
        setGoals(goalsData);
        setInsights(insightsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 gap-8">
        <StatsOverview stats={stats} />
        <ProgressCharts progress={progress} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StudyRecommendations recommendations={recommendations} />
          <StudySessions sessions={sessions} />
        </div>
        <Achievements achievements={achievements} />
        <StudyGoals goals={goals} />
        <LearningInsights insights={insights} />
      </div>
    </motion.div>
  );
} 