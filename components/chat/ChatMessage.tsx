"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import type { ChartSpec, Message } from "./types";
import FeedbackButton from "./FeedbackButton";

interface ChatMessageProps {
  message: Message;
  isLastAssistant?: boolean;
  onRegenerate?: () => void;
  onEditUserMessage?: (text: string) => void;
}

/** Parse ```chart ... ``` blocks from message content */
function parseCharts(content: string): { text: string; charts: ChartSpec[] } {
  const charts: ChartSpec[] = [];
  const text = content
    .replace(/```chart\n([\s\S]*?)```/g, (_, json) => {
      try {
        charts.push(JSON.parse(json.trim()));
      } catch {
        /* invalid JSON, skip */
      }
      return "";
    })
    .trim();
  return { text, charts };
}

/** Checks if a table cell value represents a numeric/financial value */
function isNumericCell(val: string): boolean {
  const clean = val.replace(/[₹$,%x×\s-]/g, "").trim();
  return clean !== "" && !isNaN(Number(clean));
}

/** Render semantic status badge if cell matches status keyword */
function renderStatusBadge(text: string): React.ReactNode {
  const lower = text.toLowerCase().trim();
  if (lower === "open") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
        Open
      </span>
    );
  }
  if (lower === "upcoming") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
        Upcoming
      </span>
    );
  }
  if (lower === "listed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
        Listed
      </span>
    );
  }
  if (lower === "closed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-[#1E232B] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2A313C]">
        Closed
      </span>
    );
  }
  return null;
}

/** Converts raw string or link to clean display */
function renderCellContent(cell: string): React.ReactNode {
  const statusBadge = renderStatusBadge(cell);
  if (statusBadge) return statusBadge;

  // Render +X% or -X% with semantic color
  if (/^[+-]?\d+(\.\d+)?%$/.test(cell.trim())) {
    const isPositive = !cell.trim().startsWith("-");
    return (
      <span className={`font-semibold tabular-nums ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
        {cell}
      </span>
    );
  }

  return renderInline(cell);
}

/** Render inline tokens: [link](url), **bold**, *italic*, `code` */
function renderInline(text: string): React.ReactNode {
  // Regex splitting on Markdown links, bold, italic, inline code
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return tokens.map((part, i) => {
    // Markdown link: [Title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, title, href] = linkMatch;
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            key={i}
            href={href}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5"
          >
            {title}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5"
        >
          {title}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={i}
          className="font-semibold text-[#0f172a] dark:text-[#F8FAFC]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-gray-600 dark:text-gray-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-gray-100 dark:bg-[#1E232B] text-[#1C317A] dark:text-[#93B4FF] px-1.5 py-0.5 rounded text-[12px] font-mono border border-gray-200/50 dark:border-[#2A313C]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function ChatTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const [copied, setCopied] = useState(false);

  const copyMarkdownTable = async () => {
    const headerLine = `| ${headers.join(" | ")} |`;
    const sepLine = `| ${headers.map(() => "---").join(" | ")} |`;
    const bodyLines = rows.map((r) => `| ${r.join(" | ")} |`);
    const md = [headerLine, sepLine, ...bodyLines].join("\n");
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const exportCSV = () => {
    const csvRows = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ipocraft-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-3.5 rounded-xl border border-gray-200/90 dark:border-[#222731] bg-white dark:bg-[#111418] shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-gray-50/90 dark:bg-[#161B22] border-b border-gray-200/80 dark:border-[#222731]">
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-gray-600 dark:text-[#9AA1AA]">
          <TableCellsIcon className="w-3.5 h-3.5 text-[#1C317A] dark:text-[#93B4FF]" />
          <span>{rows.length} {rows.length === 1 ? "Record" : "Records"}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={copyMarkdownTable}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-[#1F2633] border border-gray-200 dark:border-[#2E384A] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262F3E] transition-colors"
            title="Copy table as Markdown"
          >
            {copied ? (
              <>
                <CheckIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-3 h-3 text-gray-400" />
                <span>Copy Table</span>
              </>
            )}
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-[#1F2633] border border-gray-200 dark:border-[#2E384A] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262F3E] transition-colors"
            title="Download table as CSV file"
          >
            <ArrowDownTrayIcon className="w-3 h-3 text-gray-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-[12.5px] border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-[#14181F] border-b border-gray-200 dark:border-[#222731]">
              {headers.map((h, hi) => {
                const isNum = isNumericCell(h);
                return (
                  <th
                    key={hi}
                    className={`px-3.5 py-2.5 text-[11px] font-semibold tracking-wider text-gray-500 dark:text-[#9AA1AA] uppercase whitespace-nowrap ${
                      isNum ? "text-right" : "text-left"
                    }`}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#1F242C]">
            {rows.map((rowCells, ri) => (
              <tr
                key={ri}
                className="hover:bg-gray-50/60 dark:hover:bg-[#161B22]/50 transition-colors"
              >
                {rowCells.map((cell, ci) => {
                  const isNum = isNumericCell(cell);
                  return (
                    <td
                      key={ci}
                      className={`px-3.5 py-2.5 text-[#334155] dark:text-[#CBD5E1] whitespace-nowrap ${
                        isNum ? "text-right font-mono text-[12px] tabular-nums" : "text-left"
                      }`}
                    >
                      {renderCellContent(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Render markdown-like text: bold, italic, headings, lists, tables */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading 3
    if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={`h3-${i}`}
          className="text-[14px] sm:text-[15px] font-semibold text-[#0f172a] dark:text-[#F8FAFC] mt-4 mb-1.5 tracking-tight"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={`h2-${i}`}
          className="text-[16px] sm:text-[17px] font-bold text-[#0f172a] dark:text-[#F8FAFC] mt-5 mb-2 tracking-tight"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // Table (collect all consecutive | lines)
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !/^\|\s*[-:]+/.test(l));
      if (rows.length > 0) {
        const headers = rows[0]
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim());
        const bodyRows = rows.slice(1).map((r) =>
          r
            .split("|")
            .filter((c) => c.trim())
            .map((c) => c.trim())
        );

        nodes.push(
          <ChatTable key={`table-${i}`} headers={headers} rows={bodyRows} />
        );
      }
      continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul
          key={`ul-${i}`}
          className="list-disc list-outside ml-4 space-y-1 my-2 text-[13.5px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed"
        >
          {items.map((item, ii) => (
            <li key={ii}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol
          key={`ol-${i}`}
          className="list-decimal list-outside ml-4 space-y-1 my-2 text-[13.5px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed"
        >
          {items.map((item, ii) => (
            <li key={ii}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Source note / italics
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      nodes.push(
        <p
          key={`italic-${i}`}
          className="text-[11.5px] text-gray-400 dark:text-[#6B7280] mt-3 italic leading-relaxed"
        >
          {line.slice(1, -1)}
        </p>
      );
      i++;
      continue;
    }

    // Horizontal divider
    if (line.trim() === "---") {
      nodes.push(
        <hr
          key={`hr-${i}`}
          className="border-gray-200 dark:border-[#222731] my-3.5"
        />
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      nodes.push(<div key={`sp-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Normal prose paragraph
    nodes.push(
      <p
        key={`p-${i}`}
        className="text-[13.5px] sm:text-[14px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed"
      >
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

const BRAND_PALETTE = ["#1C317A", "#3FB950", "#2563EB", "#D97706", "#8B5CF6", "#06B6D4"];

function ChatChart({ spec }: { spec: ChartSpec }) {
  return (
    <div className="my-4 p-4 rounded-xl border border-gray-200/80 dark:border-[#222731] bg-white dark:bg-[#111418] shadow-xs">
      {spec.title && (
        <p
          className="text-[11.5px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA] mb-3"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {spec.title}
        </p>
      )}
      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={spec.data}
            margin={{ top: 8, right: 12, left: -10, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey={spec.xKey}
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111418",
                borderColor: "#222731",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#F8FAFC",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              itemStyle={{ color: "#F8FAFC" }}
            />
            {spec.bars.length > 1 && (
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            )}
            {spec.bars.map((bar, bi) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.label}
                fill={bar.color || BRAND_PALETTE[bi % BRAND_PALETTE.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ChatMessage({
  message,
  isLastAssistant = false,
  onRegenerate,
  onEditUserMessage,
}: ChatMessageProps) {
  const { role, content, isStreaming } = message;
  const { text, charts } = useMemo(() => parseCharts(content), [content]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard write failed */
    }
  };

  // ── USER MESSAGE (Sleek right capsule) ──
  if (role === "user") {
    return (
      <div className="flex justify-end group my-3">
        <div className="flex items-center gap-2 max-w-[85%] sm:max-w-[75%]">
          {onEditUserMessage && (
            <button
              onClick={() => onEditUserMessage(content)}
              aria-label="Edit query"
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E232B] transition-all"
              title="Edit & Resend"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
          )}
          <div className="bg-[#1C317A] text-white dark:bg-[#1E293B] dark:text-[#F8FAFC] rounded-2xl rounded-tr-xs px-4 py-2.5 text-[14px] leading-relaxed shadow-xs">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // ── ASSISTANT MESSAGE (Fluid stream, Institutional / ChatGPT aesthetic) ──
  return (
    <div className="flex justify-start my-4 w-full group">
      <div className="flex gap-3 sm:gap-3.5 w-full max-w-full">
        {/* Flat Avatar Monogram */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1C317A] text-white flex items-center justify-center shrink-0 font-bold text-[10px] sm:text-[11px] tracking-tight mt-0.5 shadow-xs">
          IC
        </div>

        {/* Content Stream */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12.5px] font-semibold text-[#0f172a] dark:text-[#F8FAFC]" style={{ fontFamily: "var(--font-outfit)" }}>
              IPOCraft Assistant
            </span>
            {isStreaming && (
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C317A] dark:bg-[#93B4FF] animate-pulse" />
                <span className="text-[11px] text-gray-400 dark:text-[#9AA1AA]">
                  Analyzing live data...
                </span>
              </span>
            )}
          </div>

          {/* Typing dots placeholder before first token */}
          {isStreaming && !text && (
            <div className="flex items-center gap-1.5 py-2">
              <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}

          {/* Rendered Prose & Tables */}
          {text && (
            <div className="prose prose-slate dark:prose-invert max-w-none text-[14px] sm:text-[14.5px] leading-relaxed">
              {renderMarkdown(text)}
            </div>
          )}

          {/* Rendered Charts */}
          {charts.map((chart, ci) => (
            <ChatChart key={ci} spec={chart} />
          ))}

          {/* Action Toolbar (Copy, Regenerate, Feedback) */}
          {!isStreaming && text && (
            <div className="flex items-center gap-1.5 pt-2.5 text-[11.5px] text-gray-400 dark:text-[#6B7280]">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#171B20] border border-gray-200/80 dark:border-[#222731] text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-white transition-colors shadow-xs"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#171B20] border border-gray-200/80 dark:border-[#222731] text-gray-600 dark:text-[#9AA1AA] hover:text-[#0f172a] dark:hover:text-white transition-colors shadow-xs"
                  title="Regenerate answer"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}

              {/* Thumbs up/down — right-aligned */}
              <div className="ml-auto">
                <FeedbackButton
                  messageId={message.id}
                  snippet={text.slice(0, 80)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


