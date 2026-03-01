"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  RefObject,
} from "react";

type LinkItem = { href: string; label: string };

const LINKS: LinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/ipo", label: "IPO" },
  { href: "/gmp", label: "GMP" },
  { href: "/ipo-calendar", label: "IPO Calendar" },
  { href: "/brokers", label: "Brokers" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverIndicator, setHoverIndicator] = useState<{ left: number; width: number } | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // active pill indicator
  const navRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [initialPulse, setInitialPulse] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll(); // initialize on load
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // subtle glow pulse on route change (one-shot)
    setInitialPulse(true);
    const t = setTimeout(() => setInitialPulse(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  useLayoutEffect(() => {
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
  }, [pathname]);

  useEffect(() => {
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
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const NavLink = ({ href, label }: LinkItem) => {
    const active = isActive(href);

    return (
      <Link
        href={href}
        ref={(el) => {
          linkRefs.current[href] = el;
        }}
        aria-current={active ? "page" : undefined}
        onMouseEnter={(e) => {
          const navEl = navRef.current;
          const rect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
          if (navEl) {
            const navRect = navEl.getBoundingClientRect();
            setHoverIndicator({
              left: rect.left - navRect.left,
              width: rect.width,
            });
          }
        }}
        onMouseLeave={() => setHoverIndicator(null)}
        className={`group relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform
        will-change-transform hover:-translate-y-0.5 active:translate-y-0
        ${
          active
            ? "text-white"
            : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
        }`}
      >
        {/* moving shimmer */}
        <span
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 shimmer transition-opacity duration-300"
        />

        <span className="relative z-10">{label}</span>
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 h-14 transition-all ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo2.png"
            alt="IPOCraft"
            width={120}
            height={34}
            className="h-[32px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <div ref={navRef} className="relative flex items-center gap-6">
            {/* sliding active pill */}
            <span
              className={`absolute -z-0 top-1 bottom-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition-all ${
                initialPulse ? "pulse-once" : ""
              }`}
              style={{
                transform: `translate3d(${indicator.left}px, 0, 0)`,
                width: indicator.width,
                transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform, width",
              }}
            />
            {hoverIndicator && (
              <span
                className="absolute bottom-0 h-[2px] rounded-full bg-blue-600/70 transition-all will-change-transform"
                style={{
                  left: hoverIndicator.left,
                  width: hoverIndicator.width,
                  transition: "all 220ms ease",
                }}
              />
            )}

            {LINKS.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Always visible GMP button on small screens */}
          <Link
            href="/gmp"
            className="md:hidden inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold 
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm
                       hover:shadow-md active:scale-[0.97] transition-all"
          >
            GMP
          </Link>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            className="md:hidden text-xl px-2 py-1 rounded-lg hover:bg-slate-100 active:scale-[0.95] transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="border-b border-[#e2e8f0]" />
        </div>

        {/* Scroll Progress Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Mobile */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col px-4 py-4 gap-3 text-sm">
            {LINKS.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>
      )}

      {/* styles for shimmer */}
      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.12) 0%,
            rgba(99, 102, 241, 0.18) 50%,
            rgba(59, 130, 246, 0.12) 100%
          );
          background-size: 200% 100%;
          animation: shimmerMove 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes shimmerMove {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .pulse-once {
          animation: pulseGlow 600ms ease-out 1;
        }
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 rgba(99, 102, 241, 0);
          }
          50% {
            box-shadow: 0 8px 28px rgba(79, 70, 229, 0.35);
          }
          100% {
            box-shadow: 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `}</style>
    </header>
  );
}