"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("balkanworks-theme") as Theme | null;
    const initialTheme = storedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = initialTheme;
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("balkanworks-theme", nextTheme);
    setTheme(nextTheme);
  };

  return <button className="theme-toggle" type="button" aria-label={theme === "dark" ? "Uključi svetlu temu" : "Uključi tamnu temu"} onClick={toggleTheme}>{theme === "dark" ? "☀" : "◐"}</button>;
}
