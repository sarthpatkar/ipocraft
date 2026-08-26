"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  XMarkIcon,
  ArrowsPointingOutIcon,
  Bars3Icon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSuggestions from "./ChatSuggestions";
import ChatSidebar from "./ChatSidebar";
import type { Message, ChatSession } from "./types";

const SESSIONS_STORAGE_KEY = "ipocraft_chat_sessions_v4";
const LEGACY_SESSION_KEY = "ipocraft_chat_history_v3";

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Legacy migration check
    const legacyRaw = localStorage.getItem(LEGACY_SESSION_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      const legacyMsgs: Message[] = Array.isArray(legacyParsed?.messages)
        ? legacyParsed.messages
        : Array.isArray(legacyParsed)
        ? legacyParsed
        : [];
      if (legacyMsgs.length > 0) {
        const initialSession: ChatSession = {
          id: `sess-${Date.now()}`,
          title: legacyMsgs[0]?.content?.slice(0, 36) || "Previous Research",
          messages: legacyMsgs,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return [initialSession];
      }
    }
  } catch {}
  return [];
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions.slice(0, 30)));
  } catch {}
}

interface ChatWindowProps {
  embedded?: boolean;
  onClose?: () => void;
}

export default function ChatWindow({ embedded = false, onClose }: ChatWindowProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    const initial = loadSessions();
    return initial.length > 0 ? initial[0].id : null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // true before first token arrives

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<string[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabled = useRef<boolean>(true);

  // Active messages derived from current session
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages: Message[] = currentSession ? currentSession.messages : [];

  // Toggle keyboard shortcut Cmd+B for sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-scroll logic
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    isAutoScrollEnabled.current = distFromBottom < 100;
    setShowScrollFab(distFromBottom > 200);
  };

  useEffect(() => {
    if (isAutoScrollEnabled.current) {
      scrollToBottom("smooth");
    }
  }, [messages, scrollToBottom]);

  // Compute smart follow-up suggestions based on query keywords
  const generateFollowUps = (lastQuery: string): string[] => {
    const lower = lastQuery.toLowerCase();
    if (lower.includes("gmp") || lower.includes("grey market")) {
      return ["Compare subscription multiples", "Check allotment dates", "View listing track record"];
    }
    if (lower.includes("subscri") || lower.includes("bid")) {
      return ["Calculate my allotment odds", "Check live GMP", "When is allotment date?"];
    }
    if (lower.includes("allot") || lower.includes("odds") || lower.includes("chance")) {
      return ["How to check allotment on registrar?", "What is the listing date?", "What is current GMP?"];
    }
    return ["What are open IPOs today?", "Compare top Mainboard IPOs", "What is GMP meaning?"];
  };

  // Create new session
  const handleNewSession = () => {
    handleStop();
    const newSessId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessId,
      title: "New Research",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newSessId);
    saveSessions(updated);
    setFollowUps([]);
    setError(null);
  };

  // Switch session
  const handleSelectSession = (id: string) => {
    handleStop();
    setCurrentSessionId(id);
    setFollowUps([]);
    setError(null);
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Stop streaming generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    if (currentSessionId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: s.messages.map((msg) =>
                  msg.isStreaming ? { ...msg, isStreaming: false } : msg
                ),
              }
            : s
        )
      );
    }
  };

  // Export conversation
  const exportAsMarkdown = () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => `### ${m.role === "user" ? "You" : "IPOCraft Assistant"}\n\n${m.content}\n\n---`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ipocraft-research-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const copyConversation = async () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => `[${m.role === "user" ? "USER" : "IPOCRAFT"}]:\n${m.content}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(content);
      setCopiedExport(true);
      setTimeout(() => {
        setCopiedExport(false);
        setExportOpen(false);
      }, 1500);
    } catch {}
  };

  // Send a message
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      let activeId = currentSessionId;
      let currentSessionsList = [...sessions];

      // Ensure active session exists
      if (!activeId || !currentSessionsList.some((s) => s.id === activeId)) {
        activeId = `sess-${Date.now()}`;
        const newSession: ChatSession = {
          id: activeId,
          title: trimmed.length > 36 ? trimmed.slice(0, 36) + "…" : trimmed,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        currentSessionsList = [newSession, ...currentSessionsList];
        setCurrentSessionId(activeId);
      }

      const activeIndex = currentSessionsList.findIndex((s) => s.id === activeId);
      const existingSession = currentSessionsList[activeIndex];
      const existingMessages = existingSession ? existingSession.messages : [];

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      const assistantMsgId = `asst-${Date.now()}`;
      const assistantPlaceholder: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      // Set initial session title from first user query if default
      const isFirstMessage = existingMessages.length === 0;
      const sessionTitle =
        isFirstMessage || existingSession.title === "New Research"
          ? trimmed.length > 36
            ? trimmed.slice(0, 36) + "…"
            : trimmed
          : existingSession.title;

      const updatedMessages = [...existingMessages, userMsg, assistantPlaceholder];
      currentSessionsList[activeIndex] = {
        ...existingSession,
        title: sessionTitle,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };

      setSessions(currentSessionsList);
      setInput("");
      setIsLoading(true);
      setIsTyping(true);
      setError(null);
      setFollowUps([]);
      isAutoScrollEnabled.current = true;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            message: trimmed,
            history: existingMessages
              .slice(-8)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (res.status === 429) {
          setError("You've reached the free query limit (20/hour). Please try again shortly.");
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeId
                ? { ...s, messages: s.messages.filter((m) => m.id !== assistantMsgId) }
                : s
            )
          );
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setError("Unable to complete request. Please try again.");
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeId
                ? { ...s, messages: s.messages.filter((m) => m.id !== assistantMsgId) }
                : s
            )
          );
          setIsLoading(false);
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "token") {
                accumulated += event.content;
                setIsTyping(false); // First token arrived — hide typing indicator
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === activeId
                      ? {
                          ...s,
                          messages: s.messages.map((m) =>
                            m.id === assistantMsgId
                              ? { ...m, content: accumulated, isStreaming: true }
                              : m
                          ),
                        }
                      : s
                  )
                );
              } else if (event.type === "done") {
                const finalAssistant: Message = {
                  id: assistantMsgId,
                  role: "assistant",
                  content: accumulated,
                  timestamp: Date.now(),
                  isStreaming: false,
                };
                setSessions((prev) => {
                  const finalSessions = prev.map((s) =>
                    s.id === activeId
                      ? {
                          ...s,
                          messages: [...existingMessages, userMsg, finalAssistant],
                          updatedAt: Date.now(),
                        }
                      : s
                  );
                  saveSessions(finalSessions);
                  return finalSessions;
                });
                setFollowUps(generateFollowUps(trimmed));
              } else if (event.type === "error") {
                setError(event.message || "An error occurred.");
              }
            } catch {}
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Manually aborted
        } else {
          setError("Network connection issue. Please verify and retry.");
        }
      } finally {
        setIsLoading(false);
        setIsTyping(false);
        abortControllerRef.current = null;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                  ),
                }
              : s
          )
        );
      }
    },
    [currentSessionId, sessions, isLoading]
  );

  // Regenerate last response
  const handleRegenerate = () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex === -1) return;
    const userMsg = [...messages].reverse()[lastUserIndex];
    const trimmed = messages.slice(0, messages.length - 1 - lastUserIndex);
    if (currentSessionId) {
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, messages: trimmed } : s))
      );
    }
    sendMessage(userMsg.content);
  };

  // Edit user message
  const handleEditUserMessage = (text: string) => {
    setInput(text);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex w-full h-full bg-[#F8FAFC] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F8FAFC] select-text overflow-hidden relative">
      {/* ── COLLAPSIBLE RESEARCH SIDEBAR ── */}
      {!embedded && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          onSelectPreset={sendMessage}
          isOpen={sidebarOpen}
          isIconRail={!sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN RESEARCH CANVAS ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#F8FAFC] dark:bg-[#090B0F] overflow-hidden">
        {/* ── TOP HEADER ── */}
        <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-white dark:bg-[#111418] border-b border-gray-200/80 dark:border-[#1F242C] shrink-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {!embedded && (
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle research sidebar"
                className="p-1.5 rounded-lg border border-gray-200/80 dark:border-[#262C36] text-gray-500 hover:text-[#0f172a] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors"
                title="Toggle Research Navigator (⌘B)"
              >
                <Bars3Icon className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#1C317A] text-white flex items-center justify-center font-bold text-[10px] tracking-tight shrink-0 shadow-xs">
                IC
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-[13.5px] sm:text-[14px] font-bold text-[#0f172a] dark:text-[#F8FAFC] truncate leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                    {currentSession?.title || "IPO AI Research Assistant"}
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Market Intelligence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Export / Share Dropdown */}
            {messages.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setExportOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1A1F26] border border-gray-200/80 dark:border-[#262C36] transition-colors"
                  title="Export thread"
                >
                  <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {exportOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-[#171E28] border border-gray-200 dark:border-[#252E3E] shadow-xl py-1.5 z-50 text-[12.5px]">
                    <button
                      onClick={copyConversation}
                      className="w-full px-3.5 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#1F2937] text-gray-700 dark:text-gray-200 flex items-center justify-between"
                    >
                      <span>Copy Full Thread</span>
                      {copiedExport ? <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    <button
                      onClick={exportAsMarkdown}
                      className="w-full px-3.5 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#1F2937] text-gray-700 dark:text-gray-200 flex items-center justify-between"
                    >
                      <span>Download Markdown (.md)</span>
                      <ArrowDownTrayIcon className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {messages.length > 0 && (
              <button
                onClick={handleNewSession}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1A1F26] border border-gray-200/80 dark:border-[#262C36] transition-colors"
                title="Start a new thread"
              >
                <span>+ New</span>
              </button>
            )}

            {!embedded && (
              <Link
                href="/chat"
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1A1F26] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Open full page"
              >
                <ArrowsPointingOutIcon className="w-4 h-4" />
              </Link>
            )}

            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close assistant"
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1A1F26] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* ── CONVERSATION STREAM ── */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3 scroll-smooth relative"
        >
          {isEmpty ? (
            <ChatSuggestions onSelect={sendMessage} />
          ) : (
            <div className="w-full max-w-3xl mx-auto space-y-4">
              {messages.map((msg, i) => {
                // Show timestamp separator before each user message (except first)
                const showTimestamp = msg.role === "user" && i > 0;
                const timeLabel = (() => {
                  const diff = Date.now() - (msg.timestamp || Date.now());
                  const mins = Math.floor(diff / 60000);
                  if (mins < 1) return "Just now";
                  if (mins < 60) return `${mins} min ago`;
                  const hrs = Math.floor(mins / 60);
                  if (hrs < 24) return `${hrs}h ago`;
                  return new Date(msg.timestamp || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                })();
                return (
                  <React.Fragment key={msg.id}>
                    {showTimestamp && (
                      <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-gray-100 dark:bg-[#1F242C]" />
                        <span className="text-[10.5px] text-gray-400 dark:text-[#4B5563] shrink-0">{timeLabel}</span>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-[#1F242C]" />
                      </div>
                    )}
                    <ChatMessage
                      message={msg}
                      isLastAssistant={
                        msg.role === "assistant" && i === messages.length - 1
                      }
                      onRegenerate={handleRegenerate}
                      onEditUserMessage={handleEditUserMessage}
                    />
                  </React.Fragment>
                );
              })}

              {/* Typing indicator — shows before first token arrives */}
              {isTyping && (
                <div className="flex items-end gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1C317A] flex items-center justify-center text-white text-[9px] font-bold shrink-0">IC</div>
                  <div className="bg-white dark:bg-[#171B20] border border-gray-100 dark:border-[#222731] rounded-2xl rounded-bl-sm px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Post-Response Follow-up Suggestions */}
              {!isLoading && followUps.length > 0 && (
                <div className="pt-2 pl-9 sm:pl-10">
                  <ChatSuggestions
                    onSelect={sendMessage}
                    followUpSuggestions={followUps}
                  />
                </div>
              )}
            </div>
          )}

          {/* Scroll-to-bottom FAB */}
          {showScrollFab && (
            <button
              onClick={() => {
                isAutoScrollEnabled.current = true;
                scrollToBottom("smooth");
              }}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#171B20] border border-gray-200 dark:border-[#262C36] shadow-lg text-[12px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1A1F26] transition-all animate-fade-in-up"
              aria-label="Jump to latest message"
            >
              <ChevronDownIcon className="w-3.5 h-3.5" />
              <span>Latest</span>
            </button>
          )}
          {error && (
            <div className="w-full max-w-3xl mx-auto my-3 p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/40 text-[12.5px] text-rose-700 dark:text-rose-400 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRegenerate}
                className="px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-900/40 font-medium hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors text-[11.5px]"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* ── STICKY INPUT CAPSULE ── */}
        <div className="px-3 sm:px-6 pb-4 pt-2 bg-white dark:bg-[#111418] border-t border-gray-200/70 dark:border-[#1F242C] shrink-0">
          <div className="w-full max-w-3xl mx-auto">
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={sendMessage}
              onStop={handleStop}
              isLoading={isLoading}
              autoFocus={embedded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

