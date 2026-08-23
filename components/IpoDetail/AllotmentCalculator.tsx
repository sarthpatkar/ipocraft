"use client";

import React, { useState } from "react";
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

export default function AllotmentCalculator({
  subRii,
  subShni,
  subBhni,
  subNii, // Fallback if sNII/bNII not available
}: {
  subRii: number | null;
  subShni: number | null;
  subBhni: number | null;
  subNii: number | null;
}) {
  const [category, setCategory] = useState<Category>("Retail");
  const [lots, setLots] = useState<number>(1);

  // Determine the actual multiple based on category
  const getMultiple = () => {
    switch (category) {
      case "Retail":
        return subRii ?? 0;
      case "sNII":
        return subShni ?? subNii ?? 0;
      case "bNII":
        return subBhni ?? subNii ?? 0;
      default:
        return 0;
    }
  };

  const multiple = getMultiple();

  // SEBI Logic Calculation
  let probability = 0;
  let explanation = "";

  if (multiple === 0) {
    probability = 0;
    explanation = "Subscription data is currently unavailable.";
  } else if (multiple <= 1) {
    probability = 100;
    explanation = `The ${category} category is undersubscribed or exactly 1x. All valid applications are allotted in full.`;
  } else {
    // Oversubscribed SEBI Lottery Rule
    probability = (1 / multiple) * 100;
    explanation = `The ${category} category is subscribed ${multiple.toFixed(
      2
    )}x. Under SEBI lottery allocation rules, allotment is conducted via computerized draw. Each successful applicant receives a maximum of 1 lot regardless of the number of lots applied for.`;
  }

  // Format prob
  const probFormatted = multiple === 0 ? "-" : `${Math.min(100, Math.max(0, probability)).toFixed(1)}%`;

  return (
    <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 space-y-4 mb-6 shadow-xs">
      <div className="pb-3 border-b border-gray-100 dark:border-[#252A31] flex items-center justify-between">
        <div>
          <Eyebrow>Probability Model</Eyebrow>
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
        </div>

        {/* Results */}
        <div className="bg-gray-50 dark:bg-[#171B20] rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-[#252A31] flex flex-col justify-center">
          <div className="text-center mb-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              Estimated Chance of Allotment
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#F1F5F9] tabular-nums tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              {probFormatted}
            </p>
            <p className="text-[11.5px] text-gray-500 dark:text-[#9AA1AA] mt-1 font-medium">
              Current Category Demand: <strong className="text-gray-900 dark:text-[#F1F5F9]">{multiple > 0 ? `${multiple.toFixed(2)}x` : "-"}</strong>
            </p>
          </div>

          <div className="bg-white dark:bg-[#111418] rounded-md p-3 border border-gray-200 dark:border-[#252A31]">
            <p className="text-[11.5px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed text-center" style={{ fontFamily: "var(--font-inter)" }}>
              {explanation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
