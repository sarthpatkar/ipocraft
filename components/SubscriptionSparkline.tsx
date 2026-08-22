"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

type Point = { sub_total?: string | number | null };

export default function SubscriptionSparkline({ history }: { history: Point[] }) {
  if (!history || history.length < 2) return <span className="text-gray-300 text-[11px]">—</span>;

  const data = history.map((h) => ({
    v: h.sub_total ? parseFloat(String(h.sub_total)) || 0 : 0,
  }));

  const last = data[data.length - 1].v;
  const first = data[0].v;
  const rising = last >= first;
  const color = rising ? "#10b981" : "#f87171";

  return (
    <div style={{ width: 64, height: 28, display: "inline-block" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#sparkGrad)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
