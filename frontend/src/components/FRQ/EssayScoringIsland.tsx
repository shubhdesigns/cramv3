import React, { useState } from "react";
import { scoreEssay } from "../../utils/essayService";

export default function EssayScoringIsland() {
  const [prompt, setPrompt] = useState("Describe the causes of the American Revolution.");
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await scoreEssay(prompt, essay);
      setResult(res);
    } catch {
      setError("Could not score your essay. Please try again!");
    }
    setLoading(false);
  }

  return (
    <section aria-labelledby="frq-title" className="bg-white dark:bg-gray-800 rounded shadow-md p-8">
      <h2 id="frq-title" className="mb-4 text-xl font-semibold text-brand dark:text-blue-300">
        Write Your Response
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">
          Essay Prompt
          <input
            type="text"
            className="w-full p-2 rounded mt-1 border"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
            aria-label="Essay prompt"
          />
        </label>
        <label className="block mb-2 font-medium">
          Essay Answer
          <textarea
            className="w-full min-h-[120px] p-2 rounded mt-1 border"
            value={essay}
            onChange={e => setEssay(e.target.value)}
            aria-label="Essay text"
            required
            spellCheck
            maxLength={3000}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !essay.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded mt-2"
          aria-label="Submit essay for scoring"
        >
          {loading ? "Scoring..." : "Score My Essay"}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded shadow">
          <div className="font-bold text-green-700 dark:text-green-300 mb-2">
            Score: {result.score} / 6
          </div>
          <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line">
            Feedback: {result.feedback}
          </div>
        </div>
      )}
    </section>
  );
}