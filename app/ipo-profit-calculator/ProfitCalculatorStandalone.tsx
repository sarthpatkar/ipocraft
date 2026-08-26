"use client";

import React, { useState, useMemo } from "react";

export default function ProfitCalculatorStandalone() {
  const [issuePrice, setIssuePrice] = useState<string>("");
  const [lotSize, setLotSize] = useState<string>("");
  const [gmp, setGmp] = useState<string>("");
  const [lots, setLots] = useState<number>(1);

  const ip = parseFloat(issuePrice) || 0;
  const ls = parseInt(lotSize) || 0;
  const gmpVal = parseFloat(gmp) || 0;

  const retailMaxLots = ip > 0 && ls > 0 ? Math.max(1, Math.floor(200000 / (ls * ip))) : 13;

  const results = useMemo(() => {
    if (ip <= 0 || ls <= 0) return null;
    const totalShares = lots * ls;
    const totalInvestment = totalShares * ip;
    const estimatedListingPrice = Math.max(0, ip + gmpVal);
    const profitPerShare = gmpVal;
    const totalProfit = totalShares * profitPerShare;
    const returnPct = ip > 0 ? (gmpVal / ip) * 100 : 0;
    const estimatedTotalValue = totalShares * estimatedListingPrice;
    return { totalShares, totalInvestment, estimatedListingPrice, totalProfit, returnPct, estimatedTotalValue };
  }, [ip, ls, gmpVal, lots]);

  const isPositive = (results?.totalProfit ?? 0) > 0;
  const isNegative = (results?.totalProfit ?? 0) < 0;
  const profitColor = isPositive ? "text-emerald-600 dark:text-emerald-400" : isNegative ? "text-red-600 dark:text-red-400" : "text-[#0f172a] dark:text-[#F1F5F9]";

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

  return (
    <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5 sm:p-7 shadow-sm">
      <div className="pb-4 border-b border-gray-100 dark:border-[#252A31] mb-5">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1" style={{ fontFamily: "var(--font-inter)" }}>Tools</p>
        <p className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>Listing Profit Calculator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          {/* Issue Price + Lot Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
                Issue Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 480"
                value={issuePrice}
                onChange={e => setIssuePrice(e.target.value)}
                className="w-full px-3 py-2.5 text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C317A] dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-[#4A515C] transition-all"
                style={{ fontFamily: "var(--font-outfit)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
                Lot Size (shares)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 31"
                value={lotSize}
                onChange={e => setLotSize(e.target.value)}
                className="w-full px-3 py-2.5 text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C317A] dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-[#4A515C] transition-all"
                style={{ fontFamily: "var(--font-outfit)" }}
              />
            </div>
          </div>

          {/* GMP */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
              GMP / Expected Gain per Share (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 120  (use negative for discount)"
              value={gmp}
              onChange={e => setGmp(e.target.value)}
              className="w-full px-3 py-2.5 text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C317A] dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-[#4A515C] transition-all"
              style={{ fontFamily: "var(--font-outfit)" }}
            />
            <p className="text-[11px] text-[#64748b] dark:text-[#9AA1AA] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Check live GMP on <a href="/gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPOCraft&apos;s GMP page</a> or each IPO&apos;s detail page
            </p>
          </div>

          {/* Lots */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
              Lots Applied
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 5, retailMaxLots].filter((v, i, a) => a.indexOf(v) === i).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setLots(n)}
                  className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-all ${lots === n ? "bg-[#0f172a] text-white dark:bg-white dark:text-black border-[#0f172a] dark:border-white shadow-sm" : "bg-white dark:bg-[#171B20] border-gray-200 dark:border-[#252A31] text-gray-600 dark:text-[#9AA1AA] hover:border-gray-400"}`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {n === retailMaxLots ? `${n} (Max)` : `${n} Lot${n > 1 ? "s" : ""}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 dark:bg-[#171B20] rounded-xl p-5 border border-gray-200 dark:border-[#252A31] flex flex-col justify-center gap-4">
          {results ? (
            <>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                  Estimated Listing Profit
                </p>
                <p className={`text-4xl sm:text-5xl font-bold tabular-nums tracking-tight ${profitColor}`} style={{ fontFamily: "var(--font-outfit)" }}>
                  {isNegative ? "−" : "+"}₹{fmt(Math.abs(results.totalProfit))}
                </p>
                <p className={`text-[13px] font-semibold mt-1.5 ${profitColor}`} style={{ fontFamily: "var(--font-inter)" }}>
                  {fmtPct(results.returnPct)} return
                </p>
              </div>

              <div className="space-y-2 bg-white dark:bg-[#111418] rounded-lg p-4 border border-gray-200 dark:border-[#252A31]">
                {[
                  { label: "Total Investment", value: `₹${fmt(results.totalInvestment)}` },
                  { label: "Estimated Listing Price", value: `₹${fmt(results.estimatedListingPrice)}` },
                  { label: "Estimated Exit Value", value: `₹${fmt(results.estimatedTotalValue)}` },
                  { label: "Total Shares", value: `${fmt(results.totalShares)} shares` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-[12.5px]" style={{ fontFamily: "var(--font-inter)" }}>
                    <span className="text-[#64748b] dark:text-[#9AA1AA]">{label}</span>
                    <span className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#94a3b8] dark:text-[#6B7280] text-center leading-snug" style={{ fontFamily: "var(--font-inter)" }}>
                Estimate based on GMP. Actual listing price may differ. Does not account for taxes or brokerage.
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-[13px] text-[#64748b] dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
                Enter issue price and lot size to calculate your estimated profit.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
