import React, { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeOptions() {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem("theme") as Theme) || "system"
  );

  useEffect(() => {
    let resolved: Theme = theme;
    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <fieldset className="flex gap-3 mt-2" aria-label="Choose theme">
      <legend className="sr-only">Theme options</legend>
      {(["system", "light", "dark"] as Theme[]).map(v => (
        <label key={v} className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value={v}
            checked={theme === v}
            onChange={() => setTheme(v)}
            className="accent-blue-700"
            aria-checked={theme === v}
            aria-label={v.charAt(0).toUpperCase() + v.slice(1) + " theme"}
          />
          {v === "system" ? "System" : v.charAt(0).toUpperCase() + v.slice(1)}
        </label>
      ))}
    </fieldset>
  );
}