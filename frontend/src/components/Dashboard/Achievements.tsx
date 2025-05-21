import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../services/dashboard';

interface AchievementsProps {
  achievements: Achievement[] | null;
}

export function Achievements({ achievements }: AchievementsProps) {
  if (!achievements) return null;

  const getAchievementIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'streak': '🔥',
      'mastery': '🎯',
      'review': '📚',
      'category': '🏆',
      'special': '⭐',
      'default': '🏅'
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 ${
              achievement.unlocked ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-3xl">
                {getAchievementIcon(achievement.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {achievement.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {achievement.description}
                </p>
                {achievement.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(achievement.progress)}`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {achievement.unlocked && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Unlocked on {new Date(achievement.unlockedAt!).toLocaleDateString()}
                  </div>
                )}
                {achievement.reward && (
                  <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                    Reward: {achievement.reward}
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