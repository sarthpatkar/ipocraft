"use client";

import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: { gmp: number; created_at: string }[];
};

type ChartPoint = {
  gmp: number;
  shortDate: string;
  fullDate: string;
};

type TooltipPayloadItem = {
  value?: number;
  payload?: ChartPoint;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
};

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const value = item?.value;
  const date = item?.payload?.fullDate ?? "Unknown";

  return (
    <div className="rounded-md border border-[#dbe4f0] bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-medium text-[#0f172a]">{date}</p>
      <p className="text-[11px] text-[#1e3a8a] font-semibold mt-0.5">
        GMP: ₹{typeof value === "number" ? value.toLocaleString("en-IN") : "—"}
      </p>
    </div>
  );
}

export default function GMPChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[210px] w-full min-w-0 flex items-center justify-center">
        <p className="text-[12px] text-[#94a3b8] text-center">
          No GMP data yet. Updates will appear once available.
        </p>
      </div>
    );
  }

  // ✅ Trend detection (latest vs previous)
  const latest = data[data.length - 1]?.gmp ?? 0;
  const previous = data[data.length - 2]?.gmp ?? latest;
  const trendUp = latest >= previous;

  const strokeStart = trendUp ? "#059669" : "#dc2626"; // green / red
  const strokeEnd = trendUp ? "#10b981" : "#ef4444";
  const dotColor = trendUp ? "#059669" : "#dc2626";

  const chartData = data.map((item) => ({
    gmp: item.gmp,
    shortDate: new Date(item.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    fullDate: new Date(item.created_at).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const renderLatestDot = ({
    cx,
    cy,
    index,
  }: {
    cx?: number;
    cy?: number;
    index?: number;
  }) => {
    if (
      cx == null ||
      cy == null ||
      index == null ||
      index !== chartData.length - 1
    ) {
      return null;
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4.5}
        fill={dotColor}
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="w-full min-w-0 h-[240px] sm:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="gmpStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={strokeStart} />
              <stop offset="100%" stopColor={strokeEnd} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="shortDate"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={18}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={35}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }} />
          <Line
            type="monotone"
            dataKey="gmp"
            stroke="url(#gmpStroke)"
            strokeWidth={2.5}
            isAnimationActive
            animationDuration={750}
            animationEasing="ease-out"
            dot={renderLatestDot}
            activeDot={{ r: 5, fill: dotColor, stroke: "#ffffff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
