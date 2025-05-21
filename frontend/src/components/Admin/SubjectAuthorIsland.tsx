import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

type Subject = {
  subjectId: string;
  name: string;
  examType: string;
  description?: string;
};

export default function SubjectAuthorIsland() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", examType: "AP", description: "" });
  const [error, setError] = useState<string | null>(null);

  // Load current subjects
  useEffect(() => {
    getDocs(collection(db, "subjects")).then(snapshot => {
      setSubjects(snapshot.docs.map(doc => ({ subjectId: doc.id, ...doc.data() } as Subject)));
    });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name required.");
    try {
      await addDoc(collection(db, "subjects"), form);
      setModal(false);
      setError(null);
      // reload
      const snapshot = await getDocs(collection(db, "subjects"));
      setSubjects(snapshot.docs.map(doc => ({ subjectId: doc.id, ...doc.data() } as Subject)));
    } catch {
      setError("Unable to add subject.");
    }
  }

  async function handleDelete(subjectId: string) {
    if (!window.confirm("Delete this subject?")) return;
    await deleteDoc(doc(db, "subjects", subjectId));
    setSubjects(subjects.filter(s => s.subjectId !== subjectId));
  }

  return (
    <section>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => setModal(true)}
        aria-label="Add Subject"
      >
        Add Subject
      </button>
      {modal && (
        <form onSubmit={handleAdd} className="mb-4 bg-gray-100 p-4 rounded shadow">
          <label>
            Name:
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="ml-2 p-1 rounded border"
              required
            />
          </label>
          <label className="ml-4">
            Type:
            <select
              value={form.examType}
              onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}
              className="ml-2 p-1 rounded border"
            >
              <option>AP</option>
              <option>SAT</option>
              <option>ACT</option>
            </select>
          </label>
          <label className="ml-4">
            Description:
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="ml-2 p-1 rounded border"
            />
          </label>
          <button className="ml-4 px-3 py-1 rounded bg-green-600 text-white" type="submit">
            Save
          </button>
          <button className="ml-2 px-3 py-1 rounded bg-gray-400 text-white" type="button" onClick={() => setModal(false)}>
            Cancel
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      )}
      <ul>
        {subjects.map(sub => (
          <li key={sub.subjectId} className="flex items-center justify-between py-2 border-b">
            <span className="font-semibold">{sub.name} <span className="text-sm font-normal opacity-60">({sub.examType})</span></span>
            <button
              className="px-2 py-1 text-sm bg-red-600 text-white rounded"
              onClick={() => handleDelete(sub.subjectId)}
              aria-label={`Delete subject ${sub.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}