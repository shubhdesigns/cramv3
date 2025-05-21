import React, { useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "../UI/Button";

export default function FlashcardCreateIsland() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      await addDoc(collection(db, `users/${user.uid}/flashcards`), {
        prompt,
        answer,
        status: "new",
        createdAt: new Date().toISOString(),
      });
      setPrompt("");
      setAnswer("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add flashcard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 mb-8" onSubmit={handleSubmit}>
      <h2 className="font-heading text-xl font-semibold text-accent2-light dark:text-accent2-dark">Add a New Flashcard</h2>
      <input
        type="text"
        className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent2-light dark:focus:ring-accent2-dark"
        placeholder="Prompt (question)"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        required
        disabled={loading}
      />
      <input
        type="text"
        className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent2-light dark:focus:ring-accent2-dark"
        placeholder="Answer"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        required
        disabled={loading}
      />
      <Button variant="accent2" type="submit" disabled={loading || !prompt || !answer}>
        {loading ? "Adding..." : "Add Flashcard"}
      </Button>
      {error && <div className="text-error-light dark:text-error-dark text-center mt-2">{error}</div>}
      {success && <div className="text-success-light dark:text-success-dark text-center mt-2">Flashcard added!</div>}
    </form>
  );
} 