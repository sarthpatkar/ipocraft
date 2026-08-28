"use client";

import React, { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ChatSession, ResearchPreset } from "./types";

const RESEARCH_PRESETS: { category: string; presets: ResearchPreset[] }[] = [
  {
    category: "Live Market Intelligence",
    presets: [
      {
        id: "open-gmp",
        label: "Live GMP of Open IPOs",
        query: "What is the GMP and estimated listing price of all open IPOs right now?",
        badge: "Live",
      },
      {
        id: "high-gainers",
        label: "Highest Expected Gainers",
        query: "Which active IPOs have the highest expected listing gains by GMP percentage?",
      },
      {
        id: "active-subs",
        label: "Subscription Demand Ratios",
        query: "Compare the total, QIB, NII, and Retail subscription multiples of active IPOs.",
      },
    ],
  },
  {
    category: "Calculators & Timelines",
    presets: [
      {
        id: "allotment-odds",
        label: "Retail Allotment Probability",
        query: "What are my retail allotment odds for a 50x oversubscribed Mainboard IPO?",
        badge: "Odds",
      },
      {
        id: "weekly-dates",
        label: "Opening & Listing This Week",
        query: "Which IPOs are opening, closing, or listing this week?",
      },
      {
        id: "listing-returns",
        label: "Recent Listing Track Record",
        query: "Show the listing day performance and gains of recently listed IPOs.",
      },
    ],
  },
];

function formatSessionTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onSelectPreset: (query: string) => void;
  isOpen: boolean;
  isIconRail?: boolean; // desktop collapsed icon-only mode
  onCloseMobile?: () => void;
}

export default function ChatSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onSelectPreset,
  isOpen,
  isIconRail = false,
  onCloseMobile,
}: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "history">("presets");

  // Icon-rail mode — narrow 44px strip on desktop when sidebar is "closed"
  if (isIconRail) {
    return (
      <aside className="hidden lg:flex flex-col w-11 shrink-0 bg-white dark:bg-[#111418] border-r border-gray-200/90 dark:border-[#222731] h-full items-center py-3 gap-3">
        {/* New Thread */}
        <button
          onClick={onNewSession}
          title="New Research Thread"
          aria-label="New research thread"
          className="w-8 h-8 rounded-lg bg-[#1C317A] hover:bg-[#28439E] text-white flex items-center justify-center transition-colors shadow-xs"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
        {/* Preset icons */}
        {RESEARCH_PRESETS.flatMap((g) => g.presets).slice(0, 5).map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.query)}
            title={preset.label}
            aria-label={preset.label}
            className="w-8 h-8 rounded-lg border border-gray-100 dark:border-[#222731] hover:bg-gray-50 dark:hover:bg-[#171B20] text-gray-500 dark:text-[#9AA1AA] flex items-center justify-center transition-colors text-[10px] font-bold"
          >
            {preset.label.charAt(0)}
          </button>
        ))}
        {/* Session count badge */}
        {sessions.length > 0 && (
          <div className="relative mt-auto mb-1">
            <ClockIcon className="w-5 h-5 text-gray-400 dark:text-[#64748B]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold">
              {sessions.length > 9 ? "9+" : sessions.length}
            </span>
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden"
      } fixed left-0 z-[45] w-64 lg:static lg:h-full bg-white dark:bg-[#111418] border-r border-gray-200 dark:border-[#1E2329] flex flex-col transition-all duration-200 shrink-0 shadow-md lg:shadow-none`}
      style={{ top: "86px", bottom: "72px" }}
    >
      {/* ── TOP ACTION BAR ── */}
      <div className="p-3.5 border-b border-gray-100 dark:border-[#222731] flex items-center justify-between gap-2">
        <button
          onClick={onNewSession}
          title="New research thread"
          aria-label="New research thread"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1C317A] hover:bg-[#28439E] text-white text-[12.5px] font-semibold transition-colors shadow-xs"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Research Thread</span>
        </button>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1A1F26]"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="border-b border-gray-100 dark:border-[#1E2329]">
        <div className="flex">
          <button
            onClick={() => setActiveTab("presets")}
            className={`flex-1 py-2.5 text-[11.5px] font-semibold border-b-2 transition-colors ${
              activeTab === "presets"
                ? "border-[#1C317A] dark:border-[#3D5BA9] text-[#1C317A] dark:text-[#93B4FF]"
                : "border-transparent text-gray-400 dark:text-[#5A6070] hover:text-[#0f172a] dark:hover:text-[#E8EDF3]"
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 text-[11.5px] font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "history"
                ? "border-[#1C317A] dark:border-[#3D5BA9] text-[#1C317A] dark:text-[#93B4FF]"
                : "border-transparent text-gray-400 dark:text-[#5A6070] hover:text-[#0f172a] dark:hover:text-[#E8EDF3]"
            }`}
          >
            History
            {sessions.length > 0 && (
              <span className="text-[10px] font-bold text-gray-400 dark:text-[#4B5563]">
                {sessions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-[13px]">
        {activeTab === "presets" ? (
          <div className="space-y-4">
            {RESEARCH_PRESETS.map((group, gi) => (
              <div key={gi} className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-[#64748B] px-1">
                  {group.category}
                </p>
                <div className="space-y-1">
                  {group.presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.query);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-[#262C36] hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors group flex items-center justify-between gap-2"
                    >
                      <span className="text-[#334155] dark:text-[#CBD5E1] group-hover:text-[#0f172a] dark:group-hover:text-white text-[12.5px] font-medium leading-snug line-clamp-1">
                        {preset.label}
                      </span>
                      {preset.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1C317A] dark:text-[#93B4FF] shrink-0">
                          {preset.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#1E2329]">
            {sessions.length === 0 ? (
              <div className="py-10 text-center px-3">
                <ClockIcon className="w-5 h-5 mx-auto text-gray-300 dark:text-[#252A31] mb-2" />
                <p className="text-[11.5px] text-gray-400 dark:text-[#4B5563]">No past threads yet.</p>
              </div>
            ) : (
              sessions.map((sess) => {
                const isActive = sess.id === currentSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => { onSelectSession(sess.id); if (onCloseMobile) onCloseMobile(); }}
                    className={`group flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-[#1C317A]/5 dark:bg-[#1C317A]/10"
                        : "hover:bg-gray-50 dark:hover:bg-[#14181F]"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className={`text-[12.5px] font-medium truncate leading-tight ${
                        isActive ? "text-[#1C317A] dark:text-[#93B4FF]" : "text-[#0f172a] dark:text-[#E8EDF3]"
                      }`}>
                        {sess.title || "Untitled"}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-[#4B5563] mt-0.5">
                        {formatSessionTime(sess.updatedAt || sess.createdAt)} · {sess.messages.length} msg
                      </p>
                    </div>
                    <button
                      onClick={(e) => onDeleteSession(sess.id, e)}
                      aria-label="Delete chat"
                      title="Delete chat"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-300 dark:text-[#3A4050] hover:text-rose-500 dark:hover:text-rose-400 transition-all shrink-0"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>


    </aside>
  );
}
