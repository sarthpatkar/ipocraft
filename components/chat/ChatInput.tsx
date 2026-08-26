"use client";

import React, { useRef, useEffect } from "react";
import {
  ArrowUpIcon,
  StopIcon,
} from "@heroicons/react/24/solid";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

const QUICK_PILLS = [
  { label: "Live Open GMPs", query: "What is the GMP of IPOs open right now?" },
  { label: "Highest Gains", query: "Which active IPO has the highest expected listing gain?" },
  { label: "Allotment Odds", query: "What are my retail allotment chances in a 50x subscribed IPO?" },
  { label: "Compare Top Issues", query: "Compare the top active Mainboard IPOs side-by-side." },
];

export default function ChatInput({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  placeholder = "Ask about live GMP, subscription demand, allotment odds...",
  autoFocus = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height based on scrollHeight
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 140);
    el.style.height = `${Math.max(nextHeight, 40)}px`;
  }, [input]);

  // Focus textarea when autofocus is true
  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  // Global Cmd+K / Ctrl+K shortcut to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading) return;
      if (input.trim()) {
        onSend(input);
      }
    }
  };

  const hasContent = input.trim().length > 0;

  return (
    <div className="relative w-full space-y-2 pb-safe">
      {/* Quick Launch Pills (visible when input is empty or for fast querying) */}
      {!isLoading && (
        <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5">
          {QUICK_PILLS.map((pill, pi) => (
            <button
              key={pi}
              onClick={() => onSend(pill.query)}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#171E28] hover:bg-gray-200/80 dark:hover:bg-[#202937] text-[#334155] dark:text-[#CBD5E1] text-[11.5px] font-medium transition-colors shrink-0 border border-gray-200/60 dark:border-[#222F42]"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Box Capsule */}
      <div className="relative flex items-end w-full rounded-2xl bg-white dark:bg-[#111418] border border-gray-200/90 dark:border-[#222731] shadow-sm hover:border-gray-300 dark:hover:border-[#2E3542] focus-within:border-[#1C317A] dark:focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-[#1C317A]/10 dark:focus-within:ring-blue-500/20 transition-all p-1.5 sm:p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          inputMode="text"
          enterKeyHint="send"
          className="flex-1 bg-transparent px-2.5 py-1 text-[13.5px] sm:text-[14px] text-[#0f172a] dark:text-[#F8FAFC] placeholder:text-gray-400 dark:placeholder:text-[#525B6A] resize-none focus:outline-none leading-relaxed max-h-28 overflow-y-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        />

        {/* Action Button: Stop or Send */}
        <div className="shrink-0 mb-0.5 mr-0.5">
          {isLoading ? (
            <button
              onClick={onStop}
              type="button"
              aria-label="Stop generation"
              className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
              title="Stop generating"
            >
              <StopIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => input.trim() && onSend(input)}
              disabled={!hasContent}
              type="button"
              aria-label="Send message"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                hasContent
                  ? "bg-[#1C317A] hover:bg-[#152763] text-white shadow-xs"
                  : "bg-gray-100 dark:bg-[#1A1F26] text-gray-300 dark:text-[#3B4250] cursor-not-allowed"
              }`}
              title="Send (Enter)"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subdued micro footer */}
      <div className="flex items-center justify-between px-2 text-[10.5px] text-gray-400 dark:text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <span>IPOCraft AI · Live Indian Market Intelligence</span>
        </span>
        <span className="hidden sm:inline">Press ↵ to send · ⇧↵ for newline · <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#1A1F26] border border-gray-200 dark:border-[#262C36] font-mono text-[9.5px]">⌘K</kbd> to focus</span>
      </div>
    </div>
  );
}
