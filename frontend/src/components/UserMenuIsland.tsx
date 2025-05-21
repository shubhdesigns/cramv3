import React, { useEffect, useState } from "react";
import { useFirebase } from "../firebase/init";
// Remove react-router-dom import

// Define types for Firebase auth
type User = {
  email: string | null;
  uid: string;
};

type FirebaseModule = {
  auth: any;
  firebaseAuth: any;
};

import { Button } from "./UI/Button";

export default function UserMenuIsland() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseModule, setFirebaseModule] = useState<FirebaseModule | null>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module: any) => {
      setFirebaseModule(module);
      
      // Set up auth state listener once Firebase is loaded
      if (module && module.auth) {
        const unsub = module.auth.onAuthStateChanged((currentUser: User | null) => {
          setUser(currentUser);
        });
        return () => unsub();
      }
    });
  }, []);

  async function handleLogout() {
    if (firebaseModule && firebaseModule.auth) {
      await firebaseModule.firebaseAuth.signOut(firebaseModule.auth);
      window.location.href = "/";
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-200">{user.email}</span>
        <Button size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <a href="/login" className="text-blue-600 hover:underline">Login</a>
      <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
    </div>
  );
}

// Mount to #user-menu-root if running in browser
if (typeof window !== "undefined") {
  const root = document.getElementById("user-menu-root");
  if (root) {
    import("react-dom/client").then(({ createRoot }) => {
      createRoot(root).render(<UserMenuIsland />);
    });
  }
} 