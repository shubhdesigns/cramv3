import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase/init";
import { Button } from "../UI/Button";

interface Question {
  id: string;
  text: string;
  choices: string[];
  answer: string;
}

// Sample data for demo purposes when Firebase isn't available
const sampleQuestions: Question[] = [
  {
    id: "q1",
    text: "What is the powerhouse of the cell?",
    choices: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
    answer: "Mitochondria"
  },
  {
    id: "q2",
    text: "Which of the following is a primary function of photosynthesis?",
    choices: ["Cellular respiration", "Converting light energy to chemical energy", "Breaking down proteins", "Cell division"],
    answer: "Converting light energy to chemical energy"
  }
];

export default function QuizTakeIsland({ quizId }: { quizId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
      if (module) {
        fetchQuiz(module);
      }
    });
  }, [quizId]);

  const fetchQuiz = async (module: any) => {
    setLoading(true);
    setError(null);
    try {
      // Use sample data in case Firebase is not available
      setQuestions(sampleQuestions);
      
      // If Firebase is initialized, try to fetch real data
      if (module && module.db && module.firestore) {
        try {
          // Fetch quiz doc
          const quizDoc = await module.firestore.getDoc(
            module.firestore.doc(module.db, "quizzes", quizId)
          );
          const quizData = quizDoc.data();
          let questionIds = quizData?.questionIds || [];
          
          if (questionIds.length > 0) {
            // Fetch questions
            const qs: Question[] = [];
            for (const qid of questionIds) {
              const qDoc = await module.firestore.getDoc(
                module.firestore.doc(module.db, "questions", qid)
              );
              const qData = qDoc.data();
              if (qData) {
                qs.push({
                  id: qid,
                  text: qData.text,
                  choices: qData.choices,
                  answer: qData.answer,
                });
              }
            }
            if (qs.length > 0) {
              setQuestions(qs);
            }
          }
        } catch (err: any) {
          console.error("Error fetching from Firebase:", err);
          // Keep using sample data
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qid: string, choice: string) => {
    setAnswers(a => ({ ...a, [qid]: choice }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    // Save to Firestore if available
    try {
      if (firebaseModule && firebaseModule.auth && firebaseModule.db && firebaseModule.firestore) {
        const user = firebaseModule.auth.currentUser;
        if (user) {
          await firebaseModule.firestore.setDoc(
            firebaseModule.firestore.doc(firebaseModule.db, `users/${user.uid}/progress`, quizId),
            {
              score: correct,
              total: questions.length,
              lastDate: new Date().toISOString(),
              answers,
            }, 
            { merge: true }
          );
        }
      }
    } catch (err) {
      // Ignore save error for now
      console.error("Error saving progress:", err);
    }
  };

  if (loading) return <div className="text-center text-success-light dark:text-success-dark font-heading">Loading quiz...</div>;
  if (error) return <div className="text-center text-error-light dark:text-error-dark font-heading">{error}</div>;
  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="font-heading text-2xl text-success-light dark:text-success-dark mb-4">Quiz Complete!</h2>
        <p className="mb-2">Your score: <span className="font-bold">{score} / {questions.length}</span></p>
        <Button variant="accent1" onClick={() => window.location.href = "/quizzes"}>Back to Quizzes</Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      {questions.map(q => (
        <div key={q.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark p-6">
          <p className="font-heading text-lg mb-4">{q.text}</p>
          <div className="flex flex-col gap-2">
            {q.choices.map(choice => (
              <label key={choice} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  value={choice}
                  checked={answers[q.id] === choice}
                  onChange={() => handleSelect(q.id, choice)}
                  className="accent-accent1-light dark:accent-accent1-dark"
                  required
                />
                <span className="font-body">{choice}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button variant="success" type="submit" disabled={Object.keys(answers).length !== questions.length}>Submit Quiz</Button>
    </form>
  );
} 