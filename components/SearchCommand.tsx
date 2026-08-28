"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  HomeIcon,
  ChartBarSquareIcon,
  UsersIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  ScaleIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  CalculatorIcon,
  CurrencyRupeeIcon,
  BellIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

// ─── Platform feature pages ─────────────────────────────────────────────────
type FeaturePage = {
  href: string;
  label: string;
  desc: string;
  category: string;
  Icon: React.ElementType;
  // Aliases / keywords that should also match this page
  keywords: string[];
};

const FEATURE_PAGES: FeaturePage[] = [
  // Core pages
  { href: "/", label: "Home", desc: "IPOCraft homepage", category: "Pages", Icon: HomeIcon, keywords: ["dashboard", "main", "overview", "home"] },
  { href: "/ipo", label: "IPO Directory", desc: "Open, upcoming & listed mainboard issues", category: "Pages", Icon: DocumentTextIcon, keywords: ["ipo list", "all ipo", "mainboard", "nse", "bse", "upcoming", "open ipo", "listed"] },
  { href: "/sme-ipo", label: "SME IPO Hub", desc: "BSE SME & NSE Emerge listings", category: "Pages", Icon: BuildingStorefrontIcon, keywords: ["sme", "small", "emerge", "bse sme", "nse emerge", "sme ipo"] },
  { href: "/gmp", label: "GMP Tracker", desc: "Live grey market premiums & trend", category: "Pages", Icon: ChartBarSquareIcon, keywords: ["gmp", "grey market", "grey market premium", "kostak", "live gmp", "gmp tracker"] },
  { href: "/subscriptions", label: "Live Subscriptions", desc: "QIB, NII, Retail bidding demand", category: "Pages", Icon: UsersIcon, keywords: ["subscription", "subscriptions", "bidding", "qib", "nii", "retail", "hni", "demand", "live sub", "sub data"] },
  { href: "/chat", label: "AI Chat", desc: "Ask IPO questions to our AI assistant", category: "Pages", Icon: ChatBubbleLeftRightIcon, keywords: ["ai", "chat", "ask", "assistant", "chatbot", "ipo ai", "ai chat"] },

  // Research tools
  { href: "/compare", label: "Compare IPOs", desc: "Side-by-side comparison of up to 3 IPOs", category: "Research", Icon: ScaleIcon, keywords: ["compare", "comparison", "side by side", "vs"] },
  { href: "/performance", label: "Listing Performance", desc: "Historical listing day gains & returns", category: "Research", Icon: ArrowTrendingUpIcon, keywords: ["performance", "listing", "returns", "gains", "track record", "history", "listing day", "listing gain"] },
  { href: "/ipo-calendar", label: "IPO Calendar", desc: "Schedule of open & upcoming issues", category: "Research", Icon: CalendarDaysIcon, keywords: ["calendar", "schedule", "upcoming", "dates", "timeline", "ipo date"] },

  // Calculators
  { href: "/ipo-allotment-probability-calculator", label: "Allotment Calculator", desc: "Odds of getting IPO allotment", category: "Calculators", Icon: CalculatorIcon, keywords: ["allotment", "allotment calculator", "allotment odds", "probability", "chance", "lottery", "how many lots", "allotment probability"] },
  { href: "/ipo-profit-calculator", label: "Profit Calculator", desc: "Expected net profit per lot from GMP", category: "Calculators", Icon: CurrencyRupeeIcon, keywords: ["profit", "profit calculator", "listing profit", "return", "expected", "gain", "lot profit", "how much profit"] },

  // Alerts & Verification
  { href: "/alerts", label: "Daily GMP Alerts", desc: "Morning email & Telegram digest", category: "Alerts", Icon: BellIcon, keywords: ["alerts", "notification", "email", "telegram", "morning digest", "daily alert", "subscribe", "gmp alert"] },
  { href: "/allotment-status", label: "Allotment Status", desc: "Check allotment via registrar links", category: "Alerts", Icon: CheckBadgeIcon, keywords: ["allotment status", "check allotment", "registrar", "kfin", "link intime", "did i get", "allotment check", "allotment result"] },

  // Guides
  { href: "/what-is-ipo-gmp", label: "What is IPO GMP?", desc: "Beginner guide to grey market premium", category: "Guides", Icon: BookOpenIcon, keywords: ["what is gmp", "gmp meaning", "grey market guide", "gmp explained", "grey market premium meaning"] },
  { href: "/qib-hni-retail-explained", label: "QIB vs HNI vs Retail", desc: "Investor category quotas explained", category: "Guides", Icon: UsersIcon, keywords: ["qib", "hni", "retail", "nii", "investor category", "quota", "hni ipo", "qib explained"] },
  { href: "/how-ipo-allotment-works", label: "How Allotment Works", desc: "Lottery mechanism explained", category: "Guides", Icon: BookOpenIcon, keywords: ["how allotment works", "allotment process", "lottery", "allotment explained"] },
  { href: "/ipo-subscription-meaning", label: "IPO Subscription Meaning", desc: "What subscription data means", category: "Guides", Icon: BookOpenIcon, keywords: ["subscription meaning", "what is subscription", "oversubscribed", "times subscribed"] },
  { href: "/ipo-grey-market-guide", label: "Grey Market Guide", desc: "Complete guide to IPO grey market", category: "Guides", Icon: BookOpenIcon, keywords: ["grey market guide", "gmp guide", "grey market", "grey market ipo"] },
  { href: "/methodology", label: "Data Methodology", desc: "Data sources, accuracy & disclaimer", category: "Guides", Icon: ShieldCheckIcon, keywords: ["methodology", "data source", "accuracy", "how data", "sources"] },
  { href: "/brokers", label: "Brokers Directory", desc: "Compare retail brokerage platforms", category: "Guides", Icon: BriefcaseIcon, keywords: ["broker", "brokers", "zerodha", "groww", "upstox", "angel", "platform", "demat", "brokerage"] },
];

// Category icon colours for the badge
const CATEGORY_COLORS: Record<string, string> = {
  Pages:       "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
  Research:    "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40",
  Calculators: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
  Alerts:      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40",
  Guides:      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40",
  IPO:         "text-[#1C317A] dark:text-[#93B4FF] bg-[#1C317A]/10 dark:bg-[#1C317A]/20",
};

type SearchResult =
  | { kind: "ipo"; id: number; slug: string; name: string; gmp: number | null; price_max: number | null; price_min: number | null; status: string | null; ipo_type: string | null; exchange?: string | null }
  | { kind: "feature"; href: string; label: string; desc: string; category: string; Icon: React.ElementType };

// ─── Fuzzy / relevance scorer ────────────────────────────────────────────────
function scoreFeature(page: FeaturePage, q: string): number {
  const ql = q.toLowerCase().trim();
  if (!ql) return 0;
  const labelL = page.label.toLowerCase();
  const descL = page.desc.toLowerCase();

  // Exact label match → highest
  if (labelL === ql) return 100;
  // Label starts with query
  if (labelL.startsWith(ql)) return 90;
  // Label contains query word
  if (labelL.includes(ql)) return 80;
  // Keyword exact match
  if (page.keywords.some((k) => k === ql)) return 85;
  // Keyword starts-with
  if (page.keywords.some((k) => k.startsWith(ql))) return 75;
  // Keyword contains
  if (page.keywords.some((k) => k.includes(ql))) return 65;
  // Desc match
  if (descL.includes(ql)) return 50;
  // Word-level partial — any word in label matches
  if (ql.split(" ").some((w) => w.length > 2 && labelL.includes(w))) return 40;
  // Word-level partial on keywords
  if (ql.split(" ").some((w) => w.length > 2 && page.keywords.some((k) => k.includes(w)))) return 30;

  return 0;
}

const RECENT_KEY = "ipocraft_recent_searches";
function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}
function saveRecent(q: string) {
  try {
    const prev = loadRecent().filter((r) => r !== q);
    localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 5)));
  } catch {}
}

export default function SearchCommand({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [ipoResults, setIpoResults] = useState<SearchResult[]>([]);
  const [featureResults, setFeatureResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const allResults: SearchResult[] = [...featureResults, ...ipoResults];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery("");
      setIpoResults([]);
      setFeatureResults([]);
      setActiveIndex(0);
      setRecent(loadRecent());
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ─── Search logic ─────────────────────────────────────────────────────────
  const search = useCallback(async (q: string) => {
    const ql = q.trim();
    if (!ql || ql.length < 1) {
      setIpoResults([]);
      setFeatureResults([]);
      return;
    }

    // Feature pages — instant, client-side
    const scored = FEATURE_PAGES
      .map((p) => ({ p, score: scoreFeature(p, ql) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ p }) => ({ kind: "feature" as const, href: p.href, label: p.label, desc: p.desc, category: p.category, Icon: p.Icon }));

    setFeatureResults(scored);

    // IPO API search — async
    setLoading(true);
    try {
      const res = await fetch(`/api/ipos?q=${encodeURIComponent(ql)}&limit=6`);
      const data = await res.json();
      const ipos: SearchResult[] = (data.items ?? []).map((ipo: any) => ({ kind: "ipo" as const, ...ipo }));
      setIpoResults(ipos);
      setActiveIndex(0);
    } catch {
      setIpoResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 180);
  };

  const navigateTo = (result: SearchResult) => {
    if (query.trim()) saveRecent(query.trim());
    onClose();
    const href = result.kind === "ipo" ? `/ipo/${result.slug}` : result.href;
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allResults[activeIndex]) navigateTo(allResults[activeIndex]);
    }
  };

  const handleRecentClick = (r: string) => {
    setQuery(r);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    search(r);
  };

  if (!open) return null;

  const showEmpty = query.length > 1 && !loading && allResults.length === 0;
  const showResults = allResults.length > 0;
  const showIdle = query.length === 0;

  // Index offset between feature + ipo results
  const featureCount = featureResults.length;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-3 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden bg-white/95 dark:bg-[#0E1217]/95 border border-gray-200/90 dark:border-[#252A31] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">

        {/* ── Input Header ── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200/80 dark:border-[#202630]">
          <MagnifyingGlassIcon className="w-5 h-5 shrink-0 text-gray-400 dark:text-[#6B7280]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Search IPOs, GMP, allotment, tools, guides…"
            className="flex-1 bg-transparent text-[15px] outline-none text-gray-900 dark:text-[#F1F5F9] placeholder-gray-400 dark:placeholder-[#5A6070] font-normal"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-[#1C317A] dark:border-[#93B4FF] border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          {query && (
            <button
              onClick={() => { setQuery(""); setIpoResults([]); setFeatureResults([]); inputRef.current?.focus(); }}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors"
              title="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-[#252A31]">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-[#6B7280] border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#14181F] rounded">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors"
              aria-label="Close search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Idle state: Quick suggestions & Navigation ── */}
        {showIdle && (
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Quick suggested searches */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#6B7280] mb-2 flex items-center gap-1.5">
                <Squares2X2Icon className="w-3.5 h-3.5" />
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Live GMP", q: "gmp" },
                  { label: "Mainboard IPOs", q: "mainboard" },
                  { label: "SME IPOs", q: "sme" },
                  { label: "Allotment Calculator", q: "allotment calculator" },
                  { label: "Live Subscriptions", q: "subscriptions" },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleRecentClick(tag.q)}
                    className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/70 dark:bg-[#14181F] text-[12px] text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#1A202A] hover:border-gray-300 dark:hover:border-[#3A4250] transition-colors"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {recent.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#6B7280] mb-2 flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5" />
                  Recent
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRecentClick(r)}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#252A31] text-[11.5px] text-gray-600 dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#1A1F26] transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#6B7280] mb-2">
                Quick Navigation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {FEATURE_PAGES.slice(0, 6).map((item) => {
                  const Ic = item.Icon;
                  const color = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.Pages;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-[#252A31] hover:bg-gray-50 dark:hover:bg-[#14181F] transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Ic className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-gray-800 dark:text-[#F1F5F9] group-hover:text-[#1C317A] dark:group-hover:text-[#93B4FF] truncate transition-colors">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-[#6B7280] truncate">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {showResults && (
          <div className="max-h-[440px] overflow-y-auto divide-y divide-gray-100 dark:divide-[#1C222B] p-1.5">
            {/* Feature results */}
            {featureResults.length > 0 && (
              <div className="py-1">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#6B7280]">
                  Features & Tools
                </p>
                <div className="space-y-0.5">
                  {featureResults.map((r, i) => {
                    if (r.kind !== "feature") return null;
                    const Ic = r.Icon;
                    const color = CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS.Pages;
                    const isAct = i === activeIndex;
                    return (
                      <button
                        key={r.href}
                        onClick={() => navigateTo(r)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isAct ? "bg-[#1C317A]/5 dark:bg-[#1C317A]/15 border border-[#1C317A]/20 dark:border-[#3D5BA9]/30" : "border border-transparent hover:bg-gray-50 dark:hover:bg-[#14181F]"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                          <Ic className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 dark:text-[#F1F5F9] truncate">{r.label}</p>
                          <p className="text-[11px] text-gray-500 dark:text-[#9AA1AA] truncate">{r.desc}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${color} shrink-0`}>{r.category}</span>
                        <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400 dark:text-[#6B7280] shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* IPO results */}
            {ipoResults.length > 0 && (
              <div className="py-1">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#6B7280]">
                  IPOs
                </p>
                <div className="space-y-0.5">
                  {ipoResults.map((r, i) => {
                    if (r.kind !== "ipo") return null;
                    const globalIdx = featureCount + i;
                    const isAct = globalIdx === activeIndex;
                    const price = Number(r.price_max ?? r.price_min ?? 0);
                    const gmp = r.gmp != null ? Number(r.gmp) : null;
                    const gmpPct = gmp != null && price > 0 ? ((gmp / price) * 100).toFixed(1) : null;
                    const isPositive = gmp != null && gmp >= 0;
                    const segment = r.ipo_type?.toLowerCase() === "sme"
                      ? (r.exchange ? `${r.exchange} SME` : "SME")
                      : "Mainboard";
                    return (
                      <button
                        key={r.id}
                        onClick={() => navigateTo(r)}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isAct ? "bg-[#1C317A]/5 dark:bg-[#1C317A]/15 border border-[#1C317A]/20 dark:border-[#3D5BA9]/30" : "border border-transparent hover:bg-gray-50 dark:hover:bg-[#14181F]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${CATEGORY_COLORS.IPO}`}>
                            <DocumentTextIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-gray-900 dark:text-[#F1F5F9] truncate">{r.name}</p>
                            <p className="text-[11px] text-gray-500 dark:text-[#9AA1AA]">{segment} · {r.status ?? "Upcoming"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          {gmp != null ? (
                            <div className="text-right">
                              <span className={`text-[12.5px] font-bold tabular-nums block ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                {isPositive ? "+" : ""}₹{gmp}
                              </span>
                              {gmpPct && (
                                <span className="text-[10px] text-gray-400 dark:text-[#6B7280] tabular-nums font-medium">({isPositive ? "+" : ""}{gmpPct}%)</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-[#6B7280]">–</span>
                          )}
                          <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400 dark:text-[#6B7280]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {showEmpty && (
          <div className="px-6 py-10 text-center">
            <MagnifyingGlassIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-[#3A4050] mb-3" />
            <p className="text-[14px] font-medium text-gray-600 dark:text-[#9AA1AA]">
              No results for &ldquo;<span className="text-gray-900 dark:text-[#F1F5F9]">{query}</span>&rdquo;
            </p>
            <p className="text-[12px] text-gray-400 dark:text-[#6B7280] mt-1">
              Try searching for an IPO name, GMP, allotment, or subscription multiple.
            </p>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-[#1E2329] bg-gray-50/80 dark:bg-[#0C0F14]/60 text-[11px] text-gray-400 dark:text-[#6B7280]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[10px] font-mono">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[10px] font-mono">↵</kbd> select</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[10px] font-mono">Esc</kbd> close</span>
          </div>
          <span className="hidden sm:block text-[10.5px]">IPOCraft Search</span>
        </div>
      </div>
    </div>
  );
}
