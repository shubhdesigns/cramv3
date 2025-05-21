import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Unit } from '../types';
import { getUnitsByCourse } from '../services/study';
import { motion } from 'framer-motion';

export function UnitsPage() {
  const { subjectId, courseId } = useParams<{ subjectId: string; courseId: string }>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is missing.');
      setLoading(false);
      return;
    }

    const fetchUnits = async () => {
      try {
        const data = await getUnitsByCourse(courseId);
        setUnits(data);
      } catch (err) {
        console.error('Error fetching units:', err);
        setError('Failed to load units.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading units...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;
  }

  // Optional: Display course name
  const courseName = courseId ? courseId.replace(/-/g, ' ').toUpperCase() : 'Selected Course'; // Placeholder

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Units for {courseName}</h1>
      <div className="space-y-4">
        {units.map((unit) => (
          <motion.div
            key={unit.id}
            whileHover={{ x: 5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer"
          >
            <Link to={`/study/${subjectId}/courses/${courseId}/units/${unit.id}/materials`}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {unit.name}
              </h2>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 