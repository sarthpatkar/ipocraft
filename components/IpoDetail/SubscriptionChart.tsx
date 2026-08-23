"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type SubHistory = {
  day?: string | number;
  sub_qib?: string | number | null;
  qib?: string | number | null;
  sub_nii?: string | number | null;
  nii?: string | number | null;
  sub_rii?: string | number | null;
  rii?: string | number | null;
};

function parseSub(val: any): number {
  if (val == null || val === "" || val === "—") return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : parseFloat(n.toFixed(2));
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border shadow-lg p-3 text-[12px] bg-white dark:bg-[#111418] border-gray-200 dark:border-[#252A31] text-[#0f172a] dark:text-[#F1F3F5]">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums">{p.value}x</span>
        </div>
      ))}
    </div>
  );
}

export default function SubscriptionChart({ history }: { history: SubHistory[] }) {
  if (!history || history.length === 0) return null;

  const data = history.map((h: any, i) => {
    const rawDay = h.day;
    const name = rawDay
      ? typeof rawDay === "string" && rawDay.toLowerCase().includes("day")
        ? rawDay
        : `Day ${rawDay}`
      : `Day ${i + 1}`;

    return {
      name,
      QIB: parseSub(h.qib ?? h.sub_qib),
      NII: parseSub(h.nii ?? h.sub_nii),
      Retail: parseSub(h.rii ?? h.sub_rii),
    };
  });

  // Only render if at least one category has data > 0
  const hasData = data.some((d) => d.QIB > 0 || d.NII > 0 || d.Retail > 0);
  if (!hasData) return null;

  return (
    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#252A31]">
      <p
        className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 dark:text-[#9AA1AA] mb-3"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Day-wise Subscription Chart
      </p>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barSize={18}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9AA1AA" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9AA1AA" }} axisLine={false} tickLine={false} unit="x" width={32} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#9AA1AA" }} />
            <Bar dataKey="QIB" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="NII" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Retail" fill="#10B981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
