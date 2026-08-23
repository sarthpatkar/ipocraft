import React from "react";

function valueOrDash(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function percentOrDash(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return `${value}%`;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[11px] font-semibold tracking-wider uppercase mb-2 ${light ? "text-[#93c5fd]" : "text-blue-600 dark:text-blue-400"}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

function DataLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-medium text-gray-500 dark:text-[#9AA1AA] mb-0.5"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

export default function FinancialMetrics({ ipo }: { ipo: any }) {
  const metrics = [
    { label: "EPS Pre IPO", value: valueOrDash(ipo.eps_pre) },
    { label: "EPS Post IPO", value: valueOrDash(ipo.eps_post) },
    { label: "P/E Pre", value: valueOrDash(ipo.pe_pre) },
    { label: "P/E Post", value: valueOrDash(ipo.pe_post) },
    { label: "ROCE", value: percentOrDash(ipo.roce) },
    { label: "Debt / Equity", value: valueOrDash(ipo.debt_equity) },
    { label: "PAT Margin", value: percentOrDash(ipo.pat_margin) },
    { label: "Market Cap", value: valueOrDash(ipo.market_cap) },
  ];

  const hasAnyMetric = metrics.some((m) => m.value !== "—");

  if (!hasAnyMetric) return null;

  return (
    <section id="financials" className="scroll-mt-[120px] bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 space-y-3 mb-6">
      <div className="pb-3 border-b border-gray-100 dark:border-[#252A31]">
        <Eyebrow>Financials</Eyebrow>
        <h2
          className="text-[1.25rem] sm:text-[1.35rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-snug"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Key Financial Metrics
        </h2>
      </div>

      {hasAnyMetric ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {metrics.map((item) => (
            <div key={item.label} className="space-y-1">
              <DataLabel>{item.label}</DataLabel>
              <p
                className="text-[14.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] leading-tight"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] rounded-md p-4 text-center">
          <p className="text-[12.5px] text-gray-600 dark:text-[#9AA1AA]" style={{ fontFamily: "var(--font-inter)" }}>
            Detailed financial ratios (EPS, P/E, ROCE, Debt/Equity) will appear here once the final offer document (RHP) is filed.
          </p>
        </div>
      )}

      <p
        className="text-[11.5px] text-gray-400 dark:text-[#6B7280] leading-relaxed pt-2 border-t border-gray-100 dark:border-[#252A31]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Financial figures sourced from official offer documents. Verify with statutory RHP filings.
      </p>
    </section>
  );
}

