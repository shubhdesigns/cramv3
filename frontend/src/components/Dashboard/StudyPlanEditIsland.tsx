import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from "../UI/Button";

interface StudyPlanItem {
  id?: string;
  date: string;
  subject: string;
  topic: string;
}

export default function StudyPlanEditIsland() {
  const [plan, setPlan] = useState<StudyPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<StudyPlanItem>({ date: "", subject: "", topic: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("You must be signed in.");
        const snap = await getDocs(collection(db, `users/${user.uid}/studyPlan`));
        const items: StudyPlanItem[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          items.push({ id: docSnap.id, date: data.date, subject: data.subject, topic: data.topic });
        });
        setPlan(items);
      } catch (err: any) {
        setError(err.message || "Failed to load study plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      if (editingId) {
        await updateDoc(doc(db, `users/${user.uid}/studyPlan`, editingId), form);
      } else {
        await addDoc(collection(db, `users/${user.uid}/studyPlan`), form);
      }
      setForm({ date: "", subject: "", topic: "" });
      setEditingId(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to save study plan item.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: StudyPlanItem) => {
    setForm({ date: item.date, subject: item.subject, topic: item.topic });
    setEditingId(item.id!);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      await deleteDoc(doc(db, `users/${user.uid}/studyPlan`, id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to delete study plan item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-4" onSubmit={handleAddOrUpdate}>
        <h2 className="font-heading text-xl font-semibold text-accent1-light dark:text-accent1-dark">{editingId ? "Edit Study Plan Item" : "Add to Study Plan"}</h2>
        <input
          type="date"
          name="date"
          className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
          value={form.date}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="subject"
          className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="topic"
          className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
          placeholder="Topic"
          value={form.topic}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <Button variant="accent1" type="submit" disabled={loading || !form.date || !form.subject || !form.topic}>
          {loading ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Save Changes" : "Add Item")}
        </Button>
        {error && <div className="text-error-light dark:text-error-dark text-center mt-2">{error}</div>}
        {success && <div className="text-success-light dark:text-success-dark text-center mt-2">Saved!</div>}
      </form>
      <div className="flex flex-col gap-4">
        <h3 className="font-heading text-lg font-semibold mb-2">Your Study Plan</h3>
        {loading ? (
          <div className="text-center text-accent1-light dark:text-accent1-dark">Loading...</div>
        ) : plan.length === 0 ? (
          <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">No study plan items yet.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {plan.map(item => (
              <li key={item.id} className="flex items-center justify-between bg-surface-light dark:bg-surface-dark rounded-xl p-3 border border-border-light dark:border-border-dark">
                <div>
                  <span className="font-heading text-accent1-light dark:text-accent1-dark">{item.subject}</span>: {item.topic} <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">({item.date})</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="error" size="sm" onClick={() => item.id && handleDelete(item.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
import { db, auth } from "../../firebase/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from "../UI/Button";

interface StudyPlanItem {
  id?: string;
  date: string;
  subject: string;
  topic: string;
}

export default function StudyPlanEditIsland() {
  const [plan, setPlan] = useState<StudyPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<StudyPlanItem>({ date: "", subject: "", topic: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("You must be signed in.");
        const snap = await getDocs(collection(db, `users/${user.uid}/studyPlan`));
        const items: StudyPlanItem[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          items.push({ id: docSnap.id, date: data.date, subject: data.subject, topic: data.topic });
        });
        setPlan(items);
      } catch (err: any) {
        setError(err.message || "Failed to load study plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      if (editingId) {
        await updateDoc(doc(db, `users/${user.uid}/studyPlan`, editingId), form);
      } else {
        await addDoc(collection(db, `users/${user.uid}/studyPlan`), form);
      }
      setForm({ date: "", subject: "", topic: "" });
      setEditingId(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to save study plan item.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: StudyPlanItem) => {
    setForm({ date: item.date, subject: item.subject, topic: item.topic });
    setEditingId(item.id!);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in.");
      await deleteDoc(doc(db, `users/${user.uid}/studyPlan`, id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to delete study plan item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-4" onSubmit={handleAddOrUpdate}>
        <h2 className="font-heading text-xl font-semibold text-accent1-light dark:text-accent1-dark">{editingId ? "Edit Study Plan Item" : "Add to Study Plan"}</h2>
        <input
          type="date"
          name="date"
          className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
          value={form.date}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="subject"
          className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="text"
          name="topic"
          className="rounded-xl border border-border-light dark:border-border-dark p-3 font-body bg-surface-light dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent1-light dark:focus:ring-accent1-dark"
          placeholder="Topic"
          value={form.topic}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <Button variant="accent1" type="submit" disabled={loading || !form.date || !form.subject || !form.topic}>
          {loading ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Save Changes" : "Add Item")}
        </Button>
        {error && <div className="text-error-light dark:text-error-dark text-center mt-2">{error}</div>}
        {success && <div className="text-success-light dark:text-success-dark text-center mt-2">Saved!</div>}
      </form>
      <div className="flex flex-col gap-4">
        <h3 className="font-heading text-lg font-semibold mb-2">Your Study Plan</h3>
        {loading ? (
          <div className="text-center text-accent1-light dark:text-accent1-dark">Loading...</div>
        ) : plan.length === 0 ? (
          <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">No study plan items yet.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {plan.map(item => (
              <li key={item.id} className="flex items-center justify-between bg-surface-light dark:bg-surface-dark rounded-xl p-3 border border-border-light dark:border-border-dark">
                <div>
                  <span className="font-heading text-accent1-light dark:text-accent1-dark">{item.subject}</span>: {item.topic} <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">({item.date})</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="error" size="sm" onClick={() => item.id && handleDelete(item.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 