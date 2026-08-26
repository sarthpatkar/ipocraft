"use client";

import React from "react";
import {
  ChartBarIcon,
  UsersIcon,
  CalculatorIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";

const HERO_PROMPTS = [
  {
    title: "Live GMP",
    description: "Grey Market Premium & expected listing gain of open IPOs",
    query: "What is the GMP and estimated listing price of all open IPOs right now?",
    icon: ChartBarIcon,
  },
  {
    title: "Subscription Ratios",
    description: "QIB, NII, and Retail subscription multiples of active issues",
    query: "Compare subscription multiples of all active IPOs across QIB, NII, and Retail.",
    icon: UsersIcon,
  },
  {
    title: "Allotment Odds",
    description: "Computerized lottery probability for oversubscribed retail IPOs",
    query: "What are my retail allotment chances for a 50x subscribed IPO under the lottery model?",
    icon: CalculatorIcon,
  },
  {
    title: "Compare Issues",
    description: "Side-by-side: issue size, price band, valuation, GMP",
    query: "Compare the top active Mainboard IPOs side-by-side by valuation, GMP, and dates.",
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
  // Follow-up chips after a response — flat, minimal
  if (followUpSuggestions && followUpSuggestions.length > 0) {
    return (
      <div className="flex flex-wrap gap-1.5 pt-1">
        {followUpSuggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => onSelect(text)}
            className="inline-flex items-center text-[12px] font-medium text-[#1C317A] dark:text-[#93B4FF] border border-[#1C317A]/20 dark:border-[#93B4FF]/20 rounded px-2.5 py-1 hover:bg-[#1C317A]/5 dark:hover:bg-[#93B4FF]/5 transition-colors text-left"
          >
            {text}
          </button>
        ))}
      </div>
    );
  }

  // Empty state — centered, clean, no cards
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-8 sm:py-14 px-4">
      {/* Wordmark */}
      <div className="mb-6 text-center">
        <div className="w-10 h-10 rounded-lg bg-[#1C317A] text-white flex items-center justify-center font-bold text-[13px] tracking-tight mx-auto mb-3">
          IC
        </div>
        <h2
          className="text-[18px] sm:text-[20px] font-bold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO Research Assistant
        </h2>
        <p className="text-[12.5px] text-gray-400 dark:text-[#6B7280]">
          GMP · Subscription data · Allotment odds · Listing dates
        </p>
      </div>

      {/* Prompt grid — 2×2, flat bordered, no shadow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {HERO_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelect(item.query)}
              className="group flex items-start gap-3 text-left px-3.5 py-3 border border-gray-200 dark:border-[#252A31] rounded-lg hover:border-[#1C317A]/40 dark:hover:border-[#3D5BA9] hover:bg-gray-50/60 dark:hover:bg-[#14181F] transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-400 dark:text-[#6B7280] shrink-0 mt-0.5 group-hover:text-[#1C317A] dark:group-hover:text-[#93B4FF] transition-colors" />
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-[#0f172a] dark:text-[#E8EDF3] leading-none mb-0.5 group-hover:text-[#1C317A] dark:group-hover:text-[#93B4FF] transition-colors">
                  {item.title}
                </p>
                <p className="text-[11.5px] text-gray-400 dark:text-[#5A6070] leading-snug">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
