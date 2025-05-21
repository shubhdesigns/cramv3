import React, { useState, useEffect } from "react";
import { Button } from "../UI/Button";
import { useFirebase } from "../../firebase/init";

export default function SignInIsland() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await firebaseModule.signInWithProvider(firebaseModule.googleProvider);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  // For demo: email sign-in with hardcoded credentials
  const handleEmailSignIn = async () => {
    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await firebaseModule.signInWithEmail("demo@cramtime.com", "password123");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button variant="accent1" size="lg" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignIn} disabled={loading}>
        <span className="text-xl">🔐</span> {loading ? "Signing in..." : "Sign in with Google"}
      </Button>
      <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2" onClick={handleEmailSignIn} disabled={loading}>
        <span className="text-xl">✉️</span> Sign in with Email
      </Button>
      {error && <div className="text-error-light dark:text-error-dark text-center mt-2">{error}</div>}
    </div>
  );
} 