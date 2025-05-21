import React from "react";
import { motion } from "framer-motion";

const cards = [
  {
    href: "/quiz",
    color: "bg-blue-50 dark:bg-blue-900",
    title: "Take a Quiz",
    desc: "Practice with AI-generated quizzes for any subject."
  },
  {
    href: "/flashcards",
    color: "bg-green-50 dark:bg-green-900",
    title: "Review Flashcards",
    desc: "Study with smart flashcards and track your progress."
  },
  {
    href: "/study-plan",
    color: "bg-yellow-50 dark:bg-yellow-900",
    title: "Study Plan",
    desc: "Get a personalized study plan based on your goals."
  },
  {
    href: "/tutor",
    color: "bg-purple-50 dark:bg-purple-900",
    title: "Chat Tutor",
    desc: "Ask questions and get instant help from the AI tutor."
  }
];

export default function DashboardCardsIsland() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {cards.map((card, i) => (
        <motion.a
          key={card.href}
          href={card.href}
          className={`block p-6 rounded-lg shadow hover:shadow-lg transition ${card.color}`}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
          <p>{card.desc}</p>
        </motion.a>
      ))}
    </div>
  );
} 