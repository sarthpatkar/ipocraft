"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-4 ${light ? "text-[#93c5fd]" : "text-[#2563eb] dark:text-[#3B82F6]"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

export default function ProfitCalculator({ ipo }: { ipo: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extract key pricing parameters
  const issuePrice = Number(ipo.price_max ?? ipo.price_min ?? ipo.issue_price) || 100;
  const lotSize = Number(ipo.lot_size) || 1;
  const defaultGmp = ipo.gmp != null ? Number(ipo.gmp) : 0;

  // Calculate retail max lots (₹2,00,000 threshold)
  const retailMaxLots = Math.max(1, Math.floor(200000 / (lotSize * issuePrice)));
  const sniiMinLots = retailMaxLots + 1;

  // URL-synced state
  const [lots, setLotsState] = useState<number>(() => {
    const urlLots = searchParams.get("lots");
    return urlLots ? Math.max(1, Math.min(100, parseInt(urlLots, 10))) : 1;
  });
  const [useCustomGmp, setUseCustomGmpState] = useState<boolean>(() => {
    return searchParams.get("gmpMode") === "custom";
  });
  const [customGmp, setCustomGmpState] = useState<number>(() => {
    const urlGmp = searchParams.get("customGmp");
    return urlGmp ? Number(urlGmp) : defaultGmp;
  });
  const [copied, setCopied] = useState(false);

  // Update URL helper
  const updateUrl = useCallback(
    (newLots: number, newMode: boolean, newCustomGmp: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newLots !== 1) params.set("lots", String(newLots));
      else params.delete("lots");
      if (newMode) {
        params.set("gmpMode", "custom");
        params.set("customGmp", String(newCustomGmp));
      } else {
        params.delete("gmpMode");
        params.delete("customGmp");
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}#profit-calculator`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  const setLots = (val: number) => {
    setLotsState(val);
    updateUrl(val, useCustomGmp, customGmp);
  };
  const setUseCustomGmp = (val: boolean) => {
    setUseCustomGmpState(val);
    updateUrl(lots, val, customGmp);
  };
  const setCustomGmp = (val: number) => {
    setCustomGmpState(val);
    updateUrl(lots, useCustomGmp, val);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeGmp = useCustomGmp ? customGmp : defaultGmp;
  const totalShares = lots * lotSize;
  const totalInvestment = totalShares * issuePrice;
  const estimatedListingPrice = Math.max(0, issuePrice + activeGmp);
  const estimatedTotalValue = totalShares * estimatedListingPrice;
  const estimatedProfit = totalShares * activeGmp;
  const returnPercentage = issuePrice > 0 ? (activeGmp / issuePrice) * 100 : 0;

  const isProfitPositive = estimatedProfit > 0;
  const isProfitNegative = estimatedProfit < 0;

  return (
    <section id="profit-calculator" className="scroll-mt-[120px] bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 space-y-4 mb-6 shadow-xs">
      <div className="pb-3 border-b border-gray-100 dark:border-[#252A31] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Eyebrow>Tools</Eyebrow>
          <h2
            className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Listing Profit Calculator
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Share calculation button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            title="Copy shareable link to this calculation"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {copied ? "Copied" : "Share"}
          </button>
          <span className="text-[11.5px] font-medium text-gray-500 dark:text-[#9AA1AA]">
            Based on 1 allotment lot
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {/* Quick Presets */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-inter)" }}>
            Application Category / Quick Lots
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "1 Lot (Retail Min)", value: 1 },
              { label: "2 Lots", value: 2 },
              { label: "5 Lots", value: 5 },
              { label: `Retail Max (${retailMaxLots} Lots)`, value: retailMaxLots },
              { label: `sNII (${sniiMinLots} Lots)`, value: sniiMinLots },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setLots(preset.value)}
                className={`px-2.5 py-1 text-[11.5px] font-medium rounded-md border transition-colors ${
                  lots === preset.value
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white font-semibold shadow-xs"
                    : "bg-white dark:bg-[#171B20] border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lots Applied Controls */}
        <div className="bg-gray-50 dark:bg-[#171B20] p-3.5 sm:p-4 rounded-lg border border-gray-200 dark:border-[#252A31] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]" style={{ fontFamily: "var(--font-inter)" }}>
              Lots Applied:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLots(Math.max(1, lots - 1))}
                className="w-7 h-7 rounded border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[#0f172a] dark:text-[#F1F3F5] font-bold text-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                aria-label="Decrease lots"
              >
                −
              </button>
              <span className="w-12 text-center text-[13.5px] font-semibold tabular-nums text-[#0f172a] dark:text-[#F1F3F5]">
                {lots}
              </span>
              <button
                type="button"
                onClick={() => setLots(lots + 1)}
                className="w-7 h-7 rounded border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] text-[#0f172a] dark:text-[#F1F3F5] font-bold text-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#1F242B] transition-colors"
                aria-label="Increase lots"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11.5px] text-gray-500 dark:text-[#9AA1AA] pt-1 border-t border-gray-200/60 dark:border-[#252A31]">
            <span>Total Shares: <strong className="text-[#0f172a] dark:text-[#F1F3F5]">{totalShares.toLocaleString("en-IN")}</strong></span>
            <span>Total Investment: <strong className="text-[#0f172a] dark:text-[#F1F3F5]">₹{totalInvestment.toLocaleString("en-IN")}</strong></span>
          </div>
        </div>

        {/* GMP Input Mode Selection */}
        <div className="bg-gray-50 dark:bg-[#171B20] p-3.5 sm:p-4 rounded-lg border border-gray-200 dark:border-[#252A31] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[12.5px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]" style={{ fontFamily: "var(--font-inter)" }}>
              Estimated Gain Scenario:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setUseCustomGmp(false);
                  setCustomGmp(defaultGmp);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                  !useCustomGmp
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white font-semibold shadow-xs"
                    : "bg-white dark:bg-[#111418] border-gray-200 dark:border-[#252A31] text-gray-600 dark:text-[#9AA1AA]"
                }`}
              >
                Live GMP (₹{defaultGmp})
              </button>
              <button
                type="button"
                onClick={() => setUseCustomGmp(true)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                  useCustomGmp
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white font-semibold shadow-xs"
                    : "bg-white dark:bg-[#111418] border-gray-200 dark:border-[#252A31] text-gray-600 dark:text-[#9AA1AA]"
                }`}
              >
                Custom GMP
              </button>
            </div>
          </div>

          {useCustomGmp && (
            <div className="flex items-center gap-3 pt-1">
              <label className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] font-medium shrink-0">
                Expected GMP (₹):
              </label>
              <input
                type="number"
                value={customGmp}
                onChange={(e) => setCustomGmp(Number(e.target.value) || 0)}
                className="w-24 px-2.5 py-1 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-md text-[13px] font-semibold text-gray-900 dark:text-[#F1F5F9] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white"
              />
              <span className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA]">
                (= ₹{estimatedListingPrice} est. listing price)
              </span>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-white dark:bg-[#171B20] p-3.5 rounded-lg border border-gray-200 dark:border-[#252A31]">
            <p className="text-[10.5px] text-gray-500 dark:text-[#9AA1AA] font-medium mb-1">
              Total Investment
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#F1F5F9] tabular-nums">
              ₹{totalInvestment.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
              ₹{issuePrice} × {totalShares} shares
            </p>
          </div>

          <div className="bg-white dark:bg-[#171B20] p-3.5 rounded-lg border border-gray-200 dark:border-[#252A31]">
            <p className="text-[10.5px] text-gray-500 dark:text-[#9AA1AA] font-medium mb-1">
              Est. Listing Price
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#F1F5F9] tabular-nums">
              ₹{estimatedListingPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
              {activeGmp >= 0 ? `+₹${activeGmp}` : `-₹${Math.abs(activeGmp)}`} premium
            </p>
          </div>

          <div className="bg-white dark:bg-[#171B20] p-3.5 rounded-lg border border-gray-200 dark:border-[#252A31]">
            <p className="text-[10.5px] text-gray-500 dark:text-[#9AA1AA] font-medium mb-1">
              Est. Total Value
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#F1F5F9] tabular-nums">
              ₹{estimatedTotalValue.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-[#9AA1AA] mt-0.5">
              At listing price
            </p>
          </div>

          <div className={`p-3.5 rounded-lg border transition-colors ${
            isProfitPositive
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
              : isProfitNegative
              ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40"
              : "bg-gray-50 dark:bg-[#171B20] border-gray-200 dark:border-[#252A31]"
          }`}>
            <p className={`text-[10.5px] font-medium mb-1 ${
              isProfitPositive
                ? "text-emerald-700 dark:text-emerald-400"
                : isProfitNegative
                ? "text-rose-700 dark:text-rose-400"
                : "text-gray-500 dark:text-[#9AA1AA]"
            }`}>
              Est. Listing Profit
            </p>
            <p className={`text-base sm:text-lg font-bold tabular-nums ${
              isProfitPositive
                ? "text-emerald-700 dark:text-emerald-300"
                : isProfitNegative
                ? "text-rose-700 dark:text-rose-300"
                : "text-gray-900 dark:text-[#F1F5F9]"
            }`}>
              {isProfitPositive ? "+" : ""}₹{estimatedProfit.toLocaleString("en-IN")}
            </p>
            <p className={`text-[10px] font-semibold mt-0.5 ${
              isProfitPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isProfitNegative
                ? "text-rose-600 dark:text-rose-400"
                : "text-gray-500 dark:text-[#9AA1AA]"
            }`}>
              {returnPercentage >= 0 ? "+" : ""}{returnPercentage.toFixed(1)}% Return
            </p>
          </div>
        </div>
      </div>

      <p
        className="text-[11px] text-gray-500 dark:text-[#9AA1AA] pt-2 border-t border-gray-100 dark:border-[#252A31]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Estimates assume 100% allotment and listing at the indicated GMP rate of ₹{activeGmp}. Grey Market Premium is an unofficial and non-binding indicator. For allotment probabilities, review the <a href="#subscription" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Subscription Demand</a> section.
      </p>
    </section>
  );
}
