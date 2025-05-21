// This file contains the actual Firebase implementation for client-side use
import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import * as firebaseFunctions from 'firebase/functions';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.appspot.com", // Ensure correct format with appspot.com
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:3a14269c8cb79afa815da6",
  measurementId: "G-CE6YC9S0WQ"
};

// Initialize Firebase with proper error handling
let app;
let auth;
let db;
let functions;

try {
  app = initializeApp(firebaseConfig);
  auth = firebaseAuth.getAuth(app);
  db = firestore.getFirestore(app);
  functions = firebaseFunctions.getFunctions(app);
  
  // Verify authentication is working
  auth.onAuthStateChanged(() => {
    console.log("Firebase Auth initialized successfully");
  }, (error) => {
    console.error("Firebase Auth error:", error);
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export Firebase modules
export { firebaseAuth, firestore, firebaseFunctions };

// Export Firebase services - with fallbacks to prevent null reference errors
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth || (app && firebaseAuth.getAuth(app));
export const getGoogleProvider = () => new firebaseAuth.GoogleAuthProvider();

// Export initialized services directly
export { app, auth, db, functions };
export const googleProvider = new firebaseAuth.GoogleAuthProvider();

// Auth functions with safeguards
export const signInWithEmail = async (email, password) => {
  const authInstance = getFirebaseAuth();
  if (!authInstance) throw new Error("Firebase auth not initialized");
  return firebaseAuth.signInWithEmailAndPassword(authInstance, email, password);
};

export const signInWithProvider = async (provider) => {
  const authInstance = getFirebaseAuth();
  if (!authInstance) throw new Error("Firebase auth not initialized");
  return firebaseAuth.signInWithPopup(authInstance, provider);
};

export const signIn = signInWithEmail;

// Complete implementation of signUp function
export const signUp = async (email, password, displayName = '') => {
  try {
    const authInstance = getFirebaseAuth();
    if (!authInstance) throw new Error("Firebase auth not initialized");
    
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;
    
    // Update profile with display name if provided
    if (displayName) {
      await firebaseAuth.updateProfile(user, { displayName });
    }
    
    // Create user document in Firestore
    if (db) {
      await firestore.setDoc(firestore.doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || user.email.split('@')[0],
        createdAt: new Date().toISOString(),
        role: 'student',
        lastLogin: new Date().toISOString()
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

// Sign up with Google - creates Firestore user document
export const signUpWithGoogle = async () => {
  try {
    const authInstance = getFirebaseAuth();
    if (!authInstance) throw new Error("Firebase auth not initialized");
    
    const result = await firebaseAuth.signInWithPopup(authInstance, googleProvider);
    const user = result.user;
    
    // Check if this is a new user or returning user
    // Create/update user document in Firestore
    if (db) {
      await firestore.setDoc(firestore.doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        role: 'student'
      }, { merge: true });
    }
    
    return result;
  } catch (error) {
    console.error("Error during Google sign up:", error);
    throw error;
  }
};

export const logOut = async () => {
  const authInstance = getFirebaseAuth();
  if (!authInstance) throw new Error("Firebase auth not initialized");
  return authInstance.signOut();
};

export const getUser = () => {
  const authInstance = getFirebaseAuth();
  return authInstance ? authInstance.currentUser : null;
};

export const onAuthStateChanged = (callback) => {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    console.error("Firebase auth not initialized");
    return () => {};
  }
  return authInstance.onAuthStateChanged(callback);
};

export const authStateListener = onAuthStateChanged;

// Password reset function
export const resetPassword = async (email) => {
  try {
    const authInstance = getFirebaseAuth();
    if (!authInstance) throw new Error("Firebase auth not initialized");
    
    await firebaseAuth.sendPasswordResetEmail(authInstance, email);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
