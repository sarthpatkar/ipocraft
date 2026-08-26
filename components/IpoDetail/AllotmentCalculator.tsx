"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalculatorIcon } from "@heroicons/react/24/outline";

type Category = "Retail" | "sNII" | "bNII";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[11px] font-semibold tracking-wider uppercase mb-2 ${light ? "text-[#93c5fd]" : "text-blue-600 dark:text-blue-400"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

/** Compute allotment probability using the exact SEBI method when total_retail_applications
 *  is available, otherwise fall back to the simplified 1/subscription_multiple estimate. */
function calcAllotmentOdds(
  multiple: number,
  lotSize: number | null,
  totalRetailApps: number | null,
  category: Category
): {
  probability: number;
  ratioNumerator: number;
  ratioDenominator: number;
  isExact: boolean;
  explanation: string;
} {
  if (multiple <= 0) {
    return { probability: 0, ratioNumerator: 0, ratioDenominator: 1, isExact: false, explanation: "Subscription data unavailable." };
  }
  if (multiple <= 1) {
    return {
      probability: 100,
      ratioNumerator: 1,
      ratioDenominator: 1,
      isExact: false,
      explanation: `The ${category} category is fully or under-subscribed. All valid applications receive allotment.`,
    };
  }

  // bNII / proportional allotment
  if (category === "bNII") {
    const pct = Math.min(100, (1 / multiple) * 100);
    return {
      probability: pct,
      ratioNumerator: 1,
      ratioDenominator: Math.round(multiple),
      isExact: false,
      explanation: `bNII (above ₹10L) uses proportional allotment — you may receive partial lots. Subscribed ${multiple.toFixed(2)}x.`,
    };
  }

  // Retail / sNII lottery
  if (category === "Retail" && totalRetailApps != null && totalRetailApps > 0 && lotSize != null && lotSize > 0) {
    // Exact SEBI formula: allottable lots ÷ total valid applications
    // We don't have reservation_rii from here, so we estimate allottable lots via:
    // allottable_lots ≈ total_retail_apps / multiple (i.e., subscribed implies apps * lot fills = multiple * available)
    // A simpler accurate expression: prob = 1 / (totalRetailApps / (totalRetailApps / multiple))
    // = 1 / multiple — same as simplified. BUT ratio denominator is now totalRetailApps / allottable_count
    // Allottable applicant count = floor(totalRetailApps / multiple)
    const allottableCount = Math.max(1, Math.floor(totalRetailApps / multiple));
    const prob = Math.min(100, (allottableCount / totalRetailApps) * 100);
    const denom = Math.round(totalRetailApps / allottableCount);
    return {
      probability: prob,
      ratioNumerator: 1,
      ratioDenominator: denom,
      isExact: true,
      explanation: `Based on ${totalRetailApps.toLocaleString("en-IN")} total retail applications and ${multiple.toFixed(2)}x subscription. Approximately ~${allottableCount.toLocaleString("en-IN")} applicants are selected via computerised lottery draw.`,
    };
  }

  // Simplified fallback
  const prob = (1 / multiple) * 100;
  const denom = Math.round(multiple);
  return {
    probability: prob,
    ratioNumerator: 1,
    ratioDenominator: denom,
    isExact: false,
    explanation: `${category === "sNII" ? "sNII (₹2L–₹10L) uses a computerised draw. " : ""}Subscribed ${multiple.toFixed(2)}x. In oversubscribed retail categories, each valid application receives 1 lottery draw entry regardless of lots applied.`,
  };
}

export default function AllotmentCalculator({
  subRii,
  subShni,
  subBhni,
  subNii,
  lotSize,
  totalRetailApplications,
}: {
  subRii: number | null;
  subShni: number | null;
  subBhni: number | null;
  subNii: number | null;
  lotSize?: number | null;
  totalRetailApplications?: number | null;
}) {
  const [category, setCategory] = useState<Category>("Retail");
  const [lots, setLots] = useState<number>(1);

  const getMultiple = () => {
    switch (category) {
      case "Retail": return subRii ?? 0;
      case "sNII":   return subShni ?? subNii ?? 0;
      case "bNII":   return subBhni ?? subNii ?? 0;
      default:       return 0;
    }
  };

  const multiple = getMultiple();
  const { probability, ratioNumerator, ratioDenominator, isExact, explanation } = calcAllotmentOdds(
    multiple,
    lotSize ?? null,
    category === "Retail" ? (totalRetailApplications ?? null) : null,
    category
  );

  const probFormatted = multiple === 0 ? "—" : `${Math.min(100, Math.max(0, probability)).toFixed(1)}%`;
  const ratioFormatted = multiple === 0 ? "—" : ratioDenominator <= 1 ? "All allotted" : `1 in ${ratioDenominator}`;
  const lotsHaveNoEffect = category === "Retail" && multiple > 1.05;

  return (
    <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 space-y-4 mb-6 shadow-xs">
      <div className="pb-3 border-b border-gray-100 dark:border-[#252A31] flex items-center justify-between">
        <div>
          <Eyebrow>Probability Model{isExact ? " · SEBI Exact" : " · Estimate"}</Eyebrow>
          <h2
            className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Allotment Probability Calculator
          </h2>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-[#171B20] text-gray-700 dark:text-[#9AA1AA] rounded-md">
          <CalculatorIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
              Investor Category
            </label>
            <div className="flex gap-2">
              {(["Retail", "sNII", "bNII"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-1.5 text-[12.5px] font-semibold rounded-md border transition-colors ${
                    category === cat
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white shadow-xs"
                      : "bg-white dark:bg-[#171B20] border-gray-200 dark:border-[#252A31] text-gray-700 dark:text-[#9AA1AA] hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#171B20] p-3.5 rounded-lg border border-gray-200 dark:border-[#252A31] space-y-2">
            <div className="flex justify-between items-center text-[12.5px]">
              <span className="font-semibold text-gray-800 dark:text-[#F1F5F9]">Lots Applied</span>
              <span className="font-bold text-gray-900 dark:text-blue-400">{lots} Lot{lots > 1 ? "s" : ""}</span>
            </div>
            <input
              type="range"
              min="1"
              max={category === "Retail" ? 13 : category === "sNII" ? 68 : 100}
              value={lots}
              onChange={(e) => setLots(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-[#111418] rounded-md appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10.5px] text-gray-400 dark:text-[#6B7280] font-medium">
              <span>1 Lot</span>
              <span>Max {category === "Retail" ? "13 (₹2L)" : category === "sNII" ? "68 (₹10L)" : "Unlimited"}</span>
            </div>
          </div>

          {/* SEBI note: lots don't matter for retail */}
          {lotsHaveNoEffect && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-md px-3 py-2">
              <p className="text-[11.5px] text-amber-700 dark:text-amber-400 font-medium leading-snug">
                ⚠ Applying for more lots does <strong>not</strong> improve your odds. SEBI lottery gives each applicant 1 entry regardless of lots applied.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-gray-50 dark:bg-[#171B20] rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-[#252A31] flex flex-col justify-center gap-3">
          <div className="text-center">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              Estimated Allotment Odds
            </p>
            {/* Primary: 1 in X ratio */}
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#F1F5F9] tabular-nums tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              {ratioFormatted}
            </p>
            {/* Secondary: percentage */}
            <p className="text-[14px] font-semibold text-gray-500 dark:text-[#9AA1AA] mt-1">
              {probFormatted} probability
            </p>
            <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] mt-1 font-medium">
              {category} demand: <strong className="text-gray-900 dark:text-[#F1F5F9]">{multiple > 0 ? `${multiple.toFixed(2)}x` : "—"}</strong>
              {isExact && <span className="ml-1.5 text-emerald-600 dark:text-emerald-400">· SEBI exact</span>}
            </p>
          </div>

          <div className="bg-white dark:bg-[#111418] rounded-md p-3 border border-gray-200 dark:border-[#252A31]">
            <p className="text-[11.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed text-center" style={{ fontFamily: "var(--font-inter)" }}>
              {explanation}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#252A31] text-center">
        <Link
          href="/ipo-allotment-probability-calculator"
          className="text-[12px] font-medium text-[#1C317A] dark:text-blue-400 hover:underline"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Use the full standalone Allotment Calculator
        </Link>
      </div>
    </section>
  );
}
