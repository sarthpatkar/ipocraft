"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ChatWindow = dynamic(() => import("./ChatWindow"), { ssr: false });

export default function ChatBubble() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Don't render floating mini bubble on dedicated full-screen /chat page or /admin
  if (!mounted || pathname === "/chat" || pathname.startsWith("/chat/") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating window / Mobile sheet */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-12 z-[300] sm:inset-auto sm:bottom-20 sm:right-6 sm:top-auto sm:w-[420px] sm:h-[620px] shadow-lg transition-all"
          style={{ animation: "popupFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="w-full h-full sm:rounded-2xl overflow-hidden border-t sm:border border-gray-200/90 dark:border-[#222731]">
            <ChatWindow embedded={true} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close IPO Assistant" : "Open IPO Assistant"}
        className="fixed bottom-5 right-4 sm:right-6 z-[301] w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#1C317A] hover:bg-[#152763] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center group active:scale-95"
      >

        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <>
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            {/* Tooltip on Desktop hover */}
            <span className="hidden sm:inline absolute right-16 bottom-1/2 translate-y-1/2 bg-[#0f172a] dark:bg-[#F8FAFC] text-white dark:text-[#0f172a] text-[11.5px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-gray-800 dark:border-gray-200">
              Ask IPOCraft AI
            </span>
          </>
        )}
        {/* Subtle live indicator dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-[#090B0F]" />
      </button>

      <style>{`
        @keyframes popupFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
