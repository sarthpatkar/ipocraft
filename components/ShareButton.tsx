"use client";

import { useState, useRef, useEffect } from "react";
import { ShareIcon, ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
}

export default function ShareButton({ title, url, text }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url, text });
        return;
      } catch {}
    }
    setOpen((p) => !p);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent((text || title) + " " + url)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent((text || title) + " " + url)}`;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleShare}
        aria-label="Share this IPO"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all hover:shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card-bg)",
          color: "var(--text-secondary)",
        }}
      >
        <ShareIcon className="w-3.5 h-3.5" />
        Share
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-44 rounded-md shadow-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] z-50 py-1 overflow-hidden"
        >
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12.5px] text-gray-700 dark:text-[#F1F3F5] transition-colors hover:bg-gray-50 dark:hover:bg-[#171B20]"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardIcon className="w-4 h-4 text-gray-400 dark:text-[#6B7280]" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12.5px] text-gray-700 dark:text-[#F1F3F5] transition-colors hover:bg-gray-50 dark:hover:bg-[#171B20]"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12.5px] text-gray-700 dark:text-[#F1F3F5] transition-colors hover:bg-gray-50 dark:hover:bg-[#171B20]"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4 text-[#0f172a] dark:text-[#F1F5F9]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter)
          </a>
        </div>
      )}
    </div>
  );
}
