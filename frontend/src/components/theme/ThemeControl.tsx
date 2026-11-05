"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeControl() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("urban-pulse-theme");
    const initial: Theme = saved === "light" ? "light" : "dark";

    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    setReady(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("urban-pulse-theme", next);
  }

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="up-theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} appearance`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} appearance`}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
