import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";

interface Subject {
  id: string;
  name: string;
  desc?: string;
  iconUrl?: string;
  category?: string;
}

const fallbackSubjects: Subject[] = [
  { id: "ap-bio", name: "AP Biology", desc: "Master every unit, from cell structure to evolution." },
  { id: "sat-math", name: "SAT Math", desc: "Practice with real College Board questions and interactive flashcards." },
  { id: "apush", name: "AP US History", desc: "Comprehensive review of US history topics and skills." },
];

export default function SubjectsIsland() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "subjects"));
        if (snap.empty) {
          setSubjects(fallbackSubjects);
        } else {
          const subs: Subject[] = [];
          snap.forEach(doc => {
            const data = doc.data();
            subs.push({
              id: doc.id,
              name: data.name,
              desc: data.desc,
              iconUrl: data.iconUrl,
              category: data.category,
            });
          });
          setSubjects(subs);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load subjects.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="text-center text-accent1-light dark:text-accent1-dark font-heading">Loading subjects...</div>;
  }
  if (error) {
    return <div className="text-center text-error-light dark:text-error-dark font-heading">{error}</div>;
  }
  if (subjects.length === 0) {
    return <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">No subjects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subjects.map(subject => (
        <Card key={subject.id} header={<span>{subject.name}</span>}>
          <p className="mb-4">{subject.desc}</p>
          <Button variant="accent1">Start Studying</Button>
        </Card>
      ))}
    </div>
  );
} 