"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a horizontally-scrollable container (e.g. a wide table) and shows a
 * small "Swipe →" affordance + edge fade on mobile until the user's first
 * horizontal scroll — these tables had overflow-x-auto with zero visual hint
 * that there was more content off-screen.
 */
export default function ScrollHint({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const evaluate = () => {
      const scrollable = el.scrollWidth > el.clientWidth + 4;
      setShowHint(scrollable && el.scrollLeft < 4);
    };

    evaluate();
    const onScroll = () => {
      if (el.scrollLeft > 4) setShowHint(false);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", evaluate);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className={className}>
        {children}
      </div>
      {showHint && (
        <>
          <div className="sm:hidden pointer-events-none absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#111418] to-transparent" />
          <span className="sm:hidden pointer-events-none absolute bottom-2 right-2 text-[10px] font-medium text-gray-500 dark:text-[#9AA1AA] bg-white/95 dark:bg-[#111418]/95 border border-gray-200 dark:border-[#252A31] px-1.5 py-0.5 rounded shadow-xs">
            Swipe →
          </span>
        </>
      )}
    </div>
  );
}
