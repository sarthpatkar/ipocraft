"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "gmp", label: "GMP" },
  { id: "timeline", label: "Timeline" },
  { id: "quick-facts", label: "Quick Facts" },
  { id: "financials", label: "Financials" },
  { id: "subscription", label: "Subscription" },
  { id: "about", label: "About" },
  { id: "strengths", label: "Strengths & Risks" },
];

export default function JumpNav() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visibleSections = SECTIONS.filter(({ id }) =>
    typeof document !== "undefined" ? !!document.getElementById(id) : true
  );

  return (
    <>
      {/* Desktop sticky sidebar nav */}
      <nav
        className="hidden lg:flex flex-col gap-1 sticky top-24 text-[13px]"
        aria-label="On this page"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
          On this page
        </p>
        {visibleSections.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className="px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-150"
              style={{
                color: active ? "var(--brand-600)" : "var(--text-muted)",
                backgroundColor: active ? "var(--brand-50)" : "transparent",
                borderLeft: active ? "2px solid var(--brand-500)" : "2px solid transparent",
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {/* Mobile horizontal pill strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
        {visibleSections.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 px-3 py-1 rounded-full text-[11.5px] font-medium border transition-all"
              style={{
                color: active ? "var(--brand-600)" : "var(--text-muted)",
                borderColor: active ? "var(--brand-500)" : "var(--border)",
                backgroundColor: active ? "var(--brand-50)" : "var(--card-bg)",
              }}
            >
              {label}
            </a>
          );
        })}
      </div>
    </>
  );
}
