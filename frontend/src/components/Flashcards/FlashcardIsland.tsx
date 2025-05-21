import React, { useState } from "react";
import { motion } from "framer-motion";

export type Flashcard = {
  cardId: string;
  prompt: string;
  answer: string;
  status: "learned" | "new" | "in-progress";
};

interface FlashcardIslandProps {
  flashcards: Flashcard[];
}

export default function FlashcardIsland({ flashcards: initial }: FlashcardIslandProps) {
  const [cards, setCards] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const topic = prompt("Generate flashcards for topic:");
      if (!topic) return;
      // Call backend function for Gemini AI
      const res = await fetch("/api/generateFlashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const { flashcards } = await res.json();
      setCards([...flashcards, ...cards]);
      setIdx(0);
    } catch (e) {
      setError("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  }

  function markLearned() {
    setCards(cs =>
      cs.map((c, i) =>
        i === idx ? { ...c, status: "learned" } : c
      )
    );
  }

  if (!cards.length)
    return (
      <div className="text-center text-gray-600">
        No flashcards yet.
        <button className="ml-4 underline" onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate with AI"}
        </button>
      </div>
    );

  const card = cards[idx];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`w-80 h-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col justify-center items-center cursor-pointer text-xl font-medium relative ${showAnswer ? "ring-4 ring-blue-300" : ""}`}
        tabIndex={0}
        aria-label={showAnswer ? "Show question" : "Show answer"}
        onClick={() => setShowAnswer(a => !a)}
        onKeyDown={e => (e.key === " " || e.key === "Enter") && setShowAnswer(a => !a)}
        role="button"
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {!showAnswer ? (
          <span>{card.prompt}</span>
        ) : (
          <span className="text-blue-700 dark:text-yellow-300">{card.answer}</span>
        )}
        <span className="absolute bottom-2 right-4 text-xs opacity-80">{`${idx + 1} / ${cards.length}`}</span>
      </motion.div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          aria-label="Previous flashcard"
        >Prev</button>
        <button
          onClick={() => setIdx(i => Math.min(cards.length - 1, i + 1))}
          disabled={idx === cards.length - 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          aria-label="Next flashcard"
        >Next</button>
        <button
          onClick={markLearned}
          className="px-4 py-2 bg-green-500 text-white rounded"
          aria-label="Mark as learned"
        >Mark Learned</button>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          aria-label="Generate AI flashcards"
        >
          {generating ? "Generating..." : "AI Flashcards"}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      <div className="mt-4">
        Status: <span className={card.status === "learned" ? "text-green-600" : "text-yellow-600"}>{card.status}</span>
      </div>
    </div>
  );
}