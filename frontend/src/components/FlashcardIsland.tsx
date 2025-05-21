import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "./UI/Button";
import { motion, AnimatePresence } from "framer-motion";

function getSubjectFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("subject");
}

export default function FlashcardIsland({ subjectId: propSubjectId }: { subjectId?: string }) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(propSubjectId || getSubjectFromUrl());
  const [cards, setCards] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubjects() {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      setSubjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    if (!propSubjectId) fetchSubjects();
  }, [propSubjectId]);

  async function loadCards() {
    if (!selectedSubject) return;
    setLoading(true);
    const q = query(collection(db, "flashcards"), where("subjectId", "==", selectedSubject));
    const querySnapshot = await getDocs(q);
    setCards(querySnapshot.docs.map(doc => doc.data()));
    setCurrent(0);
    setFlipped(false);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedSubject) loadCards();
    // eslint-disable-next-line
  }, [selectedSubject]);

  if (!selectedSubject && !propSubjectId) {
    return (
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Subject</label>
        <select
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
          value={selectedSubject || ""}
          onChange={e => setSelectedSubject(e.target.value)}
        >
          <option value="">-- Choose a subject --</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.icon ? `${s.icon} ` : ""}{s.name}</option>
          ))}
        </select>
      </div>
    );
  }

  if (loading) return <p>Loading flashcards...</p>;
  if (cards.length === 0) return <p>No flashcards found for this subject.</p>;

  function handleFlip() {
    setFlipped(f => !f);
  }

  function handlePrev() {
    setFlipped(false);
    setCurrent((current - 1 + cards.length) % cards.length);
  }

  function handleNext() {
    setFlipped(false);
    setCurrent((current + 1) % cards.length);
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-80 h-48 mb-4" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current + '-' + flipped}
            className="absolute w-full h-full"
            initial={{ rotateY: flipped ? 180 : 0, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: flipped ? 180 : 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
            style={{ transformStyle: "preserve-3d" }}
            onClick={handleFlip}
          >
            <div className={`w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold cursor-pointer select-none ${flipped ? "rotate-y-180" : ""}`}
              style={{ backfaceVisibility: "hidden", position: "absolute", width: "100%", height: "100%" }}
            >
              {flipped ? cards[current].answer : cards[current].prompt}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-4">
        <Button onClick={handlePrev}>Prev</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
} 