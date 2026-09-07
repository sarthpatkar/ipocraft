"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

// Keep this list in sync with the hi/mr route pairs under app/hi/* and
// app/mr/* — only these terms have translated pages, so the switcher stays
// hidden everywhere else instead of linking to a 404.
// "" stands for the homepage (/, /hi, /mr) — every other entry is a
// path segment shared by the English page and its /hi and /mr twins.
const TRANSLATED_TERMS = [
  "",
  "gmp",
  "allotment-status",
  "subscriptions",
  "ipo-calendar",
  "ipo-history",
  "what-is-ipo-gmp",
  "ipo-subscription-meaning",
  "qib-hni-retail-explained",
  "ipo-grey-market-guide",
  "how-ipo-allotment-works",
  "kostak-rate-meaning",
  "drhp-vs-rhp-difference",
  "ipo-cut-off-price-meaning",
  "anchor-investor-lock-in-period",
];

type Lang = "en" | "hi" | "mr";

const LANG_META: Record<Lang, { prefix: string; native: string; english: string }> = {
  en: { prefix: "", native: "English", english: "English" },
  hi: { prefix: "/hi", native: "हिंदी", english: "Hindi" },
  mr: { prefix: "/mr", native: "मराठी", english: "Marathi" },
};

function termPath(prefix: string, term: string) {
  if (!term) return prefix || "/";
  return `${prefix}/${term}`;
}

function parseCurrentPage(pathname: string): { term: string; lang: Lang } | null {
  const clean = (pathname.replace(/\/+$/, "") || "/").toLowerCase();
  for (const term of TRANSLATED_TERMS) {
    if (clean === termPath("", term)) return { term, lang: "en" };
    if (clean === termPath("/hi", term)) return { term, lang: "hi" };
    if (clean === termPath("/mr", term)) return { term, lang: "mr" };
  }
  return null;
}

/**
 * Globe icon-button in the top-bar action cluster — matches ThemeToggle's
 * button styling exactly, so it reads as one native control cluster rather
 * than a bolted-on widget. Opens a small anchored dropdown with the 3
 * language options; renders nothing on every other route (this content is
 * only translated for a handful of pages — see TRANSLATED_TERMS).
 */
export default function LanguageSwitcher() {
  const pathname = usePathname();
  const current = pathname ? parseCurrentPage(pathname) : null;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click, Escape, or route change.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  if (!current) return null;

  const { term, lang } = current;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Choose language"
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Language: ${LANG_META[lang].english}`}
        className="p-2 rounded-lg text-gray-500 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors"
      >
        <GlobeAltIcon className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choose language for this page"
          className="absolute right-0 top-full mt-2 w-40 py-1 rounded-lg bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] shadow-lg shadow-black/8 dark:shadow-black/40 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {(Object.keys(LANG_META) as Lang[]).map((l) => {
            const meta = LANG_META[l];
            const active = l === lang;
            return (
              <Link
                key={l}
                href={termPath(meta.prefix, term)}
                role="menuitem"
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-2 px-3 py-2 text-[13px] transition-colors ${
                  active
                    ? "text-[#1C317A] dark:text-[#93B4FF] font-semibold bg-[#1C317A]/5 dark:bg-[#1C317A]/15"
                    : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1A1F26] font-medium"
                }`}
              >
                {meta.native}
                {active && <CheckIcon className="w-3.5 h-3.5 shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
