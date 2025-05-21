import React, { useState } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: string;
}
interface QuizProps {
  questions: QuizQuestion[];
  onSubmit?: (score: number) => void;
}
const Quiz: React.FC<QuizProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChoice = (qIdx: number, choice: string) => {
    setAnswers((prev) => {
      const arr = [...prev];
      arr[qIdx] = choice;
      return arr;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = questions.reduce(
      (acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc),
      0
    );
    onSubmit?.(score);
  };

  return (
    <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      {questions.map((q, idx) => (
        <fieldset key={q.id} className="border border-zinc-200 dark:border-zinc-800 rounded p-4">
          <legend className="font-semibold">{`Q${idx + 1}: ${q.question}`}</legend>
          {q.choices.map((c, cIdx) => (
            <label key={cIdx} className="block mt-2">
              <input
                type="radio"
                name={`q-${idx}`}
                value={c}
                checked={answers[idx] === c}
                onChange={() => handleChoice(idx, c)}
                disabled={submitted}
                className="mr-2"
                aria-checked={answers[idx] === c}
              />
              {c}
            </label>
          ))}
          {submitted && (
            <div className={`mt-2 ${answers[idx] === q.answer ? "text-green-600" : "text-red-600"}`}>
              {answers[idx] === q.answer ? "✔ Correct" : `✗ Correct answer: ${q.answer}`}
            </div>
          )}
        </fieldset>
      ))}
      <button
        type="submit"
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        disabled={submitted}
        aria-disabled={submitted}
      >
        Submit
      </button>
      {submitted && (
        <div className="font-semibold text-xl mt-4">
          Score: {questions.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0)} / {questions.length}
        </div>
      )}
    </form>
  );
};
export default Quiz;