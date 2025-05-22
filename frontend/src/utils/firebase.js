// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.appspot.com",
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:3a14269c8cb79afa815da6",
  measurementId: "G-CE6YC9S0WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
let analytics;
try {
  // Analytics might fail in SSR context
  analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
} catch (error) {
  console.error('Analytics error:', error);
  analytics = null;
}

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Export all services
export { app, analytics, auth, db, functions }; 