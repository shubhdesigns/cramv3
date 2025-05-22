import React, { useEffect, useState } from "react";
import { Button } from "../UI/Button";

interface Question {
  id: string;
  text: string;
  choices: string[];
  answer: string;
}

// Sample data for demo purposes
const sampleQuizzes = {
  'ap-bio-quiz1': [
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
    },
    {
      id: "q3",
      text: "DNA replication occurs during which phase of the cell cycle?",
      choices: ["G1", "S", "G2", "M"],
      answer: "S"
    }
  ],
  'sat-math-quiz1': [
    {
      id: "q1",
      text: "Solve for x: 2x + 5 = 15",
      choices: ["x = 5", "x = 10", "x = 8", "x = 7.5"],
      answer: "x = 5"
    },
    {
      id: "q2", 
      text: "What is the area of a circle with radius 6?",
      choices: ["12π", "36π", "6π", "24π"],
      answer: "36π"
    },
    {
      id: "q3",
      text: "If y = 3x - 4 and x = 2, what is the value of y?",
      choices: ["2", "6", "8", "10"],
      answer: "2"
    }
  ],
  'ap-calc-quiz1': [
    {
      id: "q1",
      text: "What is the derivative of f(x) = x²?",
      choices: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
      answer: "f'(x) = 2x"
    },
    {
      id: "q2",
      text: "What is the integral of g(x) = 3x²?",
      choices: ["G(x) = x³ + C", "G(x) = 6x + C", "G(x) = x³/3 + C", "G(x) = x² + C"],
      answer: "G(x) = x³ + C"
    }
  ],
  'ap-history-quiz1': [
    {
      id: "q1",
      text: "Which document begins with 'When in the Course of human events...'?",
      choices: ["The Constitution", "The Declaration of Independence", "The Federalist Papers", "The Emancipation Proclamation"],
      answer: "The Declaration of Independence"
    },
    {
      id: "q2",
      text: "Who was the first U.S. President?",
      choices: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      answer: "George Washington"
    }
  ]
};

export default function QuizTakeIsland({ quizId }: { quizId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load questions for the selected quiz
    setTimeout(() => {
      const quizQuestions = sampleQuizzes[quizId as keyof typeof sampleQuizzes];
      if (quizQuestions) {
        setQuestions(quizQuestions);
      } else {
        setError("Quiz not found");
      }
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [quizId]);

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