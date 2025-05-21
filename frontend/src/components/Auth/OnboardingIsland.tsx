import React, { useState } from "react";
import { Button } from "../UI/Button";
import { db, auth } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const subjects = [
  "AP Calculus AB/BC", "AP Computer Science A", "AP Computer Science Principles", "AP Pre-Calculus", "AP Statistics",
  "AP Biology", "AP Chemistry", "AP Environmental Science", "AP Physics 1", "AP Physics 2 (2025)", "AP Physics C: E&M (2025)", "AP Physics C: Mechanics (2025)",
  "AP US History (US)", "AP European History (EU)", "AP World History: Modern",
  "AP Psychology (2025)", "AP African American Studies", "AP US Government", "AP Comparative Government", "AP Human Geography", "AP Macroeconomics", "AP Microeconomics",
  "AP Spanish Language", "AP Spanish Literature", "AP French", "AP Chinese", "AP Japanese", "AP Italian", "AP German", "AP Latin", "AP English Language", "AP English Literature",
  "AP Art & Design", "AP Art History", "AP Seminar", "AP Research", "SAT", "ACT"
];

export default function OnboardingIsland() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleToggle = (subject: string) => {
    setSelected((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      await setDoc(doc(db, "users", user.uid), {
        activeSubjects: selected,
        onboardingComplete: true,
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to save onboarding data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="font-heading text-xl font-semibold mb-2">Select your exams/subjects:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
          {subjects.map((subject) => (
            <label className="flex items-center gap-2 cursor-pointer" key={subject}>
              <input
                type="checkbox"
                className="accent-accent1-light dark:accent-accent1-dark rounded"
                checked={selected.includes(subject)}
                onChange={() => handleToggle(subject)}
                disabled={loading}
              />
              <span className="font-body text-sm">{subject}</span>
            </label>
          ))}
        </div>
      </div>
      <Button variant="accent1" size="lg" className="w-full" type="submit" disabled={loading || selected.length === 0}>
        {loading ? "Saving..." : "Generate Study Plan"}
      </Button>
      {error && <div className="text-error-light dark:text-error-dark text-center mt-2">{error}</div>}
      {success && <div className="text-success-light dark:text-success-dark text-center mt-2">Onboarding complete! Redirecting...</div>}
    </form>
  );
} 