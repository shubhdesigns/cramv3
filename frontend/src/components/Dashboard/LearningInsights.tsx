import React from 'react';
import { motion } from 'framer-motion';
import { LearningInsight } from '../../services/dashboard';

interface LearningInsightsProps {
  insights: LearningInsight[] | null;
}

export function LearningInsights({ insights }: LearningInsightsProps) {
  if (!insights) return null;

  const getInsightIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'performance': '📈',
      'pattern': '🔍',
      'recommendation': '💡',
      'warning': '⚠️',
      'achievement': '🎯',
      'default': '📊'
    };
    return icons[type] || icons.default;
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'pattern':
        return 'bg-purple-100 dark:bg-purple-900';
      case 'recommendation':
        return 'bg-green-100 dark:bg-green-900';
      case 'warning':
        return 'bg-red-100 dark:bg-red-900';
      case 'achievement':
        return 'bg-yellow-100 dark:bg-yellow-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Learning Insights
      </h2>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg p-4 ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(insight.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {insight.description}
                </p>

                {insight.metrics && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(insight.metrics).map(([key, value]) => (
                      <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {key}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Recommendations:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {insight.recommendations.map((rec, recIndex) => (
                        <li key={recIndex}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.tags && insight.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {insight.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
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