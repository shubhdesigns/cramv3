import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Assumes firebaseConfig in .env and already used in app initialization
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Utility to request notification permission and FCM token
export async function subscribeToPush(userId: string) {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission denied");
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.PUBLIC_FIREBASE_VAPID_KEY,
  });
  // Store in Firestore or back-end so you can message this user
  // e.g. db.collection('users').doc(userId).update({ fcmToken: token })
  return token;
}

// Listen for messages while app is in foreground
onMessage(messaging, payload => {
  // Customize: show UI cue, update streak, pop alert
  console.log("[FCM] foreground message:", payload);
});