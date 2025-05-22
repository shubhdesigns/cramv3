import React, { useEffect, useState } from "react";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import Dialog from "../UI/Dialog";

interface Flashcard {
  id: string;
  prompt: string;
  answer: string;
  status?: string;
}

// Sample flashcards data
const sampleFlashcards: Flashcard[] = [
  { id: "f1", prompt: "Photosynthesis occurs in the...?", answer: "Chloroplasts", status: "new" },
  { id: "f2", prompt: "What is the value of π (Pi) rounded to 3 decimals?", answer: "3.142", status: "learned" },
  { id: "f3", prompt: "What is the capital of France?", answer: "Paris", status: "new" },
  { id: "f4", prompt: "What is the chemical symbol for gold?", answer: "Au", status: "learning" },
  { id: "f5", prompt: "What is the powerhouse of the cell?", answer: "Mitochondria", status: "new" },
  { id: "f6", prompt: "The process of cell division is called?", answer: "Mitosis", status: "learning" },
];

export default function FlashcardsIsland() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAITopic] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [aiResults, setAIResults] = useState<string>("");

  // Use sample data instead of fetching from Firebase
  useEffect(() => {
    setFlashcards(sampleFlashcards);
    setLoading(false);
  }, []);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setAILoading(true);
    setAIError(null);
    setAIResults("");
    
    try {
      // Simulate AI response with fixed content
      setTimeout(() => {
        setAIResults(`Generated flashcards for "${aiTopic}":\n\n1. Question: What is ${aiTopic}?\nAnswer: ${aiTopic} is an important concept in its field.\n\n2. Question: When was ${aiTopic} discovered?\nAnswer: The concept of ${aiTopic} emerged through early research.\n\n3. Question: How is ${aiTopic} applied?\nAnswer: ${aiTopic} is applied in various contexts to solve problems.`);
        setAILoading(false);
      }, 1500);
    } catch (err: any) {
      setAIError("Failed to generate flashcards.");
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
