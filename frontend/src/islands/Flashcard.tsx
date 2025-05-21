import React, { useState } from "react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  status?: "new" | "learned";
}

interface FlashcardProps {
  flashcards: Flashcard[];
  onMarkLearned?: (id: string) => void;
}

const FlashcardPlayer: React.FC<FlashcardProps> = ({ flashcards, onMarkLearned }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[idx];

  if (!card) return <div>No cards available.</div>;

  return (
    <div className="max-w-lg w-full mx-auto flex flex-col items-center">
      <div
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        className={`w-full p-8 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800 text-center text-2xl cursor-pointer select-none transition-transform duration-300 transform-gpu ${flipped ? "rotate-y-180" : ""}`}
        style={{ minHeight: 180 }}
        onClick={() => setFlipped(f => !f)}
        onKeyDown={e => {
          if (e.key === " " || e.key === "Enter") setFlipped(f => !f);
          if (e.key === "ArrowRight") setIdx(i => Math.min(i + 1, flashcards.length - 1)), setFlipped(false);
          if (e.key === "ArrowLeft") setIdx(i => Math.max(i - 1, 0)), setFlipped(false);
        }}
        aria-label={flipped ? "Show question" : "Show answer"}
      >
        {flipped ? card.answer : card.question}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          onClick={() => { setIdx(i => Math.max(i - 1, 0)); setFlipped(false); }}
          disabled={idx === 0}
        >Previous</button>
        <button
          className={`px-3 py-1 rounded ${card.status === "learned" ? "bg-green-500 text-white" : "bg-yellow-100 dark:bg-yellow-700 text-yellow-900"}`}
          onClick={() => { onMarkLearned?.(card.id); }}
        >{card.status === "learned" ? "Learned" : "Mark as Learned"}</button>
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white"
          onClick={() => { setIdx(i => Math.min(i + 1, flashcards.length - 1)); setFlipped(false); }}
          disabled={idx === flashcards.length - 1}
        >Next</button>
      </div>
      <div className="mt-2 text-xs">{idx + 1} / {flashcards.length}</div>
    </div>
  );
};

export default FlashcardPlayer;