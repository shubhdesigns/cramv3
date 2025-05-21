import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "./UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastIsland";

function getSubjectFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("subject");
}

export default function QuizIsland({ subjectId: propSubjectId }: { subjectId?: string }) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(propSubjectId || getSubjectFromUrl());
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<null | "correct" | "incorrect">(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchSubjects() {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      setSubjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    if (!propSubjectId) fetchSubjects();
  }, [propSubjectId]);

  async function loadQuiz() {
    if (!selectedSubject) {
      showToast("Please select a subject.", "error");
      return;
    }
    setLoading(true);
    try {
      const q = query(collection(db, "questions"), where("subjectId", "==", selectedSubject));
      const querySnapshot = await getDocs(q);
      setQuestions(querySnapshot.docs.map(doc => doc.data()));
      if (querySnapshot.empty) showToast("No quiz questions found for this subject.", "error");
    } catch (err) {
      showToast("Failed to load quiz questions.", "error");
    }
    setLoading(false);
  }

  function answerQuestion(idx: number) {
    const isCorrect = questions[current].answer === idx;
    setFeedback(isCorrect ? "correct" : "incorrect");
    setTimeout(() => {
      setAnswers([...answers, idx]);
      setFeedback(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        let s = 0;
        const allAnswers = [...answers, idx];
        allAnswers.forEach((a, i) => {
          if (questions[i].answer === a) s++;
        });
        setScore(s);
        showToast(`Quiz complete! Score: ${s} / ${questions.length}`, "success");
      }
    }, 700);
  }

  return (
    <div className="p-4">
      {!propSubjectId && (
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
      )}
      <Button onClick={loadQuiz} disabled={loading || questions.length > 0}>
        {loading ? "Loading..." : "Start Quiz"}
      </Button>
      <AnimatePresence>
        {score !== null ? (
          <motion.div
            key="score"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-lg"
            >
              Score: {score} / {questions.length}
            </motion.p>
            <Button onClick={() => { setScore(null); setAnswers([]); setCurrent(0); }}>Retry</Button>
          </motion.div>
        ) : questions.length > 0 && (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold mb-2">{questions[current].text}</h3>
            <div className="space-y-2">
              {questions[current].choices.map((choice: string, idx: number) => (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={() => answerQuestion(idx)}
                    className={`w-full ${feedback && idx === questions[current].answer && feedback === "correct" ? "bg-green-500 text-white" : ""} ${feedback && idx !== questions[current].answer && idx === answers[answers.length - 1] && feedback === "incorrect" ? "bg-red-500 text-white" : ""}`}
                    disabled={!!feedback}
                  >
                    {choice}
                  </Button>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-4 text-lg font-bold ${feedback === "correct" ? "text-green-600" : "text-red-600"}`}
                >
                  {feedback === "correct" ? "Correct! 🎉" : "Incorrect!"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 