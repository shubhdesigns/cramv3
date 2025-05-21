import React from 'react';
import { DashboardStats } from '../../services/dashboard';
import { motion } from 'framer-motion';

interface StatsOverviewProps {
  stats: DashboardStats | null;
}

const StatCard = ({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-lg ${color} text-white`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </motion.div>
);

export function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Flashcards"
          value={stats.totalFlashcards}
          icon="📚"
          color="bg-blue-600"
        />
        <StatCard
          title="Cards Due Today"
          value={stats.cardsDueToday}
          icon="⏰"
          color="bg-yellow-600"
        />
        <StatCard
          title="Cards Reviewed Today"
          value={stats.cardsReviewedToday}
          icon="✅"
          color="bg-green-600"
        />
        <StatCard
          title="Average Accuracy"
          value={`${(stats.averageAccuracy * 100).toFixed(1)}%`}
          icon="🎯"
          color="bg-purple-600"
        />
      </div>

      {/* Streak and Last Review */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.streakDays} days
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Last Review</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {new Date(stats.lastReviewDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Recent Activity
        </h3>
        <div className="space-y-2">
          {stats.recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-xl">
                {activity.type === 'review' && '✅'}
                {activity.type === 'create' && '➕'}
                {activity.type === 'update' && '✏️'}
                {activity.type === 'delete' && '🗑️'}
              </span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 