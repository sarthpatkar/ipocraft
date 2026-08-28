"use client";

import { useState, useEffect, useCallback } from "react";
import { XMarkIcon, ArrowDownTrayIcon, ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ShareCardModalProps {
  slug: string;
  ipoName: string;
  onClose: () => void;
}

const TEMPLATES = [
  { id: "gmp", label: "GMP Pulse", description: "GMP, price & status at a glance" },
  { id: "subscription", label: "Subscription", description: "Category demand bars" },
  { id: "allotment", label: "Allotment Odds", description: '"1 in X" probability' },
];

export default function ShareCardModal({ slug, ipoName, onClose }: ShareCardModalProps) {
  const [selected, setSelected] = useState<string>("gmp");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardUrl = `/api/share-card?slug=${encodeURIComponent(slug)}&template=${selected}`;
  const pageUrl = `https://ipocraft.com/ipo/${encodeURIComponent(slug)}`;
  const shareText = `${ipoName} IPO — check live GMP, subscription & allotment odds on IPOCraft`;

  // Reset load state when template changes
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [selected]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-${selected}-ipocraft.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(cardUrl, "_blank");
    }
  }, [cardUrl, slug, selected]);

  const handleWhatsApp = useCallback(async () => {
    setSharing(true);
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const file = new File([blob], `${slug}-ipocraft.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${ipoName} IPO`, text: shareText });
        setSharing(false);
        return;
      }
    } catch { /* fall through */ }
    // Fallback: share as text link
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + pageUrl)}`;
    window.open(waUrl, "_blank");
    setSharing(false);
  }, [cardUrl, slug, ipoName, shareText, pageUrl]);

  const handleX = useCallback(() => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(xUrl, "_blank");
  }, [shareText, pageUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = pageUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [pageUrl]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#252A31]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1C317A] dark:text-[#6B8CCF]">
              Share Card
            </p>
            <h2 className="text-[16px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug">
              {ipoName} IPO
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#171B20] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Template picker */}
        <div className="flex gap-2 px-5 pt-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`flex-1 py-2 px-2 rounded-md border text-left transition-colors ${
                selected === t.id
                  ? "border-[#1C317A] bg-[#eef2ff] dark:bg-[#1C317A]/20 dark:border-[#3D5BA9]"
                  : "border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#171B20] hover:border-gray-400 dark:hover:border-[#4A5568]"
              }`}
            >
              <p className={`text-[12.5px] font-semibold leading-snug ${selected === t.id ? "text-[#1C317A] dark:text-[#93B4FF]" : "text-[#0f172a] dark:text-[#F1F5F9]"}`}>
                {t.label}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-[#6B7280] mt-0.5 leading-snug">
                {t.description}
              </p>
            </button>
          ))}
        </div>

        {/* Card preview */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative w-full aspect-[1200/630] rounded-lg overflow-hidden bg-[#0D1117] border border-gray-200 dark:border-[#252A31]">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0D1117]">
                <div className="w-2 h-2 rounded-full bg-[#1C317A] animate-pulse" />
                <span className="text-[11px] text-[#8B949E] font-medium tracking-wide">Generating card...</span>
              </div>
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center text-[13px] text-gray-400">
                Preview unavailable
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardUrl}
              alt={`${ipoName} IPO share card — ${selected} template`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(false); }}
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-[#6B7280] mt-2">
            Card includes IPOCraft watermark and URL. GMP is indicative, not guaranteed.
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 pt-3 flex gap-2.5 flex-wrap">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] dark:bg-white text-white dark:text-black text-[13px] font-semibold rounded-md hover:bg-[#1e293b] dark:hover:bg-gray-100 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download PNG
          </button>

          <button
            onClick={handleWhatsApp}
            disabled={sharing}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-[13px] font-semibold rounded-md hover:bg-[#1ebe5d] transition-colors disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" />
            </svg>
            {sharing ? "Opening..." : "Share on WhatsApp"}
          </button>

          <button
            onClick={handleX}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] dark:bg-[#171B20] border border-gray-300 dark:border-[#252A31] text-[#0f172a] dark:text-[#F1F5F9] text-[13px] font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-[#1E2330] transition-colors"
          >
            <svg className="w-4 h-4 text-white dark:text-[#F1F5F9]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-white dark:text-[#F1F5F9]">Share on X</span>
          </button>

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-2.5 border text-[13px] font-semibold rounded-md transition-colors ${
              copied
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                : "border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#1E2330]"
            }`}
          >
            {copied ? (
              <><CheckIcon className="w-4 h-4" />Copied!</>
            ) : (
              <><ClipboardDocumentIcon className="w-4 h-4" />Copy Link</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
