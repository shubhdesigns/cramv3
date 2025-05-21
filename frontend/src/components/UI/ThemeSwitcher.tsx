import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
    } else if (systemPrefersDark) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    // Update document class and save preference
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-2xl bg-surface-light dark:bg-surface-dark hover:bg-accent2-light dark:hover:bg-accent2-dark transition-colors shadow-md border border-border-light dark:border-border-dark"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-accent1-light" />
      ) : (
        <Sun className="w-5 h-5 text-accent2-dark" />
      )}
    </motion.button>
  );
};

export default ThemeSwitcher;