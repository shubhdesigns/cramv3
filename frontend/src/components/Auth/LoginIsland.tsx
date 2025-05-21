import React, { useState } from "react";
import { auth } from "../../utils/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export default function LoginIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Optionally redirect on success
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Optionally redirect on success
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        Log in to Cramtime
      </h2>
      <form onSubmit={handleEmailLogin} className="mb-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 rounded border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-2 transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        {loading ? "Signing in with Google..." : "Sign in with Google"}
      </button>
      {error && (
        <div className="text-red-600 bg-red-100 rounded p-2 mt-3 text-center text-sm">
          {error}
        </div>
      )}
    </div>
  );
}