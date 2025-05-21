// This file provides SSR-safe Firebase exports
// It exports dummy objects for server-side rendering
// and will be replaced with actual Firebase implementations on the client

// Dummy exports for SSR compatibility
export const auth = {};
export const db = {};
export const googleProvider = {};
export const functions = {};

// Firebase configuration - only used client-side
export const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.firebasestorage.app",
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:3a14269c8cb79afa815da6",
  measurementId: "G-CE6YC9S0WQ"
};

// Dummy functions that will be replaced at runtime in the browser
export const getFirebaseApp = () => null;
export const getFirebaseAuth = () => null;
export const getGoogleProvider = () => null;

// Auth functions - all return dummy values during SSR
export const signIn = async () => null;
export const signUp = async () => null;
export const logOut = async () => null;
export const getUser = async () => null;
export const onAuthStateChanged = (callback) => {
  return () => {};
};
export const authStateListener = (callback) => {
  return () => {};
};

// Auth functions needed by LoginFormIsland
export const signInWithEmail = async () => null;
export const signInWithProvider = async () => null;
