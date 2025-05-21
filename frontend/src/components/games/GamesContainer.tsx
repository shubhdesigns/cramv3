import React, { useState } from "react";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import PomodoroIsland from "./PomodoroIsland";
import MemoryGameIsland from "./MemoryGameIsland";

export default function GamesContainer() {
  const [showMemory, setShowMemory] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);

  return (
    <>
      <Card header={<span>Memory Match</span>}>
        <p className="mb-4">Sharpen your mind and recharge with a quick memory game!</p>
        <Button variant="info" onClick={() => setShowMemory(true)}>Play Now</Button>
      </Card>
      <Card header={<span>Pomodoro Timer</span>}>
        <p className="mb-4">Stay focused and boost productivity with the Pomodoro timer!</p>
        <Button variant="accent1" onClick={() => setShowPomodoro(true)}>Start Timer</Button>
      </Card>
      {showMemory && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-xl max-w-md w-full">
            <MemoryGameIsland onClose={() => setShowMemory(false)} />
          </div>
        </div>
      )}
      {showPomodoro && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-xl max-w-md w-full">
            <PomodoroIsland onClose={() => setShowPomodoro(false)} />
          </div>
        </div>
      )}
    </>
  );
} 