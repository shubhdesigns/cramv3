import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

type Badge = { name: string; icon: string; desc: string };

const BADGES: Badge[] = [
  { name: "Quiz Whiz", icon: "🎯", desc: "Perfect score on a quiz" },
  { name: "Streak Starter", icon: "🔥", desc: "3 days in a row" },
  { name: "Flashcard Fanatic", icon: "🧠", desc: "50 flashcards reviewed" },
];

export default function ProfileIsland({ uid }: { uid: string }) {
  const [profile, setProfile] = useState<{ displayName: string; xp: number; streak: number; badges: string[] }>({
    displayName: "",
    xp: 0,
    streak: 0,
    badges: [],
  });

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then(snap => {
      if (snap.exists()) setProfile(prev => ({ ...prev, ...snap.data() }));
    });
  }, [uid]);

  useEffect(() => {
    if (profile.xp && profile.xp % 100 === 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 } });
    }
  }, [profile.xp]);

  return (
    <aside className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-1">{profile.displayName || "Your Profile"}</h2>
      <div className="flex items-center gap-6 mt-3 flex-wrap">
        <div>
          <div className="text-lg font-semibold">XP</div>
          <div className="text-blue-600 dark:text-blue-300 text-3xl font-bold">{profile.xp}</div>
        </div>
        <div>
          <div className="text-lg font-semibold">Streak</div>
          <div className="text-orange-600 dark:text-orange-300 text-3xl">{profile.streak} 🔥</div>
        </div>
        <div>
          <div className="text-lg font-semibold">Badges</div>
          <div className="flex gap-2 text-2xl">
            {BADGES.filter(b => profile.badges?.includes(b.name)).map(b => (
              <span title={b.desc} key={b.name}>{b.icon}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-gray-500 text-sm">
        <em>Tip: Complete daily goals to keep your streak going and earn bonus XP!</em>
      </div>
    </aside>
  );
}