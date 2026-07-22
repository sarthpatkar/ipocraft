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
  CalendarDaysIcon, 
  ChartBarIcon,
  BriefcaseIcon 
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid, 
  BanknotesIcon as BanknotesIconSolid, 
  CalendarDaysIcon as CalendarDaysIconSolid, 
  ChartBarIcon as ChartBarIconSolid,
  BriefcaseIcon as BriefcaseIconSolid 
} from "@heroicons/react/24/solid";

type LinkItem = { 
  href: string; 
  label: string; 
  Icon: React.ElementType; 
  ActiveIcon: React.ElementType 
};

const LINKS: LinkItem[] = [
  { href: "/", label: "Home", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/ipo", label: "IPO", Icon: BanknotesIcon, ActiveIcon: BanknotesIconSolid },
  { href: "/gmp", label: "GMP", Icon: ChartBarIcon, ActiveIcon: ChartBarIconSolid },
  { href: "/ipo-calendar", label: "Calendar", Icon: CalendarDaysIcon, ActiveIcon: CalendarDaysIconSolid },
  { href: "/brokers", label: "Brokers", Icon: BriefcaseIcon, ActiveIcon: BriefcaseIconSolid },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Desktop active pill indicator
  const navRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const onResize = () => {
      const activeLink = LINKS.find((l) => isActive(l.href));
      const activeEl = activeLink ? linkRefs.current[activeLink.href] : null;
      const navEl = navRef.current;
      if (activeEl && navEl) {
        const navRect = navEl.getBoundingClientRect();
        const rect = activeEl.getBoundingClientRect();
        setIndicator({
          left: rect.left - navRect.left,
          width: rect.width,
        });
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const DesktopNavLink = ({ href, label }: LinkItem) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        ref={(el) => { linkRefs.current[href] = el; }}
        className={`relative z-10 px-5 py-2 rounded-xl text-[15px] font-medium transition-all duration-300 ${
          active ? "text-white" : "text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400"
        }`}
      >
        <span className="relative z-10">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Top Navbar (Desktop & Mobile Header) */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-lg shadow-sm" : "bg-white dark:bg-[#0f172a]"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo2.png"
              alt="IPOCraft"
              width={130}
              height={36}
              className="h-[30px] w-auto object-contain hidden dark:block invert"
            />
             <Image
              src="/logo2.png"
              alt="IPOCraft"
              width={130}
              height={36}
              className="h-[30px] w-auto object-contain dark:hidden"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div ref={navRef} className="relative flex items-center gap-2">
              <span
                className="absolute -z-0 top-1 bottom-1 rounded-xl bg-blue-600 dark:bg-blue-500 shadow-md transition-all"
                style={{
                  transform: `translate3d(${indicator.left}px, 0, 0)`,
                  width: indicator.width,
                  transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), width 350ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform, width",
                }}
              />
              {LINKS.map((l) => (
                <DesktopNavLink key={l.href} {...l} />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Progress Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (iOS Style) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/85 dark:bg-[#0f172a]/85 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-[68px] px-2">
          {LINKS.map(({ href, label, Icon, ActiveIcon }) => {
            const active = isActive(href);
            const CurrentIcon = active ? ActiveIcon : Icon;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center w-full h-full gap-1"
              >
                <div className={`transition-all duration-200 ${active ? "scale-110 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  <CurrentIcon className="w-6 h-6" strokeWidth={active ? 2 : 1.5} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}