// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC06t9ZPyS8k75bo0Rd4SR4RnIJb77jGIc",
  authDomain: "cramtime-study.firebaseapp.com",
  projectId: "cramtime-study",
  storageBucket: "cramtime-study.firebasestorage.app",
  messagingSenderId: "595660764499",
  appId: "1:595660764499:web:afbc7d9c61a9e638815da6",
  measurementId: "G-9SGSVEPQV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 