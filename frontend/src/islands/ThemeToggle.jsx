import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [dark]);
  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      onClick={() => setDark((v) => !v)}
      type="button"
    >
      {dark ? "🌒 Dark" : "☀️ Light"}
    </button>
  );
}