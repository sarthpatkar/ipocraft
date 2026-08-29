"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  HomeIcon,
  UsersIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  CalculatorIcon,
  CurrencyRupeeIcon,
  BellIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ChartBarSquareIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ChartBarSquareIcon as ChartBarSquareIconSolid,
} from "@heroicons/react/24/solid";
import ThemeToggle from "@/components/ThemeToggle";
import SearchCommand from "@/components/SearchCommand";
import OpenIpoTicker from "@/components/OpenIpoTicker";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type LinkItem = {
  href: string;
  label: string;
  Icon: React.ElementType;
  ActiveIcon: React.ElementType;
};

const BOTTOM_TABS: LinkItem[] = [
  { href: "/", label: "Home", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/ipo", label: "IPO", Icon: DocumentTextIcon, ActiveIcon: DocumentTextIconSolid },
  { href: "/gmp", label: "GMP", Icon: ChartBarSquareIcon, ActiveIcon: ChartBarSquareIconSolid },
  { href: "/subscriptions", label: "Subs", Icon: UsersIcon, ActiveIcon: UsersIconSolid },
];

export const TOOLS_CATEGORIES = [
  {
    category: "Research & Analysis",
    color: "blue",
    links: [
      { href: "/compare", label: "Compare IPOs", Icon: ScaleIcon, desc: "Side-by-side comparison" },
      { href: "/performance", label: "Listing Track Record", Icon: ArrowTrendingUpIcon, desc: "Historical listing gains" },
      { href: "/ipo-history", label: "IPO History Archive", Icon: ClockIcon, desc: "Browse past IPOs by year" },
      { href: "/ipo-calendar", label: "IPO Calendar", Icon: CalendarDaysIcon, desc: "Open & upcoming schedule" },
      { href: "/sme-ipo", label: "SME IPO Hub", Icon: BuildingStorefrontIcon, desc: "BSE SME & NSE Emerge" },
    ],
  },
  {
    category: "Calculators",
    color: "emerald",
    links: [
      { href: "/ipo-allotment-probability-calculator", label: "Allotment Calculator", Icon: CalculatorIcon, desc: "Lottery odds model" },
      { href: "/ipo-profit-calculator", label: "Profit Calculator", Icon: CurrencyRupeeIcon, desc: "Net listing profit per lot" },
    ],
  },
  {
    category: "Alerts & Verification",
    color: "orange",
    links: [
      { href: "/alerts", label: "Daily GMP Alerts", Icon: BellIcon, desc: "Morning digest via email" },
      { href: "/allotment-status", label: "Allotment Status", Icon: CheckBadgeIcon, desc: "Registrar verification links" },
    ],
  },
  {
    category: "Guides & Education",
    color: "purple",
    links: [
      { href: "/what-is-ipo-gmp", label: "What is GMP?", Icon: BookOpenIcon, desc: "Grey market premium guide" },
      { href: "/qib-hni-retail-explained", label: "Investor Categories", Icon: UsersIcon, desc: "QIB, NII, Retail quotas" },
      { href: "/methodology", label: "Data Methodology", Icon: ShieldCheckIcon, desc: "Sources & disclaimer" },
      { href: "/brokers", label: "Brokers Directory", Icon: BriefcaseIcon, desc: "Compare platforms" },
    ],
  },
];

const ALL_TOOLS_FLAT = TOOLS_CATEGORIES.flatMap((c) => c.links);

const COLOR_MAP: Record<string, { icon: string; badge: string }> = {
  blue:    { icon: "text-blue-600 dark:text-blue-400",    badge: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50" },
  emerald: { icon: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50" },
  orange:  { icon: "text-orange-600 dark:text-orange-400",  badge: "bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50" },
  purple:  { icon: "text-purple-600 dark:text-purple-400",  badge: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50" },
};

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };
  const isToolsActive = () => ALL_TOOLS_FLAT.some((l) => isActive(l.href));

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close tools on route change
  useEffect(() => { setToolsOpen(false); }, [pathname]);

  // Trap scroll when sheet open
  useEffect(() => {
    if (toolsOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [toolsOpen]);

  return (
    <>
      {/* ══════════════ TOP BAR ══════════════ */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "border-b border-gray-200/90 dark:border-[#222731] shadow-xs"
            : "border-b border-gray-200/60 dark:border-[#1F242C]"
        } bg-white dark:bg-[#090B0F] relative`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-2 sm:gap-3">
            {/* Brand Logo + (page-specific) Language Switcher */}
            <div className="flex items-center gap-2 min-w-0">
              <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-none" aria-label="IPOCraft Home">
                <Image src="/logo-light.png" alt="IPOCraft Logo" width={120} height={36} priority className="h-8 w-auto object-contain dark:hidden" />
                <Image src="/logo-dark.png" alt="IPOCraft Logo" width={120} height={36} priority className="h-8 w-auto object-contain hidden dark:block" />
              </Link>
              <LanguageSwitcher />
            </div>

            {/* Right Action Cluster: Search + Theme + IPO History + AI Chat */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              {/* Modern Command Search Bar Trigger */}
              <button
                id="global-search-trigger"
                onClick={() => setSearchOpen(true)}
                className="group flex items-center justify-between gap-2.5 px-2.5 sm:px-3 h-8.5 rounded-lg text-[13px] text-gray-500 dark:text-[#9AA1AA] bg-gray-100/70 dark:bg-[#14181F] border border-gray-200/80 dark:border-[#222731] hover:border-gray-300 dark:hover:border-[#384152] hover:bg-gray-100 dark:hover:bg-[#181D26] transition-all shrink-0 sm:w-60 md:w-72"
                aria-label="Search"
                title="Search (⌘K)"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MagnifyingGlassIcon className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-[#6B7280] group-hover:text-gray-600 dark:group-hover:text-[#CBD5E1] transition-colors" />
                  <span className="hidden sm:inline truncate text-[12px] text-gray-400 dark:text-[#6B7280]">
                    Search IPOs, GMP, Tools...
                  </span>
                  {/* Below ~400px there isn't room for icon + label on every
                      button in this cluster — drop to icon-only search there
                      rather than let the row overflow. */}
                  <span className="hidden min-[400px]:inline sm:hidden text-[12px] font-medium">Search</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#1E242E] border border-gray-200/90 dark:border-[#2A3342] text-gray-500 dark:text-[#8E97A6] rounded font-mono font-semibold shadow-2xs shrink-0">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Switcher */}
              <ThemeToggle />

              {/* IPO History Link — icon always visible, label collapses on the
                  narrowest screens (same pattern as AI Chat below) rather than
                  disappearing entirely. */}
              <Link
                href="/ipo-history"
                title="IPO History Archive"
                aria-label="IPO History Archive"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors shrink-0 ${
                  isActive("/ipo-history")
                    ? "text-[#1C317A] dark:text-[#93B4FF] bg-[#1C317A]/10 dark:bg-[#1C317A]/20 font-semibold"
                    : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1A1F26] font-medium"
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <span className="hidden min-[400px]:inline">IPO</span>
              </Link>

              {/* AI Chat Link */}
              <Link
                href="/chat"
                title="IPO Research Assistant"
                aria-label="Open AI Chat"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors shrink-0 ${
                  isActive("/chat")
                    ? "text-[#1C317A] dark:text-[#93B4FF] bg-[#1C317A]/10 dark:bg-[#1C317A]/20 font-semibold"
                    : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1A1F26] font-medium"
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span className="hidden min-[400px]:inline">AI Chat</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Seamless Embedded Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#1C317A] dark:bg-[#3D5BA9] transition-all duration-75 z-30 pointer-events-none"
          style={{ width: `${scrollProgress}%` }}
        />

        <OpenIpoTicker />
      </header>

      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ══════════════ FLOATING BOTTOM NAV — ALL SCREENS ══════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-[max(env(safe-area-inset-bottom),1.25rem)] px-2 sm:px-3 pointer-events-none">
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] shadow-lg shadow-black/8 dark:shadow-black/40 max-w-full overflow-x-auto"
      >
        <div className="flex items-center gap-0.5">
          {BOTTOM_TABS.map(({ href, label, Icon, ActiveIcon }) => {
            const active = isActive(href);
            const Ic = active ? ActiveIcon : Icon;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className={`
                  group relative flex items-center gap-1 sm:gap-1.5
                  px-2 xs:px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11.5px] xs:text-[12px] sm:text-[13px] font-medium
                  transition-all duration-150 select-none whitespace-nowrap
                  ${active
                    ? "bg-[#1C317A] text-white shadow-sm"
                    : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100/80 dark:hover:bg-[#1A1F26]"
                  }
                `}
              >
                <Ic className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-4 sm:h-5 bg-gray-200/80 dark:bg-[#252A31] mx-0.5 sm:mx-1 shrink-0" />

          {/* Tools button */}
          <button
            id="tools-nav-btn"
            onClick={() => setToolsOpen(true)}
            aria-label="Open Tools"
            title="Tools"
            className={`
              group flex items-center gap-1 sm:gap-1.5
              px-2 xs:px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11.5px] xs:text-[12px] sm:text-[13px] font-medium
              transition-all duration-150 select-none whitespace-nowrap
              ${isToolsActive()
                ? "bg-[#1C317A] text-white shadow-sm"
                : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-100/80 dark:hover:bg-[#1A1F26]"
              }
            `}
          >
            <WrenchScrewdriverIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Tools</span>
          </button>
        </div>
      </nav>
      </div>

      {/* ══════════════ TOOLS SHEET ══════════════ */}
      {toolsOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setToolsOpen(false)}
          />

          {/* Sheet */}
          <div
            ref={sheetRef}
            className="fixed bottom-0 inset-x-0 z-[70] animate-in slide-in-from-bottom duration-300 ease-out"
          >
            <div className="relative bg-white dark:bg-[#111418] rounded-t-xl border-t border-gray-200 dark:border-[#252A31] shadow-lg">
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-8 h-1 rounded-full bg-gray-300 dark:bg-[#3A4050]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-2 pb-3 shrink-0">
                <span className="text-[13px] font-bold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                  Tools &amp; Features
                </span>
                <button
                  onClick={() => setToolsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 dark:text-[#9AA1AA] hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* ── Launcher grid ── */}
              <div className="px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] space-y-4">
                {TOOLS_CATEGORIES.map((cat) => {
                  const colors = COLOR_MAP[cat.color] ?? COLOR_MAP.blue;
                  return (
                    <div key={cat.category}>
                      {/* Category row */}
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${colors.icon.replace("text-", "bg-").split(" ")[0]}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${colors.icon.split(" ")[0]}`}>
                          {cat.category}
                        </span>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-[#1E2329]" />
                      </div>

                      {/* 5-col icon launcher */}
                      <div className="grid grid-cols-5 gap-x-1 gap-y-0.5">
                        {cat.links.map((link) => {
                          const Ic = link.Icon;
                          const active = isActive(link.href);
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setToolsOpen(false)}
                              className="group flex flex-col items-center gap-1.5 px-1 py-2.5 rounded-xl transition-colors hover:bg-gray-100/70 dark:hover:bg-[#1A1F26]/80 active:scale-95"
                            >
                              {/* Icon circle */}
                              <div className={`
                                w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-150
                                ${active
                                  ? `${colors.badge} ring-1 ${colors.icon.replace("text-", "ring-").split(" ")[0]}/30`
                                  : "bg-gray-100 dark:bg-[#1A1F26] group-hover:bg-gray-200/80 dark:group-hover:bg-[#252A31]"
                                }
                              `}>
                                <Ic className={`w-5 h-5 transition-colors ${active ? colors.icon.split(" ")[0] : "text-gray-500 dark:text-[#9AA1AA] group-hover:text-gray-700 dark:group-hover:text-[#C8D0DC]"}`} />
                              </div>
                              {/* Label */}
                              <span className={`text-center text-[9.5px] leading-tight line-clamp-2 w-full px-0.5 transition-colors ${
                                active
                                  ? `font-semibold ${colors.icon.split(" ")[0]}`
                                  : "text-gray-600 dark:text-[#9AA1AA] group-hover:text-[#0f172a] dark:group-hover:text-[#E2E8F0] font-medium"
                              }`}>
                                {link.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
