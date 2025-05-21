import React from 'react';
import { motion } from 'framer-motion';
import { StudyRecommendation } from '../../services/dashboard';

interface StudyRecommendationsProps {
  recommendations: StudyRecommendation[] | null;
}

export function StudyRecommendations({ recommendations }: StudyRecommendationsProps) {
  if (!recommendations) return null;

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    // You can customize these icons based on your categories
    const icons: { [key: string]: string } = {
      'Math': '📐',
      'Science': '🔬',
      'History': '📚',
      'Language': '🌍',
      'Programming': '💻',
      'default': '📝'
    };
    return icons[category] || icons.default;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Study Recommendations
      </h2>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 text-2xl">
                {getCategoryIcon(rec.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {rec.category}
                  </h3>
                  <span className={`text-sm font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                  </span>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {rec.reason}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Due Cards: {rec.dueCards}</span>
                  <span>Mastery: {rec.masteryLevel}%</span>
                  <span>Last Review: {new Date(rec.lastReviewDate).toLocaleDateString()}</span>
                </div>
                {rec.suggestedActions && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Suggested Actions:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {rec.suggestedActions.map((action, actionIndex) => (
                        <li key={actionIndex}>{action}</li>
                      ))}
                    </ul>
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