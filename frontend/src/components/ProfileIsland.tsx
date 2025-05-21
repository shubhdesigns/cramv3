import React, { useEffect, useState } from "react";
import { getAuth, updateProfile, sendPasswordResetEmail, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "./UI/Button";

export default function ProfileIsland() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setDisplayName(u?.displayName || "");
    });
    return () => unsub();
  }, [auth]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await updateProfile(user, { displayName });
      setMessage("Profile updated!");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handlePasswordReset() {
    if (!user?.email) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage("Password reset email sent!");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4">
        <div className="text-gray-700 dark:text-gray-200 mb-1">Email:</div>
        <div className="font-mono text-sm mb-2">{user.email}</div>
      </div>
      <form onSubmit={handleUpdateProfile} className="space-y-4 mb-6">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-200">Display Name</span>
          <input
            type="text"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 mt-1"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>Update Profile</Button>
      </form>
      <Button onClick={handlePasswordReset} className="w-full bg-yellow-500 hover:bg-yellow-600 mb-2" disabled={loading}>
        Send Password Reset Email
      </Button>
      {message && <div className="mt-4 text-green-600 text-sm">{message}</div>}
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}

// Mount to #profile-island-root if running in browser
if (typeof window !== "undefined") {
  const root = document.getElementById("profile-island-root");
  if (root) {
    import("react-dom/client").then(({ createRoot }) => {
      createRoot(root).render(<ProfileIsland />);
    });
  }
} 