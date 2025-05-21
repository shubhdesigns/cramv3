import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.appspot.com",
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:afbc7d9c61a9e638815da6",
  measurementId: "G-9SGSVEPQV1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, analytics, auth, db, storage, functions }; 