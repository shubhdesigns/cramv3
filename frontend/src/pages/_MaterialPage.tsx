import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Material, QuizMaterial, FlashcardMaterial, VideoMaterial } from '../types';
import { getMaterialById } from '../services/study';
import { motion } from 'framer-motion';

// Placeholder components for different material types
const QuizViewer: React.FC<{ material: QuizMaterial }> = ({ material }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quiz: {material.name}</h2>
    <p>Quiz content goes here...</p>
    {/* Render quiz questions and interaction */}
  </div>
);

const FlashcardViewer: React.FC<{ material: FlashcardMaterial }> = ({ material }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Flashcards: {material.name}</h2>
    <p>Flashcard content goes here...</p>
    {/* Render flashcard interaction */}
  </div>
);

const VideoPlayer: React.FC<{ material: VideoMaterial }> = ({ material }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Video: {material.name}</h2>
    <p>Video player goes here...</p>
    <p>URL: {material.url}</p>
    {/* Embed video player */}
  </div>
);

const UnknownMaterial: React.FC<{ material: Material }> = ({ material }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-red-500">
    <h2 className="text-2xl font-semibold mb-4">Unknown Material Type: {material.name}</h2>
    <p>Cannot render material of type: {material.type}</p>
  </div>
);

export function MaterialPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!materialId) {
      setError('Material ID is missing.');
      setLoading(false);
      return;
    }

    const fetchMaterial = async () => {
      try {
        const data = await getMaterialById(materialId);
        setMaterial(data);
      } catch (err) {
        console.error('Error fetching material:', err);
        setError('Failed to load material.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading material...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;
  }

  if (!material) {
    return <div className="flex justify-center items-center h-screen text-xl">Material not found.</div>;
  }

  // Render the appropriate component based on material type
  let MaterialComponent;
  switch (material.type) {
    case 'quiz':
      MaterialComponent = <QuizViewer material={material as QuizMaterial} />;
      break;
    case 'flashcards':
      MaterialComponent = <FlashcardViewer material={material as FlashcardMaterial} />;
      break;
    case 'video':
      MaterialComponent = <VideoPlayer material={material as VideoMaterial} />;
      break;
    default:
      MaterialComponent = <UnknownMaterial material={material} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {MaterialComponent}
    </motion.div>
  );
} 