// This file contains the actual Firebase implementation for client-side use
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.firebasestorage.app",
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:3a14269c8cb79afa815da6",
  measurementId: "G-CE6YC9S0WQ"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // Handle initialization errors
  console.error("Firebase initialization error:", error);
}

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

// Helper functions
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth;
export const getGoogleProvider = () => googleProvider;

// Auth functions
export const signInWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithProvider = async (provider) => {
  return signInWithPopup(auth, provider);
};

export const signIn = signInWithEmail;
export const signUp = async (email, password) => {
  // Implement sign up logic
};

export const logOut = async () => {
  return auth.signOut();
};

export const getUser = () => {
  return auth.currentUser;
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export const authStateListener = (callback) => {
  return auth.onAuthStateChanged(callback);
};
