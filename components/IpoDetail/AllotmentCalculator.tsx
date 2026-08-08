"use client";

import React, { useState } from "react";
import { CalculatorIcon as Calculator } from "@heroicons/react/24/outline";

type Category = "Retail" | "sNII" | "bNII";

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
  let expectedLots = 0;
  let explanation = "";

  if (multiple === 0) {
    probability = 0;
    expectedLots = 0;
    explanation = "Subscription data is currently unavailable.";
  } else if (multiple <= 1) {
    probability = 100;
    expectedLots = lots;
    explanation = `The ${category} category is undersubscribed or exactly 1x. You will receive 100% of the lots you applied for.`;
  } else {
    // Oversubscribed SEBI Lottery Rule
    probability = (1 / multiple) * 100;
    expectedLots = 1; // You can never win more than 1 base lot in an oversubscribed SEBI lottery
    
    explanation = `The ${category} category is oversubscribed by ${multiple.toFixed(
      2
    )}x. Under SEBI rules, allotment is done via a draw of lots (lottery). Every successful applicant gets a maximum of 1 lot, regardless of how many lots they applied for.`;
  }

  // Format prob
  const probFormatted = multiple === 0 ? "—" : `${Math.min(100, Math.max(0, probability)).toFixed(1)}%`;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden mb-10 sm:mb-12 shadow-sm">
      <div className="px-6 py-5 border-b border-[#f1f5f9] flex items-center gap-3 bg-gradient-to-r from-indigo-50/50 to-white">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-[#0f172a] text-[15px]" style={{ fontFamily: "var(--font-outfit)" }}>
            Allotment Probability Calculator
          </h3>
          <p className="text-[12px] text-[#64748b] leading-tight mt-0.5">
            SEBI-compliant allotment prediction based on live subscription data.
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-2 uppercase tracking-wide">
                Investor Category
              </label>
              <div className="flex gap-2">
                {(["Retail", "sNII", "bNII"] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-1 py-2 text-[13px] font-semibold rounded-lg border transition-all ${
                      category === cat
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-2 uppercase tracking-wide flex justify-between">
                <span>Lots Applied</span>
                <span className="text-indigo-600">{lots} Lot{lots > 1 ? "s" : ""}</span>
              </label>
              <input
                type="range"
                min="1"
                max={category === "Retail" ? 13 : category === "sNII" ? 68 : 100}
                value={lots}
                onChange={(e) => setLots(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
                <span>1 Lot</span>
                <span>Max {category === "Retail" ? "13 (₹2L Limit)" : category === "sNII" ? "68 (₹10L Limit)" : "Unlimited"}</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10 text-center mb-4">
              <p className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-1">
                Chance of Allotment
              </p>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                {probFormatted}
              </p>
            </div>

            <div className="relative z-10 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-indigo-50/50">
              <p className="text-[12.5px] text-[#334155] leading-relaxed text-center">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
