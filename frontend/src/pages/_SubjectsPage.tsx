import React, { useEffect, useState } from 'react';
import { Subject } from '../types';
import { getSubjects } from '../services/study';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading subjects...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AP Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={`/study/${subject.id}/courses`}>
              <div className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {subject.name}
                </h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 