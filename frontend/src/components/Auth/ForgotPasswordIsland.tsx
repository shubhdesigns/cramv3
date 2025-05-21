import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "../../firebase/init";

export default function ForgotPasswordIsland() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!firebaseModule) {
      setError('Firebase not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await firebaseModule.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      let errorMessage = "Failed to send password reset email";
      
      if (err.code === 'auth/user-not-found') {
        // For security reasons, we don't want to reveal if an email exists or not
        // So we show success message even when the user is not found
        setSuccess(true);
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address";
        setError(errorMessage);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full px-2 sm:px-0">
        <div className="p-4 bg-success-light/10 dark:bg-success-dark/10 rounded-md text-success-light dark:text-success-dark text-center">
          <p className="font-medium mb-2">Password Reset Email Sent</p>
          <p className="text-sm">
            If an account exists with the email <span className="font-medium">{email}</span>, you will receive a password reset link shortly.
          </p>
        </div>
        <p className="text-center text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
          Didn't receive the email? Check your spam folder or <button onClick={handleSubmit} className="text-primary dark:text-primary-dark underline">try again</button>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full px-2 sm:px-0">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="Enter your email address"
            autoComplete="email"
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent1-light dark:bg-accent1-dark text-white rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base font-medium"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>
      </form>
      
      {error && (
        <div className="text-error-light dark:text-error-dark text-center mt-2 p-3 bg-error-light/10 dark:bg-error-dark/10 rounded-md text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 