import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "./UI/Button";

export default function LoginIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          type="email"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>Sign In</Button>
      </form>
      <div className="my-4 text-center text-gray-500">or</div>
      <Button onClick={handleGoogleLogin} className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
        Sign in with Google
      </Button>
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}

// Mount to #login-island-root if running in browser
if (typeof window !== "undefined") {
  const root = document.getElementById("login-island-root");
  if (root) {
    import("react-dom/client").then(({ createRoot }) => {
      createRoot(root).render(<LoginIsland />);
    });
  }
} 