import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface MemoryGameIslandProps {
  onClose: () => void;
}

// Added more cards and themes for variety
const THEMES = {
  fruits: ["🍎", "🍌", "🍇", "🍓", "🍊", "🥭", "🍍", "🥝"],
  animals: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨"],
  space: ["🚀", "🌎", "🌙", "⭐", "☄️", "🛸", "🪐", "🌌"]
};

type ThemeName = keyof typeof THEMES;

function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function MemoryGameIsland({ onClose }: MemoryGameIslandProps) {
  const [theme, setTheme] = useState<ThemeName>("fruits");
  const [cards, setCards] = useState(() => createCards(theme));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [gameTime, setGameTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [isGameStarted, setIsGameStarted] = useState(false);

  function createCards(selectedTheme: ThemeName) {
    const cardCount = difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 16;
    let cardValues = [...THEMES[selectedTheme]];
    if (cardCount > cardValues.length * 2) {
      // Repeat some values if we need more cards
      cardValues = [...cardValues, ...cardValues.slice(0, (cardCount / 2) - cardValues.length)];
    } else if (cardCount < cardValues.length * 2) {
      // Take only what we need
      cardValues = cardValues.slice(0, cardCount / 2);
    }
    
    return shuffle(
      [...cardValues, ...cardValues].map((value, i) => ({
        id: i,
        value,
        flipped: false,
        matched: false,
        animating: false
      }))
    );
  }

  // Start game timer when the game starts
  useEffect(() => {
    if (isGameStarted && !won) {
      setGameStartTime(new Date());
      timerRef.current = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameStarted, won]);

  // Load best score from Firebase on mount
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const statsRef = doc(db, `users/${user.uid}/gameStats/memory`);
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          const data = statsSnap.data();
          if (data.bestMoves) {
            setBestScore(data.bestMoves);
          }
        }
      } catch {}
    };
    loadBestScore();
  }, []);

  // Focus first card on mount
  useEffect(() => {
    cardRefs.current[0]?.focus();
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx = idx;
    const cardsPerRow = difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 4;
    
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % cards.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + cards.length) % cards.length;
    else if (e.key === "ArrowDown") nextIdx = (idx + cardsPerRow) % cards.length;
    else if (e.key === "ArrowUp") nextIdx = (idx - cardsPerRow + cards.length) % cards.length;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip(idx);
      return;
    } else if (e.key === "Escape") {
      onClose();
      return;
    }
    
    if (nextIdx !== idx) {
      e.preventDefault();
      setFocusedIdx(nextIdx);
      cardRefs.current[nextIdx]?.focus();
    }
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [i, j] = flippedIndices;
      
      if (cards[i].value === cards[j].value) {
        // Mark cards as animating during match animation
        setCards(prev => 
          prev.map((card, idx) => 
            idx === i || idx === j ? { ...card, animating: true } : card
          )
        );
        
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) =>
              idx === i || idx === j ? { ...card, matched: true, animating: false } : card
            )
          );
          setFlippedIndices([]);
        }, 600);
      } else {
        // Mark cards as animating during mismatch animation
        setCards(prev => 
          prev.map((card, idx) => 
            idx === i || idx === j ? { ...card, animating: true } : card
          )
        );
        
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) =>
              idx === i || idx === j ? { ...card, flipped: false, animating: false } : card
            )
          );
          setFlippedIndices([]);
        }, 800);
      }
      
      setMoves((prev) => prev + 1);
      
      // Check if all cards are matched after handling the pair
      setTimeout(() => {
        if (cards.filter((card) => !card.matched).length === 2 && cards[i].value === cards[j].value) {
          handleGameWin();
        }
      }, 900);
    }
  }, [flippedIndices, cards]);

  const handleGameWin = async () => {
    setWon(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Celebrate with confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Set toast message
    setToast(`You won in ${moves} moves!`);
    
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const statsRef = doc(db, `users/${user.uid}/gameStats/memory`);
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        if (!data.bestMoves || moves < data.bestMoves) {
          await updateDoc(statsRef, { 
            bestMoves: moves,
            lastPlayed: new Date(),
            gamesPlayed: (data.gamesPlayed || 0) + 1 
          });
          setBestScore(moves);
          setToast(`New best score! ${moves} moves!`);
        } else {
          await updateDoc(statsRef, { 
            lastPlayed: new Date(),
            gamesPlayed: (data.gamesPlayed || 0) + 1 
          });
        }
      } else {
        await setDoc(statsRef, {
          bestMoves: moves,
          lastPlayed: new Date(),
          gamesPlayed: 1
        });
        setBestScore(moves);
      }
    } catch (error) {
      console.error("Failed to update stats", error);
    }
  };
  
  const handleFlip = (idx: number) => {
    if (!isGameStarted && !won) {
      setIsGameStarted(true);
    }
    
    if (won || cards[idx].flipped || cards[idx].matched || flippedIndices.length >= 2) return;
    
    setCards((prev) =>
      prev.map((card, i) => (i === idx ? { ...card, flipped: true } : card))
    );
    
    setFlippedIndices((prev) => [...prev, idx]);
  };
  
  const handleRestart = () => {
    // Reset everything
    setCards(createCards(theme));
    setFlippedIndices([]);
    setMoves(0);
    setWon(false);
    setToast(null);
    setGameTime(0);
    setIsGameStarted(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Focus first card
    setTimeout(() => {
      cardRefs.current[0]?.focus();
    }, 100);
  };
  
  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    // Only recreate cards if game hasn't started or is already won
    if (!isGameStarted || won) {
      setCards(createCards(newTheme));
      setFlippedIndices([]);
      setMoves(0);
      setWon(false);
    }
  };
  
  const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(newDifficulty);
    // Only recreate cards if game hasn't started or is already won
    if (!isGameStarted || won) {
      setCards(createCards(theme));
      setFlippedIndices([]);
      setMoves(0);
      setWon(false);
      
      // Set up new card refs
      cardRefs.current = Array(newDifficulty === "easy" ? 8 : newDifficulty === "medium" ? 12 : 16).fill(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // The card grid size based on difficulty
  const gridCols = difficulty === "easy" ? "grid-cols-4" : difficulty === "medium" ? "grid-cols-4" : "grid-cols-4";
  const gridRows = difficulty === "easy" ? "grid-rows-2" : difficulty === "medium" ? "grid-rows-3" : "grid-rows-4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold font-heading">Memory Match</h2>
        <button
          onClick={onClose}
          className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
          aria-label="Close game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {toast && (
        <div className="bg-success-light/10 dark:bg-success-dark/10 border border-success-light dark:border-success-dark text-success-light dark:text-success-dark rounded-md px-3 py-2 mb-4">
          {toast}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          <span className="font-medium">Moves:</span> {moves}
          {bestScore && <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark ml-2">(Best: {bestScore})</span>}
        </div>
        {isGameStarted && !won && (
          <div className="text-sm">
            <span className="font-medium">Time:</span> {formatTime(gameTime)}
          </div>
        )}
      </div>
      
      <div className={`grid ${gridCols} ${gridRows} gap-2 mb-4`}>
        <AnimatePresence>
          {cards.map((card, idx) => (
            <motion.button
              key={card.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              onClick={() => handleFlip(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              disabled={card.matched}
              className={`aspect-square rounded-md text-2xl flex items-center justify-center select-none 
                ${card.flipped || card.matched ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border border-accent1-light dark:border-accent1-dark' : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent2-light dark:hover:border-accent2-dark'} 
                ${card.matched ? 'opacity-70' : 'opacity-100'}
                ${card.animating ? 'animate-pulse' : ''}
                transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent1-light dark:focus-visible:ring-accent1-dark focus-visible:ring-offset-2`}
              animate={{
                rotateY: card.flipped || card.matched ? 180 : 0,
                scale: card.animating ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 0.3 }}
              style={{ backfaceVisibility: "hidden" }}
            >
              {card.flipped || card.matched ? (
                <motion.span
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  className="block transform"
                >
                  {card.value}
                </motion.span>
              ) : (
                <span className="block">❓</span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-auto">
        <button
          onClick={handleRestart}
          className="w-full py-2 px-4 bg-accent1-light dark:bg-accent1-dark text-white rounded-md hover:bg-accent1-light/90 dark:hover:bg-accent1-dark/90 mb-4"
        >
          {won || isGameStarted ? "Play Again" : "New Game"}
        </button>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Theme</label>
            <div className="flex gap-1">
              <button 
                className={`flex-1 px-2 py-1 text-sm rounded-md border ${theme === 'fruits' ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                onClick={() => handleThemeChange('fruits')}
              >
                🍎 Fruits
              </button>
              <button 
                className={`flex-1 px-2 py-1 text-sm rounded-md border ${theme === 'animals' ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                onClick={() => handleThemeChange('animals')}
              >
                🐶 Animals
              </button>
              <button 
                className={`flex-1 px-2 py-1 text-sm rounded-md border ${theme === 'space' ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                onClick={() => handleThemeChange('space')}
              >
                🚀 Space
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Difficulty</label>
            <div className="flex gap-1">
              <button 
                className={`flex-1 px-2 py-1 text-sm rounded-md border ${difficulty === 'easy' ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                onClick={() => handleDifficultyChange('easy')}
              >
                Easy
              </button>
              <button 
                className={`flex-1 px-2 py-1 text-sm rounded-md border ${difficulty === 'medium' ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                onClick={() => handleDifficultyChange('medium')}
              >
                Medium
              </button>
              <button 
                className={`flex-1 px-2 py-1 text-sm rounded-md border ${difficulty === 'hard' ? 'bg-accent1-light/10 dark:bg-accent1-dark/10 border-accent1-light dark:border-accent1-dark' : 'border-border-light dark:border-border-dark'}`}
                onClick={() => handleDifficultyChange('hard')}
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 