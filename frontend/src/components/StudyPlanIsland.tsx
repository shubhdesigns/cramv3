import React, { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { Button } from "./UI/Button";

function getSubjectFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("subject");
}

export default function StudyPlanIsland({ subjectId: propSubjectId }: { subjectId?: string }) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(propSubjectId || getSubjectFromUrl());
  const [plan, setPlan] = useState<string | null>(null);
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubjects() {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      setSubjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    if (!propSubjectId) fetchSubjects();
  }, [propSubjectId]);

  async function generatePlan() {
    setLoading(true);
    const functions = getFunctions();
    const createStudyPlan = httpsCallable(functions, "createStudyPlan");
    const user = auth.currentUser;
    const res: any = await createStudyPlan({
      uid: user?.uid,
      examDate,
      subjects: selectedSubject ? [selectedSubject] : []
    });
    setPlan(res.data.plan);
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Personalized Study Plan</h2>
      <div className="mb-4">
        <label className="block mb-1">Exam Date</label>
        <input
          type="date"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
          value={examDate}
          onChange={e => setExamDate(e.target.value)}
        />
      </div>
      {!propSubjectId && (
        <div className="mb-4">
          <label className="block mb-1">Subject</label>
          <select
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
            value={selectedSubject || ""}
            onChange={e => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Choose a subject --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.icon ? `${s.icon} ` : ""}{s.name}</option>
            ))}
          </select>
        </div>
      )}
      <Button onClick={generatePlan} disabled={loading || !selectedSubject}>
        {loading ? "Generating..." : "Generate Plan"}
      </Button>
      {plan && (
        <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Your Study Plan:</h3>
          <pre className="whitespace-pre-wrap">{plan}</pre>
        </div>
      )}
    </div>
  );
} 