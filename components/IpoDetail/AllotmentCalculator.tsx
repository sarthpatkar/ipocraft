"use client";

import React, { useState } from "react";
import { CalculatorIcon } from "@heroicons/react/24/outline";

type Category = "Retail" | "sNII" | "bNII";

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
  const probFormatted = multiple === 0 ? "—" : `${Math.min(100, Math.max(0, probability)).toFixed(1)}%`;

  return (
    <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 space-y-4 mb-6 shadow-xs">
      <div className="pb-3 border-b border-[#f1f5f9] dark:border-[#22304A] flex items-center justify-between">
        <div>
          <Eyebrow>Probability Model</Eyebrow>
          <h2
            className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Allotment Probability Calculator
          </h2>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-[#162238] text-gray-700 dark:text-[#94A3B8] rounded-lg">
          <CalculatorIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
              Investor Category
            </label>
            <div className="flex gap-2">
              {(["Retail", "sNII", "bNII"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-1.5 text-[12.5px] font-semibold rounded-lg border transition-colors ${
                    category === cat
                      ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-[#162238] dark:border-[#3B82F6] dark:text-[#3B82F6]"
                      : "bg-white dark:bg-[#0D1525] border-gray-200 dark:border-[#22304A] text-gray-700 dark:text-[#CBD5E1] hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#f8fafc] dark:bg-[#0D1525] p-3.5 rounded-xl border border-gray-200 dark:border-[#22304A] space-y-2">
            <div className="flex justify-between items-center text-[12.5px]">
              <span className="font-semibold text-gray-800 dark:text-[#F1F5F9]">Lots Applied</span>
              <span className="font-bold text-gray-900 dark:text-[#3B82F6]">{lots} Lot{lots > 1 ? "s" : ""}</span>
            </div>
            <input
              type="range"
              min="1"
              max={category === "Retail" ? 13 : category === "sNII" ? 68 : 100}
              value={lots}
              onChange={(e) => setLots(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-[#162238] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
            />
            <div className="flex justify-between text-[10.5px] text-gray-400 dark:text-[#64748B] font-medium">
              <span>1 Lot</span>
              <span>Max {category === "Retail" ? "13 (₹2L)" : category === "sNII" ? "68 (₹10L)" : "Unlimited"}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#f8fafc] dark:bg-[#0D1525] rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-[#22304A] flex flex-col justify-center">
          <div className="text-center mb-3">
            <p className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              Estimated Chance of Allotment
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#F1F5F9] tabular-nums tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              {probFormatted}
            </p>
            <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">
              Current Category Demand: <strong className="text-gray-900 dark:text-[#F1F5F9]">{multiple > 0 ? `${multiple.toFixed(2)}x` : "—"}</strong>
            </p>
          </div>

          <div className="bg-white dark:bg-[#111B2D] rounded-lg p-3 border border-gray-200 dark:border-[#22304A]">
            <p className="text-[11.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed text-center" style={{ fontFamily: "var(--font-inter)" }}>
              {explanation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
