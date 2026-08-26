"use client";

import React from "react";
import {
  ChartBarIcon,
  UsersIcon,
  CalculatorIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { PromptSuggestion } from "./types";

const HERO_PROMPTS: (PromptSuggestion & { icon: React.ComponentType<{ className?: string }> })[] = [
  {
    title: "Live GMP Tracker",
    description: "What is the Grey Market Premium and expected listing gain of open IPOs?",
    query: "What is the GMP and estimated listing price of all open IPOs right now?",
    badge: "Live",
    icon: ChartBarIcon,
  },
  {
    title: "Subscription Demand Ratios",
    description: "Compare total, QIB, NII, and Retail subscription multiples of active issues",
    query: "Compare subscription multiples of all active IPOs across QIB, NII, and Retail.",
    badge: "Bidding",
    icon: UsersIcon,
  },
  {
    title: "Allotment Probability Model",
    description: "Calculate computerized lottery odds for a 50x oversubscribed retail IPO",
    query: "What are my retail allotment chances for a 50x subscribed IPO under the lottery model?",
    badge: "Odds Model",
    icon: CalculatorIcon,
  },
  {
    title: "Compare Active Issues",
    description: "Side-by-side comparison of issue sizes, price bands, and GMPs",
    query: "Compare the top active Mainboard IPOs side-by-side by valuation, GMP, and dates.",
    badge: "Comparison",
    icon: ArrowsRightLeftIcon,
  },
];

interface ChatSuggestionsProps {
  onSelect: (query: string) => void;
  followUpSuggestions?: string[];
}

export default function ChatSuggestions({
  onSelect,
  followUpSuggestions,
}: ChatSuggestionsProps) {
  // ── Dynamic follow-up chips (shown beneath assistant responses) ──
  if (followUpSuggestions && followUpSuggestions.length > 0) {
    return (
      <div className="flex flex-wrap gap-1.5 pt-2 pb-1">
        {followUpSuggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => onSelect(text)}
            className="inline-flex items-center text-[12px] font-medium text-[#1C317A] dark:text-[#93B4FF] bg-blue-50/70 dark:bg-[#131A26] border border-blue-100/90 dark:border-[#223049] rounded-md px-2.5 py-1 hover:bg-blue-100/80 dark:hover:bg-[#1B273A] transition-all text-left shadow-2xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span>{text}</span>
          </button>
        ))}
      </div>
    );
  }

  // ── Empty State 2x2 Hero Prompt Grid ──
  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#131A26] border border-blue-100 dark:border-[#223049] text-[#1C317A] dark:text-[#93B4FF] text-[11px] font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-Time Indian IPO Analytics</span>
        </div>
        <h2
          className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F8FAFC] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          What would you like to research today?
        </h2>
        <p className="text-[13px] sm:text-[13.5px] text-[#475569] dark:text-[#9AA1AA] max-w-md mx-auto leading-relaxed">
          Ask about live GMP, subscription demand, retail allotment odds, or historical listing track records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {HERO_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelect(item.query)}
              className="group flex flex-col text-left p-4 rounded-xl border bg-white dark:bg-[#111418] border-gray-200/90 dark:border-[#222731] hover:border-[#1C317A] dark:hover:border-[#3D5BA9] transition-all shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1C317A]/10 dark:bg-[#1C317A]/25 text-[#1C317A] dark:text-[#93B4FF] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F8FAFC] group-hover:text-[#1C317A] dark:group-hover:text-[#93B4FF] transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
                    {item.title}
                  </span>
                </div>
                {item.badge && (
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1C317A] dark:text-[#93B4FF] uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-gray-500 dark:text-[#8E97A6] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

