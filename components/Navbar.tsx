"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
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
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid, 
  BanknotesIcon as BanknotesIconSolid, 
  ChartBarIcon as ChartBarIconSolid,
  UsersIcon as UsersIconSolid,
} from "@heroicons/react/24/solid";
import ThemeToggle from "@/components/ThemeToggle";
import SearchCommand from "@/components/SearchCommand";

type LinkItem = { 
  href: string; 
  label: string; 
  Icon: React.ElementType; 
  ActiveIcon: React.ElementType 
};

const MAIN_NAV_LINKS: LinkItem[] = [
  { href: "/", label: "Home", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/ipo", label: "IPO", Icon: BanknotesIcon, ActiveIcon: BanknotesIconSolid },
  { href: "/gmp", label: "GMP", Icon: ChartBarIcon, ActiveIcon: ChartBarIconSolid },
  { href: "/subscriptions", label: "Subs", Icon: UsersIcon, ActiveIcon: UsersIconSolid },
];

const ALL_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ipo", label: "IPO" },
  { href: "/sme-ipo", label: "SME IPO" },
  { href: "/gmp", label: "GMP" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/ipo-calendar", label: "Calendar" },
  { href: "/brokers", label: "Brokers" },
  { href: "/blog", label: "Blog" },
];

const MORE_LINKS = [
  { href: "/sme-ipo", label: "SME IPO", Icon: BuildingStorefrontIcon },
  { href: "/ipo-calendar", label: "Calendar", Icon: CalendarDaysIcon },
  { href: "/brokers", label: "Brokers", Icon: BriefcaseIcon },
  { href: "/blog", label: "Blog", Icon: DocumentTextIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    setMounted(true);
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
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useLayoutEffect(() => {
    const onResize = () => {
      const activeLink = ALL_LINKS.find((l) => isActive(l.href));
      const activeEl = activeLink ? linkRefs.current[activeLink.href] : null;
      const navEl = navRef.current;
      if (activeEl && navEl) {
        const navRect = navEl.getBoundingClientRect();
        const rect = activeEl.getBoundingClientRect();
        setIndicator({ left: rect.left - navRect.left, width: rect.width });
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const showScrollProgress = pathname.startsWith("/blog/");

  return (
    <>
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-200 border-b ${
          scrolled ? "border-[#e2e8f0] dark:border-[#22304A] shadow-xs" : "border-transparent"
        } bg-white/90 dark:bg-[#080D18]/95 backdrop-blur-md`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            <nav className="flex items-center gap-1">
              {ALL_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 ${
                      active
                        ? "bg-[#1e3a8a] text-white dark:bg-[#3B82F6] dark:text-white font-semibold shadow-xs"
                        : "text-gray-600 dark:text-[#94A3B8] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] hover:bg-gray-100/80 dark:hover:bg-[#162238]"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search IPOs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] rounded-lg border transition-colors duration-150 bg-white dark:bg-[#162238] border-gray-200 dark:border-[#22304A] text-gray-500 dark:text-[#94A3B8] hover:border-gray-300 dark:hover:border-[#3B82F6]/50"
              >
                <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                <span>Search IPOs</span>
                <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#22304A] bg-gray-50 dark:bg-[#111B2D] text-gray-400 dark:text-[#64748B]">⌘K</kbd>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 rounded-lg text-gray-600 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#162238]"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Scroll Progress */}
        {showScrollProgress && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
            <div
              className="h-full transition-all duration-150 bg-[#3B82F6]"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t z-50 bg-white/95 dark:bg-[#080D18]/95 border-gray-200 dark:border-[#22304A] backdrop-blur-md"
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
                <div className={`transition-transform duration-150 ${active ? "scale-105" : ""}`}
                  style={{ color: active ? "#3B82F6" : undefined }}
                >
                  <CurrentIcon className={`w-5 h-5 ${active ? "text-blue-600 dark:text-[#3B82F6]" : "text-gray-500 dark:text-[#64748B]"}`} />
                </div>
                <span className={`text-[10px] truncate ${active ? "font-semibold text-blue-600 dark:text-[#3B82F6]" : "text-gray-500 dark:text-[#64748B]"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-0.5"
          >
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-[#64748B]" strokeWidth={1.5} />
            <span className="text-[10px] font-medium text-gray-500 dark:text-[#64748B]">More</span>
          </button>
        </div>
      </nav>


      {/* More Drawer */}
      {moreDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setMoreDrawerOpen(false)}
          />
          <div className="md:hidden fixed bottom-0 inset-x-0 z-[70] rounded-t-2xl shadow-xl pb-[env(safe-area-inset-bottom)] bg-white dark:bg-[#0D1525] border border-gray-200 dark:border-[#22304A]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-[#22304A]">
              <span className="text-[13px] font-semibold text-gray-900 dark:text-[#F1F5F9]">More Pages</span>
              <button onClick={() => setMoreDrawerOpen(false)} className="text-gray-500 dark:text-[#94A3B8]">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-4">
              {MORE_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMoreDrawerOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 dark:border-[#22304A] bg-gray-50 dark:bg-[#111B2D] text-gray-800 dark:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#162238] transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0 text-blue-600 dark:text-[#3B82F6]" />
                  <span className="text-[13px] font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

        </>
      )}
    </>
  );
}
