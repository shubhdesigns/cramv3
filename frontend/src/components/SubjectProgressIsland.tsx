import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../firebase/firebase";

function getStreak(progress: any[]) {
  let streak = 0;
  for (let i = progress.length - 1; i >= 0; i--) {
    if (progress[i].score > 0) streak++;
    else break;
  }
  return streak;
}

export default function SubjectProgressIsland({ subjectId }: { subjectId: string }) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [recentScore, setRecentScore] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    async function fetchProgress() {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, `users/${user.uid}/progress`), where("subjectId", "==", subjectId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setProgress(data);
      if (data.length > 0) {
        const avg = data.reduce((sum, p) => sum + (p.score || 0), 0) / data.length;
        setAvgScore(avg);
        setBestScore(Math.max(...data.map(p => p.score || 0)));
        setRecentScore(data[data.length - 1].score);
        setStreak(getStreak(data));
      }
      setLoading(false);
    }
    fetchProgress();
  }, [subjectId]);

  if (loading) return <div>Loading progress...</div>;
  if (progress.length === 0) return <div>No quiz progress for this subject yet.</div>;

  return (
    <div className="my-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow" aria-label="Your Progress" tabIndex={0}>
      <div className="mb-2 font-semibold">Your Progress</div>
      <div className="mb-1 text-sm text-gray-600" aria-label="Quizzes taken">Quizzes taken: {progress.length}</div>
      <div className="mb-1 text-sm text-gray-600" aria-label="Average score" title="Average score across all attempts">
        Average score: <span className="font-bold text-blue-700 dark:text-blue-300">{avgScore?.toFixed(1)}</span>
      </div>
      <div className="mb-1 text-sm text-gray-600" aria-label="Best score" title="Your best score on this subject">
        Best score: <span className="font-bold text-green-700 dark:text-green-300">{bestScore}</span>
      </div>
      <div className="mb-1 text-sm text-gray-600" aria-label="Most recent score" title="Your most recent quiz score">
        Most recent: <span className="font-bold text-purple-700 dark:text-purple-300">{recentScore}</span>
      </div>
      <div className="mb-1 text-sm text-gray-600" aria-label="Streak" title="Number of consecutive quizzes with a score above 0">
        Streak: <span className="font-bold text-yellow-700 dark:text-yellow-300">{streak}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded h-3 mt-2" aria-label="Progress bar" role="progressbar" aria-valuenow={avgScore || 0} aria-valuemin={0} aria-valuemax={10} tabIndex={0}>
        <div
          className="bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 h-3 rounded"
          style={{ width: `${Math.min((avgScore || 0) * 10, 100)}%` }}
        ></div>
      </div>
    </div>
  );
} 