"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

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

const LANG_META: Record<Lang, { label: string; prefix: string; full: string }> = {
  en: { label: "EN", prefix: "", full: "English" },
  hi: { label: "हिं", prefix: "/hi", full: "हिंदी" },
  mr: { label: "मरा", prefix: "/mr", full: "मराठी" },
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
 * Prominent EN / हिंदी / मराठी switcher for the top bar. Renders nothing on
 * every other route — this guide is only translated for a handful of pages
 * (see TRANSLATED_TERMS), so it only ever appears where it's actually useful.
 */
export default function LanguageSwitcher() {
  const pathname = usePathname();
  const current = pathname ? parseCurrentPage(pathname) : null;

  if (!current) return null;

  const { term, lang } = current;

  return (
    <div
      role="group"
      aria-label="Choose language for this page"
      className="flex items-center gap-0.5 pl-1.5 pr-1 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-sm shrink-0"
    >
      <GlobeAltIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      {(Object.keys(LANG_META) as Lang[]).map((l) => {
        const meta = LANG_META[l];
        const href = termPath(meta.prefix, term);
        const active = l === lang;
        return (
          <Link
            key={l}
            href={href}
            aria-current={active ? "page" : undefined}
            title={`View this page in ${meta.full}`}
            className={`px-2 py-1 rounded-full text-[12px] font-bold leading-none transition-colors ${
              active
                ? "bg-amber-500 text-white shadow-sm"
                : "text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            }`}
          >
            {meta.label}
          </Link>
        );
      })}
    </div>
  );
}
