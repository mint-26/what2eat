"use client";

import { useState, useEffect } from "react";
import { getTheme, toggleTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setLocal] = useState<Theme>("light");

  useEffect(() => {
    setLocal(getTheme());
  }, []);

  function onToggle() {
    const next = toggleTheme();
    setLocal(next);
    if (navigator.vibrate) navigator.vibrate(20);
  }

  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Helles Design" : "Dunkles Design"}
      className="w-9 h-9 rounded-full bg-bg-card flex items-center justify-center text-lg"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
