"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUpIcon, StopIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

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

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 40), 140)}px`;
  }, [input]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // Cmd+K to focus
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) onSend(input);
    }
  };

  const hasContent = input.trim().length > 0;

  return (
    <div className="w-full">
      {/* Input row */}
      <div className="flex items-end gap-2 w-full border border-gray-200 dark:border-[#252A31] rounded-lg bg-white dark:bg-[#111418] focus-within:border-[#1C317A]/60 dark:focus-within:border-[#3D5BA9] transition-colors px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          inputMode="text"
          enterKeyHint="send"
          className="flex-1 bg-transparent text-[13.5px] text-[#0f172a] dark:text-[#E8EDF3] placeholder:text-gray-400 dark:placeholder:text-[#4B5563] resize-none focus:outline-none leading-relaxed max-h-[140px] overflow-y-auto py-0.5"
        />
        <div className="shrink-0">
          {isLoading ? (
            <button
              onClick={onStop}
              type="button"
              aria-label="Stop"
              className="w-7 h-7 rounded bg-[#0f172a] dark:bg-[#E8EDF3] text-white dark:text-[#0f172a] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <StopIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => hasContent && onSend(input)}
              disabled={!hasContent}
              type="button"
              aria-label="Send"
              className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                hasContent
                  ? "bg-[#1C317A] hover:bg-[#152763] text-white"
                  : "bg-gray-100 dark:bg-[#1A1F26] text-gray-300 dark:text-[#3B4250] cursor-not-allowed"
              }`}
            >
              <ArrowUpIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Minimal footer hint — desktop only, one line */}
      <p className="hidden sm:block text-[10px] text-gray-400 dark:text-[#4B5563] mt-1.5 px-0.5">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
}
