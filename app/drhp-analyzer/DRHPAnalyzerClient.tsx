"use client";

import { useState } from "react";
import { DocumentMagnifyingGlassIcon, DocumentTextIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

interface DRHPAnalysis {
  company_name?: string;
  risks: string[];
  opportunities: string[];
  financials: {
    revenue?: string;
    profit?: string;
    eps?: string;
    pe?: string;
    roce?: string;
  };
  summary?: string;
}

export default function DRHPAnalyzerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DRHPAnalysis | null>(null);
  const [error, setError] = useState("");

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/drhp/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* URL Input */}
      <form onSubmit={analyze} className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5">
        <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#9AA1AA] mb-2">
          DRHP PDF URL
        </label>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1 border border-gray-200 dark:border-[#252A31] rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-[#171B20] focus-within:border-[#1C317A] dark:focus-within:border-[#3D5BA9] transition-colors">
            <DocumentTextIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.sebi.gov.in/sebi_data/attachdocs/..."
              className="flex-1 bg-transparent outline-none text-[13px] text-[#0f172a] dark:text-[#F1F5F9] placeholder:text-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C317A] hover:bg-[#28439E] text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-60 shrink-0 shadow-xs"
          >
            <DocumentMagnifyingGlassIcon className="w-4 h-4" />
            {loading ? "Analyzing..." : "Analyze DRHP"}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-[#6B7280] mt-2">
          Paste a direct link to the DRHP PDF from SEBI&apos;s EFILING portal or BSE/NSE disclosures. Rate limited to 5 analyses per hour.
        </p>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#1C317A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-gray-500 dark:text-[#9AA1AA]">Reading DRHP and extracting key information...</p>
          <p className="text-[11.5px] text-gray-400 dark:text-[#6B7280] mt-1">This may take 15–30 seconds for large documents.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-xl p-4 text-[13px] text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {result.company_name && (
            <h2 className="text-[1.1rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
              {result.company_name} — DRHP Analysis
            </h2>
          )}

          {result.summary && (
            <div className="bg-blue-50/60 dark:bg-[#0E1623] border border-[#1C317A]/20 dark:border-[#3D5BA9]/30 rounded-xl p-4 text-[13.5px] text-[#334155] dark:text-[#9AA1AA] leading-relaxed">
              {result.summary}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key Risks */}
            <div className="bg-white dark:bg-[#111418] border border-rose-200 dark:border-rose-800/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" />
                <h3 className="text-[13px] font-semibold text-rose-600 dark:text-rose-400">Key Risks</h3>
              </div>
              <ul className="space-y-2">
                {result.risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#475569] dark:text-[#9AA1AA]">
                    <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Opportunities */}
            <div className="bg-white dark:bg-[#111418] border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">Growth Opportunities</h3>
              </div>
              <ul className="space-y-2">
                {result.opportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#475569] dark:text-[#9AA1AA]">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Financial Snapshot */}
          {Object.values(result.financials).some(v => v) && (
            <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CurrencyRupeeIcon className="w-4 h-4 text-[#1C317A] dark:text-[#93B4FF]" />
                <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Financial Snapshot</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Revenue", value: result.financials.revenue },
                  { label: "Net Profit", value: result.financials.profit },
                  { label: "EPS", value: result.financials.eps },
                  { label: "P/E", value: result.financials.pe },
                  { label: "RoCE", value: result.financials.roce },
                ].filter(m => m.value).map(metric => (
                  <div key={metric.label} className="bg-gray-50 dark:bg-[#171B20] rounded-lg p-3">
                    <p className="text-[10.5px] text-gray-400 dark:text-[#9AA1AA] uppercase tracking-wider mb-1">{metric.label}</p>
                    <p className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-gray-400 dark:text-[#6B7280] leading-relaxed">
            ⚠️ This is an AI-generated summary of the filed DRHP. It may miss nuance or misinterpret complex legal/financial language.
            Always read the complete document before making any investment decision. IPOCraft does not provide investment advice.
          </p>
        </div>
      )}
    </div>
  );
}
