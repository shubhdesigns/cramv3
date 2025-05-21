import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.firebasestorage.app",
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:3a14269c8cb79afa815da6",
  measurementId: "G-CE6YC9S0WQ"
};

// Initialize Firebase only in client-side environment to avoid SSR issues
let app, auth, googleProvider;

// Detect if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Dummy exports for SSR
const dummyAuth = {};
const dummyProvider = {};

// Initialize Firebase only in browser
if (isBrowser) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Export Firebase auth instance for components
export const authInstance = auth || dummyAuth;
export const googleProviderInstance = googleProvider || dummyProvider;
export { googleProvider }; // Export googleProvider directly

// Export auth utilities
export const signInWithProvider = async (provider) => {
  if (!isBrowser || !auth || !provider) return null;
  return signInWithPopup(auth, provider);
};

export const signInWithEmail = async (email, password) => {
  if (!isBrowser || !auth) return null;
  return signInWithEmailAndPassword(auth, email, password);
};

// Add signup/login helpers as needed