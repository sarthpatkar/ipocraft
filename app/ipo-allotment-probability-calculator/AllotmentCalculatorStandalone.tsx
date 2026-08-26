"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalculatorIcon } from "@heroicons/react/24/outline";

type Category = "Retail" | "sNII" | "bNII";

export default function AllotmentCalculatorStandalone() {
  const searchParams = useSearchParams();

  // Pre-fill from URL params when linked from an IPO detail page
  const defaultSub = searchParams.get("sub") ?? "";
  const rawCat = searchParams.get("cat") ?? "";
  const defaultCat: Category =
    (["Retail", "sNII", "bNII"] as Category[]).includes(rawCat as Category)
      ? (rawCat as Category)
      : "Retail";

  const [category, setCategory] = useState<Category>(defaultCat);
  const [subscriptionMultiple, setSubscriptionMultiple] = useState<string>(defaultSub);
  const [totalRetailApps, setTotalRetailApps] = useState<string>("");

  const multiple = parseFloat(subscriptionMultiple) || 0;
  const totalApps = parseFloat(totalRetailApps) || null;

  let probability = 0;
  let ratioText = "";
  let explanation = "";
  let showLotWarning = false;

  if (multiple === 0) {
    probability = 0;
    ratioText = "—";
    explanation = "Enter the subscription multiple above to calculate your allotment probability.";
  } else if (multiple <= 1) {
    probability = 100;
    ratioText = "All allotted";
    explanation = `The ${category} category is undersubscribed or exactly 1x. All valid applications will receive full allotment.`;
  } else if (category === "bNII") {
    probability = Math.min(100, (1 / multiple) * 100);
    ratioText = `1 in ${Math.round(multiple)}`;
    explanation = `bNII (above ₹10L) uses proportional allotment — not a draw. At ${multiple.toFixed(2)}x subscription, each applicant may receive approximately ${(100 / multiple).toFixed(1)}% of lots applied for.`;
  } else {
    // Retail / sNII draw
    if (category === "Retail" && totalApps != null && totalApps > 0) {
      // Exact calculation
      const allottableCount = Math.max(1, Math.floor(totalApps / multiple));
      probability = Math.min(100, (allottableCount / totalApps) * 100);
      ratioText = `1 in ${Math.round(totalApps / allottableCount)}`;
      explanation = `Based on ${totalApps.toLocaleString("en-IN")} total retail applications and ${multiple.toFixed(2)}x subscription. Approximately ~${allottableCount.toLocaleString("en-IN")} applicants are selected via computerized draw.`;
    } else {
      probability = (1 / multiple) * 100;
      const ratioNum = Math.round(multiple);
      ratioText = `1 in ${ratioNum}`;
      explanation = `${category === "sNII" ? "sNII (₹2L–₹10L) uses a computerized draw. " : ""}The ${category} category is subscribed ${multiple.toFixed(2)}x. In an oversubscribed issue, approximately 1 in every ${ratioNum} valid applications will be allotted 1 lot via computerized draw.`;
    }
    showLotWarning = multiple > 1.05;
  }

  const probFormatted =
    multiple === 0 ? "—" : `${Math.min(100, Math.max(0, probability)).toFixed(1)}%`;

  return (
    <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5 sm:p-7 shadow-sm">
      <div className="pb-4 border-b border-gray-100 dark:border-[#252A31] flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1" style={{ fontFamily: "var(--font-inter)" }}>
            Probability Estimate
          </p>
          <p className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
            Allotment Probability Calculator
          </p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-[#171B20] text-gray-500 dark:text-[#9AA1AA] rounded-lg">
          <CalculatorIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Category Tabs */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
            Investor Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Retail", "sNII", "bNII"] as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 rounded-lg text-[13px] font-semibold transition-colors border ${
                  category === cat
                    ? "bg-[#1C317A] text-white border-[#1C317A] shadow-xs"
                    : "bg-gray-50 dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] border-gray-200 dark:border-[#252A31] hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {cat === "Retail" ? "Retail (≤ ₹2L)" : cat === "sNII" ? "sNII (₹2L–₹10L)" : "bNII (> ₹10L)"}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Multiple Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
              Subscription Multiple (Times)
            </label>
            <span className="text-[11.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums" style={{ fontFamily: "var(--font-inter)" }}>
              {multiple.toFixed(1)}x
            </span>
          </div>
          <input
            type="number"
            min={0}
            max={500}
            step={0.1}
            value={subscriptionMultiple}
            onChange={(e) => setSubscriptionMultiple(e.target.value)}
            placeholder="e.g. 47.5"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] text-[14px] font-medium outline-none focus:border-[#1C317A] dark:focus:border-[#3D5BA9] transition-colors tabular-nums"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[1.5, 5, 15, 30, 60, 120].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSubscriptionMultiple(String(preset))}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                  parseFloat(subscriptionMultiple) === preset
                    ? "bg-[#1C317A] text-white border-[#1C317A]"
                    : "bg-gray-100 dark:bg-[#171B20] text-gray-600 dark:text-[#9AA1AA] border-gray-200 dark:border-[#252A31] hover:border-gray-400"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {preset}x
              </button>
            ))}
          </div>
        </div>

        {/* Optional: Total retail applications for exact formula */}
        {category === "Retail" && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA] mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>
              Total Retail Applications <span className="normal-case font-normal text-gray-400 dark:text-[#64748B]">(optional — enables exact calculation)</span>
            </label>
            <input
              type="number"
              min={0}
              value={totalRetailApps}
              onChange={(e) => setTotalRetailApps(e.target.value)}
              placeholder="e.g. 1420000"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#252A31] bg-gray-50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] text-[13.5px] outline-none focus:border-[#1C317A] dark:focus:border-[#3D5BA9] transition-colors tabular-nums"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            <p className="text-[11px] text-gray-400 dark:text-[#6B7280] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Available on exchange disclosure after Day 1. Enables exact computerized draw odds.
            </p>
          </div>
        )}

        {/* Results Card */}
        <div className="mt-5 rounded-xl border border-gray-200 dark:border-[#252A31] bg-gray-50/70 dark:bg-[#161B22] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-500 dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
              Allotment Chance
            </span>
            <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[#1C317A] dark:text-[#93B4FF]" style={{ fontFamily: "var(--font-inter)" }}>
              {ratioText}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[2.25rem] sm:text-[2.5rem] font-bold text-[#0f172a] dark:text-[#F1F5F9] tabular-nums leading-none" style={{ fontFamily: "var(--font-outfit)" }}>
              {probFormatted}
            </span>
            <span className="text-[13px] text-gray-500 dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
              probability of receiving 1 lot
            </span>
          </div>

          <p className="text-[12.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed border-t border-gray-200/80 dark:border-[#252A31] pt-3" style={{ fontFamily: "var(--font-inter)" }}>
            {explanation}
          </p>

          {/* Warning on applying multiple lots in oversubscribed retail */}
          {showLotWarning && category === "Retail" && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3 text-[12px] text-amber-800 dark:text-amber-300 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              ⚠️ Applying for more lots does <strong>NOT</strong> improve your odds. In oversubscribed retail categories, each application receives 1 draw entry regardless of lots applied.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
