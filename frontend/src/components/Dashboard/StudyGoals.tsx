import React from 'react';
import { motion } from 'framer-motion';
import { StudyGoal } from '../../services/dashboard';

interface StudyGoalsProps {
  goals: StudyGoal[] | null;
}

export function StudyGoals({ goals }: StudyGoalsProps) {
  if (!goals) return null;

  const getGoalIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'daily': '📅',
      'weekly': '📆',
      'monthly': '📊',
      'category': '📚',
      'streak': '🔥',
      'default': '🎯'
    };
    return icons[type] || icons.default;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Study Goals
      </h2>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">
                {getGoalIcon(goal.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {goal.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {goal.description}
                </p>

                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Target: </span>
                    <span className="text-gray-900 dark:text-white">{goal.target}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Current: </span>
                    <span className="text-gray-900 dark:text-white">{goal.current}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Start Date: </span>
                    <span className="text-gray-900 dark:text-white">{formatDate(goal.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">End Date: </span>
                    <span className="text-gray-900 dark:text-white">{formatDate(goal.endDate)}</span>
                  </div>
                </div>

                {goal.completed && (
                  <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                    Completed on {formatDate(goal.completedAt!)}
                  </div>
                )}

                {goal.reward && (
                  <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                    Reward: {goal.reward}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 