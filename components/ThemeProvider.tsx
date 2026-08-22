"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  mounted: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme = t;
    if (t === "dark") {
      document.body.style.backgroundColor = "#0a0f1a";
      document.body.style.color = "#f1f5f9";
    } else {
      document.body.style.backgroundColor = "#f8fafc";
      document.body.style.color = "#0f172a";
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("ipocraft-theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme: Theme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("ipocraft-theme");
    if (stored) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      applyTheme(newTheme);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("ipocraft-theme", next);
      applyTheme(next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
