import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

type User = {
  uid: string;
  displayName: string;
  xp: number;
  streak: number;
};

export default function LeaderboardIsland() {
  const [leaders, setLeaders] = useState<User[]>([]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(10));
    const unsub = onSnapshot(q, snap => {
      setLeaders(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)));
    });
    return () => unsub();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-10 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🏆 Top Learners</h2>
      <ol>
        {leaders.map((u, i) => (
          <li key={u.uid} className="flex items-center gap-4 py-1">
            <span className="text-lg font-bold">{i + 1}.</span>
            <span className="font-semibold">{u.displayName || "Anonymous"}</span>
            <span className="ml-auto text-blue-600 dark:text-blue-300">{u.xp} XP</span>
            <span className="ml-3 text-orange-500 dark:text-orange-300">{u.streak}🔥</span>
          </li>
        ))}
      </ol>
    </section>
  );
}