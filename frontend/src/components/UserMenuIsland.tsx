import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Button } from "./UI/Button";
import { useNavigate } from "react-router-dom";

export default function UserMenuIsland() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, [auth]);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
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