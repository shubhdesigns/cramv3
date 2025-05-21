import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase/init";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import { Dialog } from "../UI/Dialog";
import { httpsCallable } from "firebase/functions";

interface Flashcard {
  id: string;
  prompt: string;
  answer: string;
  status?: string;
}

export default function FlashcardsIsland() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAITopic] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [aiResults, setAIResults] = useState<string>("");
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
      fetchFlashcards(module);
    });
  }, []);

  const fetchFlashcards = async (module: any) => {
    if (!module) return;

    setLoading(true);
    setError(null);
    try {
      const user = module.auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      const snap = await getDocs(collection(module.db, `users/${user.uid}/flashcards`));
      const cards: Flashcard[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        cards.push({
          id: doc.id,
          prompt: data.prompt,
          answer: data.answer,
          status: data.status,
        });
      });
      setFlashcards(cards);
    } catch (err: any) {
      setError(err.message || "Failed to load flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseModule) {
      setAIError('Firebase not initialized');
      return;
    }

    setAILoading(true);
    setAIError(null);
    setAIResults("");
    try {
      const generateFlashcards = httpsCallable(firebaseModule.functions, "generateFlashcards");
      const res: any = await generateFlashcards({ topic: aiTopic });
      setAIResults(res.data.flashcards);
    } catch (err: any) {
      setAIError(err.message || "Failed to generate flashcards.");
    } finally {
      setAILoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-accent2-light dark:text-accent2-dark font-heading">Loading flashcards...</div>;
  }
  if (error) {
    return <div className="text-center text-error-light dark:text-error-dark font-heading">{error}</div>;
  }
  if (flashcards.length === 0) {
    return <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">No flashcards found. Start by adding some!</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end mb-2">
        <Button variant="info" onClick={() => setShowAI(true)}>
          Ask AI to Generate Flashcards
        </Button>
      </div>
      {showAI && (
        <Dialog onClose={() => setShowAI(false)} title="Ask AI to Generate Flashcards">
          <form className="flex flex-col gap-4" onSubmit={handleAskAI}>
            <input
              type="text"
              className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
              placeholder="Enter a topic (e.g. Photosynthesis)"
              value={aiTopic}
              onChange={e => setAITopic(e.target.value)}
              required
              disabled={aiLoading}
            />
            <Button variant="accent1" type="submit" disabled={aiLoading || !aiTopic}>
              {aiLoading ? "Generating..." : "Generate"}
            </Button>
            {aiError && <div className="text-error-light dark:text-error-dark text-center mt-2">{aiError}</div>}
            {aiResults && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 mt-2 whitespace-pre-line text-sm">
                {aiResults}
              </div>
            )}
          </form>
        </Dialog>
      )}
      {flashcards.map(card => (
        <Card key={card.id} header={<span>Flashcard</span>}>
          <div className="mb-4">
            <p className="font-heading text-lg mb-2">{flipped[card.id] ? <span className="text-success-light dark:text-success-dark">Answer:</span> : <span className="text-accent2-light dark:text-accent2-dark">Q:</span>} {flipped[card.id] ? card.answer : card.prompt}</p>
          </div>
          <Button variant="accent2" onClick={() => setFlipped(f => ({ ...f, [card.id]: !f[card.id] }))}>
            {flipped[card.id] ? "Show Question" : "Show Answer"}
          </Button>
        </Card>
      ))}
    </div>
  );
}
