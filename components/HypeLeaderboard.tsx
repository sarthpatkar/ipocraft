"use client";

import Link from "next/link";
import { calculateHypeScore, getHypeScoreColor, getHypeScoreLabel } from "@/lib/hypeScore";
import type { IPOListItem } from "@/components/IpoCard";

const RANKS = ["#1", "#2", "#3"] as const;

const SCORE_BAR_COLOR: Record<string, string> = {
  "text-emerald-500": "bg-emerald-500",
  "text-green-500":   "bg-green-500",
  "text-yellow-500":  "bg-yellow-400",
  "text-orange-500":  "bg-orange-400",
  "text-red-500":     "bg-red-500",
};

export default function HypeLeaderboard({ ipos }: { ipos: IPOListItem[] }) {
  const ranked = ipos
    .map((ipo) => ({
      ipo,
      score: calculateHypeScore({
        gmp:        ipo.gmp        != null ? Number(ipo.gmp)        : null,
        issuePrice: ipo.price_max  != null ? Number(ipo.price_max)  : null,
        qibSub:     ipo.sub_qib    != null ? Number(ipo.sub_qib)    : null,
        retailSub:  ipo.sub_rii    != null ? Number(ipo.sub_rii)    : null,
        issueSize:  ipo.issue_size != null ? Number(ipo.issue_size) : null,
      }),
    }))
    .filter((x): x is { ipo: IPOListItem; score: number } => x.score != null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) return null;

  return (
    <div className="mb-5 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA]">
            Hype Score Leaderboard
          </p>
          <p className="text-[11.5px] text-gray-400 dark:text-[#6B7280] mt-0.5">
            Top picks by momentum signal
          </p>
        </div>
        <Link
          href="/ipo"
          className="text-[11.5px] text-blue-600 dark:text-blue-400 hover:underline font-semibold shrink-0"
        >
          View All →
        </Link>
      </div>

      {/* Rankings */}
      <div className="flex flex-col gap-3">
        {ranked.map(({ ipo, score }, i) => {
          const colorClass = getHypeScoreColor(score);
          const barBg = SCORE_BAR_COLOR[colorClass] ?? "bg-blue-500";
          const label = getHypeScoreLabel(score);

          return (
            <Link
              key={ipo.slug}
              href={`/ipo/${ipo.slug}`}
              className="flex items-center gap-3 p-2.5 rounded-md hover:bg-gray-50 dark:hover:bg-[#171B20] transition-colors -mx-1 px-2"
            >
              {/* Rank */}
              <span className="text-[11px] font-bold tabular-nums text-gray-400 dark:text-[#6B7280] shrink-0 w-6 text-center">
                {RANKS[i]}
              </span>

              {/* Name + label */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] truncate leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {ipo.name}
                </p>
                <p className="text-[10.5px] text-gray-400 dark:text-[#6B7280] mt-0.5 truncate">
                  {label}
                  {ipo.ipo_type && (
                    <span className="ml-1.5 opacity-70">· {ipo.ipo_type.toUpperCase()}</span>
                  )}
                </p>
              </div>

              {/* Score bar + number */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-1.5 bg-gray-100 dark:bg-[#171B20] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barBg} transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={`text-[12px] font-bold tabular-nums w-12 text-right ${colorClass}`}>
                  {score}/100
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <p className="mt-3 text-[10px] text-gray-400 dark:text-[#6B7280] border-t border-gray-100 dark:border-[#252A31] pt-2.5">
        Hype Score is an algorithmic momentum signal (0-100). Not investment advice.
      </p>
    </div>
  );
}
