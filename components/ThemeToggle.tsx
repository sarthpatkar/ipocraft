"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2 rounded-lg text-gray-500 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors ${className}`}
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

