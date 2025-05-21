import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "./UI/Button";
import { useNavigate } from "react-router-dom";

export default function SignupIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleGoogleSignup() {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleEmailSignup} className="space-y-4">
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
        <Button type="submit" className="w-full" disabled={loading}>Sign Up</Button>
      </form>
      <div className="my-4 text-center text-gray-500">or</div>
      <Button onClick={handleGoogleSignup} className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
        Sign up with Google
      </Button>
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}

// Mount to #signup-island-root if running in browser
if (typeof window !== "undefined") {
  const root = document.getElementById("signup-island-root");
  if (root) {
    import("react-dom/client").then(({ createRoot }) => {
      createRoot(root).render(<SignupIsland />);
    });
  }
} 