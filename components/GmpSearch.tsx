"use client";

import { useState, useRef } from "react";

export default function GmpSearch() {
  const [value, setValue] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  function highlightText(element: HTMLElement, query: string) {
    const text = element.textContent || "";

    if (!query) {
      element.innerHTML = text;
      return;
    }

    const regex = new RegExp(`(${query})`, "gi");
    const highlighted = text.replace(
      regex,
      `<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>`
    );

    element.innerHTML = highlighted;
  }

  function runSearch(v: string) {
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const el = row as HTMLElement;
      const text = el.textContent?.toLowerCase() || "";

      const visible = text.includes(v);
      el.style.display = visible ? "" : "none";

      if (visible) {
        highlightText(el, v);
      }
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.toLowerCase();
    setValue(v);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      runSearch(v);
    }, 250); // debounce delay
  }

  return (
    <div className="mb-3">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search IPO..."
        className="w-full sm:w-72 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  );
}