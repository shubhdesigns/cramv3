import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import QuizTakeIsland from "./QuizTakeIsland";

interface Quiz {
  id: string;
  title: string;
  subjectId?: string;
  questionCount?: number;
  description?: string;
}

const fallbackQuizzes: Quiz[] = [
  { id: "ap-bio-quiz1", title: "AP Biology Quiz 1", subjectId: "ap-bio", questionCount: 10, description: "Unit 1: Chemistry of Life" },
  { id: "sat-math-quiz1", title: "SAT Math Practice", subjectId: "sat-math", questionCount: 15, description: "Algebra & Functions" },
];

export default function QuizzesIsland() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "quizzes"));
        if (snap.empty) {
          setQuizzes(fallbackQuizzes);
        } else {
          const qs: Quiz[] = [];
          snap.forEach(doc => {
            const data = doc.data();
            qs.push({
              id: doc.id,
              title: data.title,
              subjectId: data.subjectId,
              questionCount: data.questionIds?.length,
              description: data.description,
            });
          });
          setQuizzes(qs);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="text-center text-success-light dark:text-success-dark font-heading">Loading quizzes...</div>;
  }
  if (error) {
    return <div className="text-center text-error-light dark:text-error-dark font-heading">{error}</div>;
  }
  if (selectedQuizId) {
    return <QuizTakeIsland quizId={selectedQuizId} />;
  }
  if (quizzes.length === 0) {
    return <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">No quizzes found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quizzes.map(quiz => (
        <Card key={quiz.id} header={<span>{quiz.title}</span>}>
          <p className="mb-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">{quiz.description}</p>
          <p className="mb-4">{quiz.questionCount ?? 0} questions</p>
          <Button variant="success" onClick={() => setSelectedQuizId(quiz.id)}>Start Quiz</Button>
        </Card>
      ))}
    </div>
  );
} 
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import QuizTakeIsland from "./QuizTakeIsland";

interface Quiz {
  id: string;
  title: string;
  subjectId?: string;
  questionCount?: number;
  description?: string;
}

const fallbackQuizzes: Quiz[] = [
  { id: "ap-bio-quiz1", title: "AP Biology Quiz 1", subjectId: "ap-bio", questionCount: 10, description: "Unit 1: Chemistry of Life" },
  { id: "sat-math-quiz1", title: "SAT Math Practice", subjectId: "sat-math", questionCount: 15, description: "Algebra & Functions" },
];

export default function QuizzesIsland() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "quizzes"));
        if (snap.empty) {
          setQuizzes(fallbackQuizzes);
        } else {
          const qs: Quiz[] = [];
          snap.forEach(doc => {
            const data = doc.data();
            qs.push({
              id: doc.id,
              title: data.title,
              subjectId: data.subjectId,
              questionCount: data.questionIds?.length,
              description: data.description,
            });
          });
          setQuizzes(qs);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="text-center text-success-light dark:text-success-dark font-heading">Loading quizzes...</div>;
  }
  if (error) {
    return <div className="text-center text-error-light dark:text-error-dark font-heading">{error}</div>;
  }
  if (selectedQuizId) {
    return <QuizTakeIsland quizId={selectedQuizId} />;
  }
  if (quizzes.length === 0) {
    return <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">No quizzes found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quizzes.map(quiz => (
        <Card key={quiz.id} header={<span>{quiz.title}</span>}>
          <p className="mb-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">{quiz.description}</p>
          <p className="mb-4">{quiz.questionCount ?? 0} questions</p>
          <Button variant="success" onClick={() => setSelectedQuizId(quiz.id)}>Start Quiz</Button>
        </Card>
      ))}
    </div>
  );
} 