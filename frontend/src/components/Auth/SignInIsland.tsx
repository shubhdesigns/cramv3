import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../UI/Button";
import { useFirebase } from "../../firebase/init";

export default function SignInIsland() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
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
      
      // Update user's last login time in Firestore if needed
      try {
        const user = firebaseModule.getUser();
        if (user && user.uid) {
          // We could update the last login time here if needed
          // For now, we'll just redirect to dashboard
        }
      } catch (err) {
        console.error("Error updating user data:", err);
      }
      
      window.location.href = "/dashboard";
    } catch (err: any) {
      let errorMessage = "Sign in failed";
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setShowSignup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await firebaseModule.signInWithEmail(email, password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      let errorMessage = "Invalid email or password";
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up first.";
        setShowSignup(true);
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again or reset your password.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      if (err.code === 'auth/user-not-found') {
        setShowSignup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full px-2 sm:px-0">
      <motion.button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-accent1-light dark:bg-accent1-dark text-white rounded-md hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-lg sm:text-xl">🔐</span> 
        <span className="text-sm sm:text-base">{loading ? "Signing in..." : "Sign in with Google"}</span>
      </motion.button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light dark:border-border-dark"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm">Or continue with email</span>
        </div>
      </div>
      
      <form onSubmit={handleEmailSignIn} className="space-y-3 sm:space-y-4 w-full">
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent1-light dark:bg-accent1-dark text-white rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base font-medium"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </motion.button>
      </form>
      
      {error && (
        <div className="text-error-light dark:text-error-dark text-center mt-2 p-3 bg-error-light/10 dark:bg-error-dark/10 rounded-md text-xs sm:text-sm">
          {error}
          {showSignup && (
            <div className="mt-2">
              <a href="/signup" className="text-primary dark:text-primary-dark font-medium hover:underline">
                Create an account →
              </a>
            </div>
          )}
        </div>
      )}
      
      <div className="text-center text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
        <a href="/forgot-password" className="hover:text-primary dark:hover:text-primary-dark">
          Forgot your password?
        </a>
      </div>
    </div>
  );
} 