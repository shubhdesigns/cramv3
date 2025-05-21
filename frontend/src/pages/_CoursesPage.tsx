import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Course } from '../types';
import { getCoursesBySubject } from '../services/study';
import { motion } from 'framer-motion';

export function CoursesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) {
      setError('Subject ID is missing.');
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        const data = await getCoursesBySubject(subjectId);
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [subjectId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading courses...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;
  }

  // Optional: Find the subject name to display
  // This would require fetching subjects or passing the subject name via state/params
  const subjectName = subjectId ? subjectId.replace(/-/g, ' ').toUpperCase() : 'Selected Subject'; // Placeholder

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Courses for {subjectName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={`/study/${subjectId}/courses/${course.id}/units`}>
              <div className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {course.name}
                </h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 