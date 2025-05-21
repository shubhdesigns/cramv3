import React, { useState } from "react";
import { generateStudyPlan } from "../../utils/studyPlanService";

export default function StudyPlanIsland({ uid }: { uid: string }) {
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await generateStudyPlan({ examDate, subjects, goal, uid });
      setPlan(res.plan);
    } catch {
      setError("Could not generate study plan. Try again.");
    }
    setLoading(false);
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-3">📅 Build Your Study Plan</h2>
      <form className="flex gap-3 flex-wrap mb-4" onSubmit={handlePlan}>
        <input
          type="date"
          value={examDate}
          onChange={e => setExamDate(e.target.value)}
          className="p-2 rounded border"
          required
          placeholder="Exam date"
          aria-label="Exam date"
        />
        <input
          type="text"
          value={subjects.join(", ")}
          onChange={e => setSubjects(e.target.value.split(",").map(s => s.trim()))}
          className="p-2 rounded border"
          required
          placeholder="Subjects (e.g. AP Biology, SAT Math)"
          aria-label="Subjects"
        />
        <input
          type="text"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          className="p-2 rounded border"
          placeholder="e.g. Score 5, improve vocabulary"
          aria-label="Goal"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Generating..." : "Get Plan"}
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
      {plan && (
        <article className="mt-4 whitespace-pre-line bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 p-4 rounded">
          <strong>Your AI Study Plan:</strong>
          <br />
          {plan}
        </article>
      )}
    </section>
  );
}