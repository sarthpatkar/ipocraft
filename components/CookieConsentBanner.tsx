"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const COOKIE_KEY = "ipocraft_cookies_accepted";
const PREFS_KEY = "ipocraft_cookie_prefs";

interface CookiePrefs {
  analytics: boolean;
  advertising: boolean;
}

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({ analytics: true, advertising: true });

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(COOKIE_KEY);
      if (!accepted) setIsVisible(true);
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
    } catch {}
  }, []);

  const acceptAll = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "true");
      localStorage.setItem(PREFS_KEY, JSON.stringify({ analytics: true, advertising: true }));
    } catch {}
    setIsVisible(false);
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "true");
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {}
    setShowPrefs(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* ── COOKIE BANNER ── */}
      <div
        className="fixed bottom-0 inset-x-0 z-[60] bg-white dark:bg-[#111418] border-t border-gray-200 dark:border-[#252A31] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        role="alertdialog"
        aria-label="Cookie consent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
              <span className="font-semibold text-[#0f172a] dark:text-[#F1F3F5]">We use cookies</span>{" "}
              for analytics (Google Analytics) and advertising (Google AdSense). By continuing to use
              IPOCraft, you agree to our{" "}
              <a href="/privacy" className="text-[#1C317A] dark:text-blue-400 hover:underline font-medium">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPrefs(true)}
              className="px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-[#252A31] text-[12px] font-semibold text-[#374151] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors"
            >
              Preferences
            </button>
            <button
              onClick={acceptAll}
              className="px-3.5 py-1.5 rounded-md bg-[#1C317A] hover:bg-[#28439E] text-white text-[12px] font-semibold transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={acceptAll}
              aria-label="Dismiss"
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PREFERENCES MODAL ── */}
      {showPrefs && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPrefs(false); }}
        >
          <div className="bg-white dark:bg-[#111418] rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-gray-200 dark:border-[#252A31]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-[#0f172a] dark:text-[#F1F3F5]" style={{ fontFamily: "var(--font-outfit)" }}>
                Cookie Preferences
              </h3>
              <button onClick={() => setShowPrefs(false)} className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors" aria-label="Close">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[12.5px] text-[#64748b] dark:text-[#9AA1AA] leading-relaxed">
              Essential cookies for site functionality are always active. Adjust Analytics and Advertising cookies below.
            </p>

            {/* Essential */}
            <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-[#1F242B]">
              <div>
                <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]">Essential</p>
                <p className="text-[11.5px] text-[#64748b] dark:text-[#9AA1AA]">Required for site functionality (theme, chat sessions)</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">Always On</span>
            </div>

            {/* Analytics toggle */}
            <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-[#1F242B]">
              <div>
                <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]">Analytics</p>
                <p className="text-[11.5px] text-[#64748b] dark:text-[#9AA1AA]">Google Analytics — helps us understand usage</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.analytics}
                onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                className={`relative w-9 h-5 rounded-full transition-colors ${prefs.analytics ? "bg-[#1C317A]" : "bg-gray-300 dark:bg-[#333]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs.analytics ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Advertising toggle */}
            <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-[#1F242B]">
              <div>
                <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]">Advertising</p>
                <p className="text-[11.5px] text-[#64748b] dark:text-[#9AA1AA]">Google AdSense — used to show relevant ads</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.advertising}
                onClick={() => setPrefs((p) => ({ ...p, advertising: !p.advertising }))}
                className={`relative w-9 h-5 rounded-full transition-colors ${prefs.advertising ? "bg-[#1C317A]" : "bg-gray-300 dark:bg-[#333]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs.advertising ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowPrefs(false)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-[#252A31] text-[12.5px] font-semibold text-[#374151] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors">
                Cancel
              </button>
              <button onClick={savePreferences} className="px-4 py-2 rounded-lg bg-[#1C317A] hover:bg-[#28439E] text-white text-[12.5px] font-semibold transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
