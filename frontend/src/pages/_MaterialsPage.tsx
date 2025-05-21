import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Material } from '../types';
import { getMaterialsByUnit } from '../services/study';
import { motion } from 'framer-motion';

export function MaterialsPage() {
  const { subjectId, courseId, unitId } = useParams<{ subjectId: string; courseId: string; unitId: string }>();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) {
      setError('Unit ID is missing.');
      setLoading(false);
      return;
    }

    const fetchMaterials = async () => {
      try {
        const data = await getMaterialsByUnit(unitId);
        setMaterials(data);
      } catch (err) {
        console.error('Error fetching materials:', err);
        setError('Failed to load materials.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [unitId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading materials...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;
  }

  // Optional: Display unit name
  const unitName = unitId ? unitId.replace(/-/g, ' ').toUpperCase() : 'Selected Unit'; // Placeholder

  const getMaterialIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'quiz': '📝',
      'flashcards': '🧠',
      'video': '🎥',
      'mock-exam': ' exámenes',
      'ap-testing': '💯',
      'default': '📖'
    };
    return icons[type] || icons.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Materials for {unitName}</h1>
      <div className="space-y-4">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            whileHover={{ x: 5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer"
          >
            <Link to={`/study/${subjectId}/courses/${courseId}/units/${unitId}/materials/${material.id}`}>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{getMaterialIcon(material.type)}</span>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {material.name}
                </h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 