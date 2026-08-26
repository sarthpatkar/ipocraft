"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
} from "react";
import { 
  HomeIcon, 
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  CalculatorIcon,
  CurrencyRupeeIcon,
  DocumentMagnifyingGlassIcon,
  BellIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid, 
  ChartBarIcon as ChartBarIconSolid,
  BuildingStorefrontIcon as BuildingStorefrontIconSolid,
  UsersIcon as UsersIconSolid,
} from "@heroicons/react/24/solid";
import ThemeToggle from "@/components/ThemeToggle";
import SearchCommand from "@/components/SearchCommand";
import OpenIpoTicker from "@/components/OpenIpoTicker";

type LinkItem = { 
  href: string; 
  label: string; 
  Icon: React.ElementType; 
  ActiveIcon: React.ElementType; 
};

// 5 Ergonomic Mobile Bottom Tabs (No redundant chat tab, as floating bubble exists)
const MOBILE_BOTTOM_TABS: LinkItem[] = [
  { href: "/", label: "Home", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/gmp", label: "GMP", Icon: ChartBarIcon, ActiveIcon: ChartBarIconSolid },
  { href: "/sme-ipo", label: "SME", Icon: BuildingStorefrontIcon, ActiveIcon: BuildingStorefrontIconSolid },
  { href: "/subscriptions", label: "Subs", Icon: UsersIcon, ActiveIcon: UsersIconSolid },
];

const DESKTOP_PRIMARY_LINKS = [
  { href: "/", label: "Home", special: false },
  { href: "/ipo", label: "IPO", special: false },
  { href: "/sme-ipo", label: "SME IPO", special: false },
  { href: "/gmp", label: "GMP", special: false },
  { href: "/subscriptions", label: "Subscriptions", special: false },
  { href: "/chat", label: "AI Chat", special: true },
];

const TOOLS_CATEGORIES = [
  {
    category: "Research & Analysis",
    links: [
      { href: "/compare", label: "Compare IPOs", Icon: ScaleIcon, desc: "Side-by-side comparison across 3 issues" },
      { href: "/drhp-analyzer", label: "DRHP AI Analyzer", Icon: DocumentMagnifyingGlassIcon, desc: "Promoter risks and financial summary" },
      { href: "/performance", label: "Listing Track Record", Icon: ArrowTrendingUpIcon, desc: "Historical listing day gains and returns" },
      { href: "/ipo-calendar", label: "IPO Calendar", Icon: CalendarDaysIcon, desc: "Schedule of open & upcoming issues" },
    ],
  },
  {
    category: "Calculators",
    links: [
      { href: "/ipo-allotment-probability-calculator", label: "Allotment Odds Calculator", Icon: CalculatorIcon, desc: "Lottery draw odds model" },
      { href: "/ipo-profit-calculator", label: "Expected Profit Calculator", Icon: CurrencyRupeeIcon, desc: "Net listing profit per lot from GMP" },
    ],
  },
  {
    category: "Alerts & Verification",
    links: [
      { href: "/alerts", label: "Daily GMP Alerts", Icon: BellIcon, desc: "Morning 8:30 AM email & Telegram digest" },
      { href: "/allotment-status", label: "Allotment Status Links", Icon: CheckBadgeIcon, desc: "Registrar direct verification links" },
    ],
  },
  {
    category: "Education & Guides",
    links: [
      { href: "/what-is-ipo-gmp", label: "What is GMP?", Icon: BookOpenIcon, desc: "Beginner guide to Grey Market Premiums" },
      { href: "/qib-hni-retail-explained", label: "Investor Categories", Icon: UsersIcon, desc: "QIB, NII, and Retail quotas explained" },
      { href: "/methodology", label: "Data Methodology", Icon: ShieldCheckIcon, desc: "Data sources, timeline, and disclaimer" },
      { href: "/brokers", label: "Brokers Directory", Icon: BriefcaseIcon, desc: "Compare retail brokerage platforms" },
    ],
  },
];

const ALL_TOOLS_FLAT = TOOLS_CATEGORIES.flatMap((c) => c.links);

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isToolsActive = () => {
    return ALL_TOOLS_FLAT.some((l) => isActive(l.href));
  };

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setToolsDropdownOpen(false);
    setMoreDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "border-b border-gray-200/90 dark:border-[#222731] shadow-xs"
            : "border-b border-gray-200/60 dark:border-[#1F242C]"
        } bg-white dark:bg-[#090B0F]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0 focus:outline-none"
              aria-label="IPOCraft Home"
            >
              <Image
                src="/logo-light.png"
                alt="IPOCraft Logo"
                width={120}
                height={36}
                priority
                className="h-8 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="IPOCraft Logo"
                width={120}
                height={36}
                priority
                className="h-8 w-auto object-contain hidden dark:block"
              />
            </Link>

            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-1 lg:gap-1.5"
            >
              {DESKTOP_PRIMARY_LINKS.map((l) => {
                const active = isActive(l.href);
                if (l.special) {
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13.5px] font-semibold transition-all duration-150 ${
                        active
                          ? "bg-[#1C317A] text-white shadow-xs"
                          : "bg-[#1C317A]/10 hover:bg-[#1C317A]/15 text-[#1C317A] dark:bg-[#1C317A]/25 dark:hover:bg-[#1C317A]/35 dark:text-[#93B4FF] border border-[#1C317A]/20 dark:border-[#3D5BA9]/40"
                      }`}
                    >
                      <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                      {l.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors duration-150 ${
                      active
                        ? "bg-gray-100 text-[#0f172a] dark:bg-[#171B20] dark:text-[#F1F3F5] font-semibold"
                        : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-50 dark:hover:bg-[#171B20]/60"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setToolsDropdownOpen((o) => !o)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors duration-150 ${
                    isToolsActive() || toolsDropdownOpen
                      ? "bg-gray-100 text-[#0f172a] dark:bg-[#171B20] dark:text-[#F1F3F5] font-semibold"
                      : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F3F5] hover:bg-gray-50 dark:hover:bg-[#171B20]/60"
                  }`}
                  aria-expanded={toolsDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Tools</span>
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      toolsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {toolsDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-80 rounded-xl bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1"
                    role="menu"
                  >
                    <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 dark:text-[#64748B] border-b border-gray-100 dark:border-[#1F242C] mb-1">
                      IPO Intelligence Tools
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto py-1">
                      {ALL_TOOLS_FLAT.map((item) => {
                        const ItemIcon = item.Icon;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setToolsDropdownOpen(false)}
                            className={`flex items-start gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors ${
                              active
                                ? "bg-gray-50 dark:bg-[#171B20] text-[#1C317A] dark:text-[#93B4FF]"
                                : "text-gray-700 dark:text-[#CBD5E1]"
                            }`}
                            role="menuitem"
                          >
                            <ItemIcon className="w-4 h-4 mt-0.5 shrink-0 text-gray-500 dark:text-[#8E97A6]" />
                            <div className="min-w-0">
                              <div className="text-[13px] font-medium leading-snug">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-gray-400 dark:text-[#6B7280] truncate">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-gray-500 dark:text-[#9AA1AA] bg-gray-50 dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                aria-label="Search IPOs"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-block text-[10px] px-1 py-0.2 bg-gray-200 dark:bg-[#252A31] text-gray-600 dark:text-gray-300 rounded font-mono">
                  ⌘K
                </kbd>
              </button>

              <ThemeToggle />
            </div>
          </div>
        </div>

        <div
          className="h-0.5 bg-[#1C317A] dark:bg-[#3D5BA9] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
        <OpenIpoTicker />
      </header>

      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 border-t z-50 bg-white dark:bg-[#090B0F] border-gray-200/90 dark:border-[#222731] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-center justify-around h-14 px-1">
          {MOBILE_BOTTOM_TABS.map(({ href, label, Icon, ActiveIcon }) => {
            const active = isActive(href);
            const CurrentIcon = active ? ActiveIcon : Icon;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center w-full h-full gap-0.5 min-w-0 py-1"
              >
                <CurrentIcon
                  className={`w-5 h-5 ${
                    active
                      ? "text-[#1C317A] dark:text-[#93B4FF]"
                      : "text-gray-500 dark:text-[#7A8391]"
                  }`}
                />
                <span
                  className={`text-[10px] tracking-tight truncate ${
                    active
                      ? "font-semibold text-[#1C317A] dark:text-[#93B4FF]"
                      : "text-gray-500 dark:text-[#7A8391]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-0.5 min-w-0 py-1"
            aria-label="Open More Tools Menu"
          >
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-[#7A8391]" />
            <span className="text-[10px] font-medium text-gray-500 dark:text-[#7A8391]">
              Tools
            </span>
          </button>
        </div>
      </nav>

      {moreDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMoreDrawerOpen(false)}
          />
          <div className="md:hidden fixed bottom-0 inset-x-0 z-[70] rounded-t-2xl shadow-xl pb-[env(safe-area-inset-bottom)] bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-[#222731] sticky top-0 bg-white dark:bg-[#111418] z-10">
              <span className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
                IPO Tools &amp; Research
              </span>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="text-gray-500 dark:text-[#9AA1AA] p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1A1F26]"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-5">
              {TOOLS_CATEGORIES.map((cat, idx) => (
                <div key={idx}>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400 dark:text-[#7A8391] mb-2 px-0.5">
                    {cat.category}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.links.map((link) => {
                      const IconComp = link.Icon;
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreDrawerOpen(false)}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${
                            active
                              ? "bg-blue-50/70 dark:bg-[#151D2A] border-[#1C317A]/30 dark:border-[#3D5BA9]/50 text-[#1C317A] dark:text-[#93B4FF]"
                              : "bg-gray-50/70 dark:bg-[#161B22] border-gray-200/80 dark:border-[#222731] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1D232C]"
                          }`}
                        >
                          <IconComp className="w-4 h-4 mt-0.5 shrink-0 text-gray-500 dark:text-[#8E97A6]" />
                          <div className="min-w-0">
                            <div className="text-[12.5px] font-medium leading-tight truncate">
                              {link.label}
                            </div>
                            <div className="text-[10.5px] text-gray-400 dark:text-[#6B7280] line-clamp-1 mt-0.5">
                              {link.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
