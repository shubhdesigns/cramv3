import React from 'react';
import { motion } from 'framer-motion';
import { StudySession } from '../../services/dashboard';

interface StudySessionsProps {
  sessions: StudySession[] | null;
}

export function StudySessions({ sessions }: StudySessionsProps) {
  if (!sessions) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSessionColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Study Sessions
      </h2>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📚</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {session.category}
                </h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(session.startTime).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDuration(session.duration)}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">Cards Reviewed</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {session.cardsReviewed}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
                <div className={`text-lg font-semibold ${getSessionColor(session.accuracy)}`}>
                  {session.accuracy}%
                </div>
              </div>

              <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">Focus Score</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {session.focusScore}/10
                </div>
              </div>
            </div>

            {session.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Notes:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {session.notes}
                </p>
              </div>
            )}

            {session.areasForImprovement && session.areasForImprovement.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Areas for Improvement:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {session.areasForImprovement.map((area, areaIndex) => (
                    <li key={areaIndex}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 