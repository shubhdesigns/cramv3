import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";

interface Progress {
  quizId: string;
  score: number;
  total: number;
  lastDate: string;
}

interface StudyPlanItem {
  date: string;
  subject: string;
  topic: string;
}

export default function DashboardIsland() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubjects, setActiveSubjects] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("You must be signed in.");
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setActiveSubjects(userDoc.data()?.activeSubjects || []);
        // Fetch progress
        const progressSnap = await getDocs(collection(db, `users/${user.uid}/progress`));
        const prog = progressSnap.docs.map(doc => {
          const data = doc.data();
          return {
            quizId: doc.id,
            score: data.score,
            total: data.total,
            lastDate: data.lastDate,
          };
        });
        setProgress(prog);
        // Fetch study plan
        const planSnap = await getDocs(collection(db, `users/${user.uid}/studyPlan`));
        const plan = planSnap.docs.map(doc => {
          const data = doc.data();
          return {
            date: data.date,
            subject: data.subject,
            topic: data.topic,
          };
        });
        setStudyPlan(plan);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center text-accent1-light dark:text-accent1-dark font-heading">Loading your dashboard...</div>;
  }
  if (error) {
    return <div className="text-center text-error-light dark:text-error-dark font-heading">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Card header={<span>Welcome back! 🎉</span>}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg font-heading mb-2">Your active subjects:</p>
            <ul className="list-disc ml-6 text-text-secondary-light dark:text-text-secondary-dark">
              {activeSubjects.length === 0 ? <li>No subjects selected yet.</li> : activeSubjects.map(sub => <li key={sub}>{sub}</li>)}
            </ul>
          </div>
          <div className="flex gap-2">
            <Button variant="accent1">Continue Study Plan</Button>
            <Button variant="accent2">Take a Quiz</Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card header={<span>📚 Your Progress</span>}>
          {progress.length === 0 ? (
            <p>No quiz progress yet.</p>
          ) : (
            progress.map(p => (
              <div key={p.quizId} className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading">{p.quizId}</span>
                  <span className="text-success-light dark:text-success-dark font-bold">{Math.round((p.score / p.total) * 100)}%</span>
                </div>
                <div className="w-full bg-border-light dark:bg-border-dark rounded-full h-2">
                  <div className="bg-accent1-light dark:bg-accent1-dark h-2 rounded-full" style={{ width: `${Math.round((p.score / p.total) * 100)}%` }}></div>
                </div>
              </div>
            ))
          )}
        </Card>
        <Card header={<span>📝 Study Plan</span>}>
          {studyPlan.length === 0 ? (
            <p>No study plan yet.</p>
          ) : (
            <ul className="list-disc ml-6">
              {studyPlan.map((item, idx) => (
                <li key={idx} className="mb-2">
                  <span className="font-heading text-accent1-light dark:text-accent1-dark">{item.subject}</span>: {item.topic} <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">({item.date})</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
} 