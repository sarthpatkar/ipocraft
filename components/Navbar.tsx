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
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid, 
  BanknotesIcon as BanknotesIconSolid, 
  ChartBarIcon as ChartBarIconSolid,
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

const MAIN_NAV_LINKS: LinkItem[] = [
  { href: "/", label: "Home", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/ipo", label: "IPO", Icon: BanknotesIcon, ActiveIcon: BanknotesIconSolid },
  { href: "/gmp", label: "GMP", Icon: ChartBarIcon, ActiveIcon: ChartBarIconSolid },
  { href: "/subscriptions", label: "Subs", Icon: UsersIcon, ActiveIcon: UsersIconSolid },
];

const DESKTOP_PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ipo", label: "IPO" },
  { href: "/sme-ipo", label: "SME IPO" },
  { href: "/gmp", label: "GMP" },
  { href: "/subscriptions", label: "Subscriptions" },
];

const TOOLS_LINKS = [
  { href: "/allotment-status", label: "Allotment Status", Icon: CheckBadgeIcon, desc: "Registrar & exchange verification" },
  { href: "/performance", label: "Track Record", Icon: ArrowTrendingUpIcon, desc: "Historical listing day gains" },
  { href: "/ipo-calendar", label: "IPO Calendar", Icon: CalendarDaysIcon, desc: "Timeline of open & upcoming issues" },
  { href: "/brokers", label: "Brokers", Icon: BriefcaseIcon, desc: "Compare brokerage platforms" },
  { href: "/blog", label: "Research Blog", Icon: DocumentTextIcon, desc: "Guides and educational articles" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isToolsActive = () => {
    return TOOLS_LINKS.some((l) => isActive(l.href));
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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown and drawer on navigation
  useEffect(() => {
    setToolsDropdownOpen(false);
    setMoreDrawerOpen(false);
  }, [pathname]);

  // Keyboard shortcut for search
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

  const showScrollProgress = pathname.startsWith("/blog/");

  return (
    <>
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Fixed Header Wrapper */}
      <div className="fixed top-0 w-full z-50">
        <header
          className={`relative z-50 w-full transition-colors duration-150 border-b ${
            scrolled ? "border-gray-200 dark:border-[#252A31]" : "border-transparent"
          } bg-white/95 dark:bg-[#090B0F]/95 backdrop-blur-md`}
          style={{
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group outline-none shrink-0">
              <Image
                src="/logo-light.png"
                alt="IPOCraft Logo"
                width={116}
                height={28}
                priority
                className="h-7 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="IPOCraft Logo"
                width={116}
                height={28}
                priority
                className="h-7 w-auto object-contain hidden dark:block"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              <nav className="flex items-center gap-1">
                {DESKTOP_PRIMARY_LINKS.map((l) => {
                  const active = isActive(l.href);
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

                {/* "Tools" Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setToolsDropdownOpen((prev) => !prev)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors duration-150 ${
                      isToolsActive()
                        ? "bg-gray-100 text-[#0f172a] dark:bg-[#171B20] dark:text-[#F1F3F5] font-semibold"
                        : toolsDropdownOpen
                        ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5]"
                        : "text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#171B20]/60"
                    }`}
                  >
                    <span>Tools</span>
                    <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-150 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Popover */}
                  {toolsDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] shadow-xl py-1.5 z-[100] animate-in fade-in duration-100">
                      {TOOLS_LINKS.map((tool) => {
                        const active = isActive(tool.href);
                        const Icon = tool.Icon;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors ${
                              active ? "bg-gray-50 dark:bg-[#171B20] text-blue-600 dark:text-blue-400" : "text-[#0f172a] dark:text-[#F1F3F5]"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 shrink-0 text-gray-500 dark:text-[#9AA1AA]" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-medium leading-tight">{tool.label}</div>
                              <div className="text-[11.5px] text-[#64748B] dark:text-[#9AA1AA] leading-snug mt-0.5 truncate">
                                {tool.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>

              {/* Search & Theme Actions */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search IPOs"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] rounded-md border transition-colors duration-150 bg-white dark:bg-[#171B20] border-gray-200 dark:border-[#252A31] text-gray-500 dark:text-[#9AA1AA] hover:border-gray-300 dark:hover:border-[#374151]"
                >
                  <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                  <span>Search</span>
                  <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#111418] text-gray-400 dark:text-[#6B7280]">⌘K</kbd>
                </button>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 rounded-md text-gray-600 dark:text-[#9AA1AA] hover:bg-gray-100 dark:hover:bg-[#171B20]"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Reading Scroll Progress */}
          {showScrollProgress && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
              <div
                className="h-full transition-all duration-150 bg-blue-600"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          )}
        </header>

        {/* Horizontally Moving Open IPO Ticker (Left to Right) */}
        <OpenIpoTicker />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 border-t z-50 bg-white/95 dark:bg-[#090B0F]/95 border-gray-200 dark:border-[#252A31] backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-14 px-1">
          {MAIN_NAV_LINKS.map(({ href, label, Icon, ActiveIcon }) => {
            const active = isActive(href);
            const CurrentIcon = active ? ActiveIcon : Icon;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center w-full h-full gap-0.5 min-w-0"
              >
                <div>
                  <CurrentIcon className={`w-5 h-5 ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-[#6B7280]"}`} />
                </div>
                <span className={`text-[10px] truncate ${active ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-[#6B7280]"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-0.5"
          >
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-[#6B7280]" strokeWidth={1.5} />
            <span className="text-[10px] font-medium text-gray-500 dark:text-[#6B7280]">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" Drawer */}
      {moreDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMoreDrawerOpen(false)}
          />
          <div className="md:hidden fixed bottom-0 inset-x-0 z-[70] rounded-t-xl shadow-2xl pb-[env(safe-area-inset-bottom)] bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-[#252A31] sticky top-0 bg-white/95 dark:bg-[#111418]/95 backdrop-blur-sm z-10">
              <span className="text-[14px] font-bold text-gray-900 dark:text-[#F1F3F5]">Tools &amp; Pages</span>
              <button onClick={() => setMoreDrawerOpen(false)} className="text-gray-500 dark:text-[#9AA1AA] p-1">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Category 1: Trackers */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2 px-1">
                  Trackers &amp; Tools
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/allotment-status"
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/60 dark:bg-[#171B20] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                  >
                    <CheckBadgeIcon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[13.5px] font-medium">Allotment Status</span>
                  </Link>

                  <Link
                    href="/performance"
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/60 dark:bg-[#171B20] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                  >
                    <ArrowTrendingUpIcon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[13.5px] font-medium">Performance &amp; Track Record</span>
                  </Link>

                  <Link
                    href="/sme-ipo"
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/60 dark:bg-[#171B20] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                  >
                    <BuildingStorefrontIcon className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-[13.5px] font-medium">SME IPO Hub</span>
                  </Link>

                  <Link
                    href="/ipo-calendar"
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/60 dark:bg-[#171B20] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                  >
                    <CalendarDaysIcon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[13.5px] font-medium">IPO Calendar</span>
                  </Link>
                </div>
              </div>

              {/* Category 2: Guides & Resources */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9AA1AA] mb-2 px-1">
                  Resources &amp; Comparison
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/brokers"
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/60 dark:bg-[#171B20] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                  >
                    <BriefcaseIcon className="w-4 h-4 text-gray-500 dark:text-[#9AA1AA] shrink-0" />
                    <span className="text-[13px] font-medium">Brokers</span>
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setMoreDrawerOpen(false)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50/60 dark:bg-[#171B20] text-gray-800 dark:text-[#F1F3F5] hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                  >
                    <DocumentTextIcon className="w-4 h-4 text-gray-500 dark:text-[#9AA1AA] shrink-0" />
                    <span className="text-[13px] font-medium">Blog</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
