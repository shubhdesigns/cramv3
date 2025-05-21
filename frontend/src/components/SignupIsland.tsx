import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "../firebase/init";
// Direct imports for fallback
import * as firebaseFallback from "../firebase/firebase.client.js";

export default function SignupIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Initialize Firebase when component mounts
  useEffect(() => {
    let mounted = true;
    let initAttempts = 0;
    const maxAttempts = 3;
    
    const initializeFirebase = async () => {
      try {
        // Try to use the useFirebase helper first
        useFirebase((module) => {
          if (mounted) {
            console.log("Firebase initialized via useFirebase");
            setFirebaseModule(module);
            setFirebaseInitialized(true);
          }
        });
        
        // If Firebase isn't loaded after 2 seconds, try direct import
        setTimeout(() => {
          if (mounted && !firebaseInitialized) {
            console.log("Using Firebase fallback initialization");
            
            // Test the authentication
            const auth = firebaseFallback.getFirebaseAuth();
            if (auth) {
              setFirebaseModule(firebaseFallback);
              setFirebaseInitialized(true);
            } else {
              // If auth is still not available and we haven't exceeded attempts
              if (initAttempts < maxAttempts) {
                initAttempts++;
                console.log(`Retrying Firebase initialization (attempt ${initAttempts}/${maxAttempts})`);
                setTimeout(initializeFirebase, 2000); // Retry after 2 seconds
              } else {
                setError("Unable to connect to authentication services. Please try again later.");
              }
            }
          }
        }, 2000);
      } catch (err) {
        console.error("Firebase initialization error:", err);
        if (mounted && initAttempts < maxAttempts) {
          initAttempts++;
          setTimeout(initializeFirebase, 2000);
        } else if (mounted) {
          setError("Unable to initialize authentication. Please try again later.");
        }
      }
    };
    
    initializeFirebase();
    
    return () => {
      mounted = false;
    };
  }, [firebaseInitialized]);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    if (!firebaseInitialized) {
      setError("Authentication services are still initializing. Please try again in a few seconds.");
      setLoading(false);
      return;
    }
    
    try {
      // Try both methods for signing up with Google
      const module = firebaseModule || firebaseFallback;
      
      if (!module) {
        throw new Error("Firebase not initialized");
      }
      
      await module.signUpWithGoogle();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Google signup error:", err);
      
      let errorMessage = "Sign up with Google failed";
      if (err.code === 'auth/configuration-not-found') {
        errorMessage = "Authentication services are temporarily unavailable. Please try again later or use email signup.";
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "Authentication popup was closed before completing the sign in process.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    
    if (!firebaseInitialized) {
      setError("Authentication services are still initializing. Please try again in a few seconds.");
      setLoading(false);
      return;
    }
    
    try {
      // Try both methods for signing up with email/password
      const module = firebaseModule || firebaseFallback;
      
      if (!module) {
        throw new Error("Firebase not initialized");
      }
      
      await module.signUp(email, password, displayName);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Email signup error:", err);
      
      let errorMessage = "Failed to create account";
      
      // Provide more user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Try signing in instead.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Use at least 6 characters with a mix of letters and numbers.";
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = "Authentication services are temporarily unavailable. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show a loading state while Firebase is initializing
  if (!firebaseInitialized && !error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 w-full">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-accent1-light/20 dark:bg-accent1-dark/20 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-accent1-light/20 dark:bg-accent1-dark/20 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-accent1-light/20 dark:bg-accent1-dark/20 rounded"></div>
              <div className="h-4 bg-accent1-light/20 dark:bg-accent1-dark/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Initializing authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full px-2 sm:px-0">
      <motion.button
        onClick={handleGoogleSignUp}
        disabled={loading || !firebaseInitialized}
        className="w-full flex items-center justify-center gap-2 py-3 bg-accent1-light dark:bg-accent1-dark text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-lg sm:text-xl">🔐</span> 
        <span className="text-sm sm:text-base">{loading ? "Signing up..." : "Sign up with Google"}</span>
      </motion.button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light dark:border-border-dark"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm">Or create account with email</span>
        </div>
      </div>
      
      <form onSubmit={handleEmailSignUp} className="space-y-3 sm:space-y-4 w-full">
        <div>
          <label htmlFor="displayName" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Name (optional)
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Email <span className="text-error-light dark:text-error-dark">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Password <span className="text-error-light dark:text-error-dark">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="Create a password (min. 6 characters)"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Confirm Password <span className="text-error-light dark:text-error-dark">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-background-light dark:bg-background-dark"
            placeholder="Confirm your password"
          />
        </div>
        
        <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
          By signing up, you agree to our <a href="/terms" className="text-primary dark:text-primary-dark hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary dark:text-primary-dark hover:underline">Privacy Policy</a>.
        </div>
        
        <motion.button
          type="submit"
          disabled={loading || !firebaseInitialized}
          className="w-full py-2.5 bg-accent1-light dark:bg-accent1-dark text-white rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base font-medium mt-2 disabled:opacity-50"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? "Creating account..." : "Create Account"}
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

// Mount to #signup-island-root if running in browser
if (typeof window !== "undefined") {
  const root = document.getElementById("signup-island-root");
  if (root) {
    import("react-dom/client").then(({ createRoot }) => {
      createRoot(root).render(<SignupIsland />);
    });
  }
} 