"use client";

import React, { useState } from "react";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-4 ${light ? "text-[#93c5fd]" : "text-[#2563eb]"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

export default function ProfitCalculator({ ipo }: { ipo: any }) {
  const [lots, setLots] = useState<number>(1);

  if (ipo.gmp == null || ipo.lot_size == null) {
    return null;
  }

  const estimatedProfit = lots * ipo.lot_size * ipo.gmp;
  const issuePriceRaw = ipo.price_max ?? ipo.price_min;
  const investedAmount = issuePriceRaw ? lots * ipo.lot_size * issuePriceRaw : 0;
  
  return (
    <section className="bg-white border border-[#e2e8f0] rounded-lg p-6 md:p-8 space-y-4 mb-10 sm:mb-12">
      <div className="pb-4 border-b border-[#f1f5f9]">
        <Eyebrow>Tools</Eyebrow>
        <h2
          className="text-[1.35rem] sm:text-[1.5rem] font-semibold text-[#0f172a] leading-snug"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Listing Profit Calculator
        </h2>
      </div>
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          Lots Applied: {lots}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={lots}
          onChange={(e) => setLots(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-6"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Investment</p>
            <p className="text-lg font-bold text-gray-900">₹{investedAmount.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">Est. Profit</p>
            <p className="text-lg font-bold text-emerald-700">₹{estimatedProfit.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
      <p
        className="text-[12px] text-[#64748b] mt-4"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Based on current GMP of ₹{ipo.gmp}. GMP is indicative and does not guarantee listing returns.
      </p>
    </section>
  );
}
