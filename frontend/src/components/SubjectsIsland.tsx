import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

type Subject = {
  id: string;
  name: string;
  category: string;
  icon?: string;
  examType?: string;
  year?: string;
  country?: string;
};

export default function SubjectsIsland() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      setSubjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject)));
      setLoading(false);
    }
    fetchSubjects();
  }, []);

  if (loading) return <div>Loading subjects...</div>;

  const grouped = subjects.reduce((acc, subj) => {
    acc[subj.category] = acc[subj.category] || [];
    acc[subj.category].push(subj);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Object.entries(grouped).map(([cat, subs], i) => (
        <motion.div
          key={cat}
          className="p-4 rounded-lg shadow bg-gradient-to-br from-blue-100 to-purple-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4">{cat}</h2>
          <div className="flex flex-wrap gap-2">
            {subs.map(subj => (
              <motion.a
                key={subj.id}
                href={`/subjects/${subj.id}`}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full bg-white shadow text-sm font-medium border border-gray-200 flex items-center gap-1"
              >
                {subj.icon && <span>{subj.icon}</span>}
                {subj.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
} 