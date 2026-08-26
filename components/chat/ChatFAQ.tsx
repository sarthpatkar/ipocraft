"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FAQItem {
  name: string;
  acceptedAnswer: { text: string };
}

export default function ChatFAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-[#252A31] rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white dark:bg-[#111418] hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors"
          >
            <span className="text-[13.5px] font-medium text-[#0f172a] dark:text-[#F1F5F9] pr-4">
              {item.name}
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 shrink-0 text-gray-400 dark:text-[#9AA1AA] transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="px-4 pb-4 pt-1 bg-white dark:bg-[#111418] border-t border-gray-100 dark:border-[#1F242C]">
              <p className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
                {item.acceptedAnswer.text}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
