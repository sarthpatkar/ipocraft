"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 ${className}`}
    >
      {!mounted ? (
        <span className="w-5 h-5 block" />
      ) : theme === "dark" ? (
        <SunIcon className="w-5 h-5 text-amber-400" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}

