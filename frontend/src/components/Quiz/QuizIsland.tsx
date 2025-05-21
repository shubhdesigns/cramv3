import React, { useState } from "react";
import { motion } from "framer-motion";

// Quiz question/structure types
type Question = {
  questionId: string;
  text: string;
  choices: string[];
  answer: string;
};

interface QuizIslandProps {
  questions: Question[];
  title: string;
}

const getInitialAnswers = (questions: Question[]) =>
  Object.fromEntries(questions.map(q => [q.questionId, ""]));

export default function QuizIsland({ questions, title }: QuizIslandProps) {
  const [answers, setAnswers] = useState(getInitialAnswers(questions));
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce(
    (acc, q) => acc + (answers[q.questionId] === q.answer ? 1 : 0),
    0
  );

  function handleSelect(qid: string, choice: string) {
    if (submitted) return;
    setAnswers(ans => ({ ...ans, [qid]: choice }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleRetry() {
    setAnswers(getInitialAnswers(questions));
    setSubmitted(false);
  }

  return (
    <section aria-labelledby="quiz-title" className="bg-white dark:bg-gray-800 rounded shadow-md p-8">
      <h2 id="quiz-title" className="mb-4 text-2xl font-bold text-brand dark:text-blue-300">
        {title}
      </h2>
      <form onSubmit={handleSubmit} aria-describedby="quiz-desc">
        <ol className="space-y-8" id="quiz-desc">
          {questions.map((q, qi) => (
            <li key={q.questionId}>
              <fieldset className="mb-2">
                <legend className="font-semibold mb-2">{q.text}</legend>
                <div className="flex flex-col gap-2">
                  {q.choices.map(choice => (
                    <label key={choice} className={"flex items-center gap-2"}>
                      <input
                        type="radio"
                        name={`q${q.questionId}`}
                        value={choice}
                        aria-label={choice}
                        checked={answers[q.questionId] === choice}
                        onChange={() => handleSelect(q.questionId, choice)}
                        disabled={submitted}
                        className="accent-blue-600"
                      />
                      <span>{choice}</span>
                    </label>
                  ))}
                </div>
                {submitted && (
                  <motion.div
                    className={`mt-2 font-semibold ${
                      answers[q.questionId] === q.answer
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {answers[q.questionId] === q.answer
                      ? "Correct!"
                      : `Incorrect, answer: ${q.answer}`}
                  </motion.div>
                )}
              </fieldset>
            </li>
          ))}
        </ol>
        <div className="flex gap-6 mt-8">
          {!submitted ? (
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-6 py-2 focus:outline focus:ring-2 focus:ring-blue-400"
              aria-label="Submit Quiz"
              disabled={Object.values(answers).some(a => !a)}
            >
              Submit
            </button>
          ) : (
            <motion.div
              className="flex items-center text-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className="font-semibold mr-2">Score:</span>
              <span
                className={`font-bold ${
                  score >= questions.length / 2 ? "text-green-600" : "text-red-600"
                }`}
              >
                {score}/{questions.length}
              </span>
              <button
                type="button"
                className="ml-6 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded px-4 py-2 text-sm"
                onClick={handleRetry}
                aria-label="Retry Quiz"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </form>
    </section>
  );
}