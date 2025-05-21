import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Quizzes & Flashcards",
    desc: "Generate unlimited practice with AI. Track your progress and master every topic."
  },
  {
    title: "Personalized Study Plans",
    desc: "Get a custom plan based on your goals, schedule, and exam date."
  },
  {
    title: "Chat Tutor",
    desc: "Ask questions and get instant help from our AI-powered tutor, 24/7."
  }
];

export default function FeaturesIsland() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 + i * 0.2 }}
          whileHover={{ scale: 1.04 }}
        >
          <h2 className="text-2xl font-bold mb-2">{f.title}</h2>
          <p>{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
} 