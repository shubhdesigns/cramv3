import React from 'react';
import { LearningProgress } from '../../services/dashboard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

interface ProgressChartsProps {
  progress: LearningProgress | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ProgressCharts({ progress }: ProgressChartsProps) {
  if (!progress) return null;

  const dailyData = progress.dailyProgress.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString()
  }));

  const categoryData = progress.categoryProgress.map(cat => ({
    name: cat.category,
    value: cat.mastered + cat.learning + cat.notStarted
  }));

  const difficultyData = [
    { name: 'Easy', value: progress.difficultyProgress.easy },
    { name: 'Medium', value: progress.difficultyProgress.medium },
    { name: 'Hard', value: progress.difficultyProgress.hard }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Learning Progress
      </h2>

      <div className="space-y-8">
        {/* Daily Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-80"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Daily Progress
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cardsReviewed"
                stroke="#8884d8"
                name="Cards Reviewed"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#82ca9d"
                name="Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-64"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Difficulty Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-64"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Difficulty Distribution
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Category Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Category Progress
          </h3>
          <div className="space-y-4">
            {progress.categoryProgress.map((cat, index) => (
              <div key={cat.category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {cat.category}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {((cat.mastered / (cat.mastered + cat.learning + cat.notStarted)) * 100).toFixed(1)}% Mastered
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(cat.mastered / (cat.mastered + cat.learning + cat.notStarted)) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Mastered: {cat.mastered}</span>
                  <span>Learning: {cat.learning}</span>
                  <span>Not Started: {cat.notStarted}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 