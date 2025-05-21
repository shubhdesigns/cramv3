import React, { useState } from "react";
import { db } from "../../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FeedbackIsland({ context }: { context: string }) {
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!feedback.trim()) return setError("Describe the issue or your idea!");
    try {
      await addDoc(collection(db, "feedback"), {
        context,
        feedback,
        sentAt: serverTimestamp(),
      });
      setSent(true);
      setFeedback("");
    } catch {
      setError("Error sending feedback, please try again!");
    }
  }

  if (sent) {
    return (
      <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded p-3 mt-2">
        Thanks! Your feedback was sent to our team.
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-2 mt-4">
      <label htmlFor="feedback" className="font-medium">
        💡 Spot an error or have a suggestion?
      </label>
      <textarea
        id="feedback"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        className="p-2 rounded border min-h-[60px]"
        required
        placeholder="Tell us how to improve this question, flashcard, or feature..."
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded self-start">
        Send
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}