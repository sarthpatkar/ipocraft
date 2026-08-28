"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlassIcon, XMarkIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

interface IpoRow {
  id: string;
  slug: string;
  name: string;
  status?: string;
  gmp?: number | null;
  gmp_percent?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  lot_size?: number | null;
  issue_size?: number | null;
  sub_total?: number | null;
  sub_rii?: number | null;
  sub_nii?: number | null;
  sub_qib?: number | null;
  open_date?: string | null;
  close_date?: string | null;
  allotment_date?: string | null;
  listing_date?: string | null;
  ipo_type?: string | null;
  listing_gain_percent?: number | null;
}

function fmt(val: unknown, prefix = "", suffix = "", decimals = 1) {
  if (val == null || val === "" || val === "—") return "—";
  const num = typeof val === "number" ? val : Number(val);
  if (isNaN(num)) return typeof val === "string" ? val : "—";
  return `${prefix}${num.toFixed(decimals)}${suffix}`;
}

function fmtDate(d: string | null | undefined) {
  if (!d || d === "—") return "—";
  try {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
  } catch {
    return d;
  }
}

const METRICS = [
  {
    label: "GMP",
    key: "gmp",
    render: (r: IpoRow) => {
      if (r.gmp == null) return "—";
      const gmpNum = Number(r.gmp);
      const pctNum = r.gmp_percent != null ? Number(r.gmp_percent) : null;
      if (isNaN(gmpNum)) return String(r.gmp);
      return `₹${gmpNum}${pctNum != null && !isNaN(pctNum) ? ` (${pctNum.toFixed(1)}%)` : ""}`;
    },
    highlight: true,
  },
  {
    label: "Issue Price",
    key: "price",
    render: (r: IpoRow) => (r.price_max ? `₹${r.price_min}–₹${r.price_max}` : r.price_min ? `₹${r.price_min}` : "—"),
  },
  {
    label: "Lot Size",
    key: "lot_size",
    render: (r: IpoRow) => (r.lot_size ? `${r.lot_size} shares` : "—"),
  },
  {
    label: "Issue Size",
    key: "issue_size",
    render: (r: IpoRow) => (r.issue_size ? `₹${r.issue_size} Cr` : "—"),
  },
  {
    label: "Total Sub.",
    key: "sub_total",
    render: (r: IpoRow) => fmt(r.sub_total, "", "x"),
    highlight: true,
  },
  {
    label: "Retail (RII) Sub.",
    key: "sub_rii",
    render: (r: IpoRow) => fmt(r.sub_rii, "", "x"),
  },
  {
    label: "HNI (NII) Sub.",
    key: "sub_nii",
    render: (r: IpoRow) => fmt(r.sub_nii, "", "x"),
  },
  {
    label: "QIB Sub.",
    key: "sub_qib",
    render: (r: IpoRow) => fmt(r.sub_qib, "", "x"),
  },
  {
    label: "Type",
    key: "ipo_type",
    render: (r: IpoRow) => r.ipo_type || "—",
  },
  {
    label: "Status",
    key: "status",
    render: (r: IpoRow) => r.status || "—",
  },
  {
    label: "Open Date",
    key: "open_date",
    render: (r: IpoRow) => fmtDate(r.open_date),
  },
  {
    label: "Close Date",
    key: "close_date",
    render: (r: IpoRow) => fmtDate(r.close_date),
  },
  {
    label: "Allotment Date",
    key: "allotment_date",
    render: (r: IpoRow) => fmtDate(r.allotment_date),
  },
  {
    label: "Listing Date",
    key: "listing_date",
    render: (r: IpoRow) => fmtDate(r.listing_date),
  },
  {
    label: "Listing Gain",
    key: "listing_gain_percent",
    render: (r: IpoRow) => {
      if (r.listing_gain_percent == null) return "—";
      const num = Number(r.listing_gain_percent);
      if (isNaN(num)) return String(r.listing_gain_percent);
      return `${num > 0 ? "+" : ""}${num.toFixed(1)}%`;
    },
    highlight: true,
  },
];


export default function IpoCompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSlugs = (searchParams.get("ipos") || "").split(",").filter(Boolean).slice(0, 3);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const [ipoData, setIpoData] = useState<Record<string, IpoRow>>({});
  const [allIpos, setAllIpos] = useState<IpoRow[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState(false);
  const [compareError, setCompareError] = useState(false);

  // Fetch all IPO names for the picker
  useEffect(() => {
    fetch("/api/ipos/list")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setAllIpos(d);
          setListError(false);
        } else {
          setListError(true);
        }
      })
      .catch(() => setListError(true));
  }, []);

  // Fetch data for selected slugs
  useEffect(() => {
    if (selectedSlugs.length === 0) return;
    setLoading(true);
    setCompareError(false);
    fetch(`/api/ipos/compare?slugs=${selectedSlugs.join(",")}`)
      .then(r => r.json())
      .then((rows: IpoRow[] | { error: string }) => {
        if (!Array.isArray(rows)) throw new Error("error" in rows ? rows.error : "Unexpected response");
        const map: Record<string, IpoRow> = {};
        for (const r of rows) map[r.slug] = r;
        setIpoData(map);
      })
      .catch(() => setCompareError(true))
      .finally(() => setLoading(false));
  }, [selectedSlugs]);

  // Update URL when selection changes
  useEffect(() => {
    if (selectedSlugs.length > 0) {
      router.replace(`/compare?ipos=${selectedSlugs.join(",")}`, { scroll: false });
    }
  }, [selectedSlugs, router]);

  const addIpo = useCallback((slug: string) => {
    if (selectedSlugs.includes(slug) || selectedSlugs.length >= 3) return;
    setSelectedSlugs(prev => [...prev, slug]);
    setSearchQ("");
  }, [selectedSlugs]);

  const removeIpo = useCallback((slug: string) => {
    setSelectedSlugs(prev => prev.filter(s => s !== slug));
    setIpoData(prev => { const n = {...prev}; delete n[slug]; return n; });
  }, []);

  const filtered = allIpos.filter(ipo =>
    ipo.name.toLowerCase().includes(searchQ.toLowerCase()) && !selectedSlugs.includes(ipo.slug)
  ).slice(0, 8);

  const selectedData = selectedSlugs.map(s => ipoData[s]).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* IPO Picker */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#9AA1AA] mb-3">
          Select IPOs to compare ({selectedSlugs.length}/3)
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSlugs.map(slug => (
            <div key={slug} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C317A]/10 dark:bg-[#1C317A]/20 border border-[#1C317A]/25 dark:border-[#3D5BA9]/40 rounded-lg">
              <span className="text-[12.5px] font-medium text-[#1C317A] dark:text-[#93B4FF]">
                {ipoData[slug]?.name || slug}
              </span>
              <button
                onClick={() => removeIpo(slug)}
                aria-label={`Remove ${ipoData[slug]?.name || slug} from comparison`}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {selectedSlugs.length < 3 && (
            <div className="relative">
              <div className="flex items-center gap-2 border border-gray-200 dark:border-[#252A31] rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-[#171B20]">
                <MagnifyingGlassIcon className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IPO..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="text-[12.5px] bg-transparent outline-none text-[#0f172a] dark:text-[#F1F5F9] placeholder:text-gray-400 w-40"
                />
              </div>
              {listError && (
                <p className="mt-1.5 text-[11.5px] text-rose-600 dark:text-rose-400">
                  Couldn&apos;t load the IPO list. Please refresh the page.
                </p>
              )}
              {searchQ && filtered.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg shadow-lg z-50 overflow-hidden">
                  {filtered.map(ipo => (
                    <button
                      key={ipo.slug}
                      onClick={() => addIpo(ipo.slug)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#171B20] text-left transition-colors"
                    >
                      <span className="text-[12.5px] font-medium text-[#0f172a] dark:text-[#F1F5F9] flex-1 truncate">{ipo.name}</span>
                      {ipo.status && (
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          ipo.status === "Open" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" :
                          ipo.status === "Upcoming" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" :
                          "bg-gray-100 text-gray-500 dark:bg-[#1E232B] dark:text-gray-400"
                        }`}>{ipo.status}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {compareError && selectedSlugs.length > 0 && (
        <div className="text-center py-10 px-5 bg-white dark:bg-[#111418] border border-rose-200 dark:border-rose-900/40 rounded-xl">
          <p className="text-[13.5px] text-rose-600 dark:text-rose-400 font-medium">
            Couldn&apos;t load comparison data. Please try again in a moment.
          </p>
        </div>
      )}
      {!compareError && selectedData.length > 0 && (
        <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-xl overflow-hidden">
          {loading && (
            <div className="px-5 py-2 bg-blue-50 dark:bg-[#0E1623] text-[12px] text-[#1C317A] dark:text-[#93B4FF]">
              Updating data...
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#252A31] bg-gray-50/80 dark:bg-[#0D1117]/60">
                  <th className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#9AA1AA] w-36">
                    Metric
                  </th>
                  {selectedData.map(ipo => (
                    <th key={ipo.slug} className="py-3 px-4 text-center">
                      <Link href={`/ipo/${ipo.slug}`} className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:text-[#1C317A] dark:hover:text-[#93B4FF] transition-colors">
                        {ipo.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#1F242C]">
                {METRICS.map(metric => (
                  <tr key={metric.key} className={metric.highlight ? "bg-blue-50/30 dark:bg-[#0E1623]/30" : ""}>
                    <td className="py-3 px-4 text-[12px] font-medium text-gray-500 dark:text-[#9AA1AA] whitespace-nowrap">
                      {metric.label}
                    </td>
                    {selectedData.map(ipo => {
                      const val = metric.render(ipo);
                      const isPositive = metric.key === "gmp" && (ipo.gmp ?? 0) > 0;
                      const isNegative = metric.key === "gmp" && (ipo.gmp ?? 0) < 0;
                      const isGainPositive = metric.key === "listing_gain_percent" && (ipo.listing_gain_percent ?? 0) > 0;
                      const isGainNegative = metric.key === "listing_gain_percent" && (ipo.listing_gain_percent ?? 0) < 0;
                      return (
                        <td key={ipo.slug} className={`py-3 px-4 text-center text-[13px] font-medium ${
                          isPositive || isGainPositive ? "text-emerald-600 dark:text-emerald-400" :
                          isNegative || isGainNegative ? "text-rose-600 dark:text-rose-400" :
                          "text-[#0f172a] dark:text-[#F1F5F9]"
                        }`}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50/60 dark:bg-[#0D1117]/40 flex items-center justify-between">
            <p className="text-[11px] text-gray-400 dark:text-[#6B7280]">
              GMP is unofficial and indicative. Data updates every 30–60 minutes.
            </p>
            <button
              onClick={() => {
                const url = `${window.location.origin}/compare?ipos=${selectedSlugs.join(",")}`;
                navigator.clipboard?.writeText(url).catch(() => {});
              }}
              className="text-[12px] font-medium text-[#1C317A] dark:text-[#93B4FF] hover:underline flex items-center gap-1"
            >
              <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
              Copy comparison link
            </button>
          </div>
        </div>
      )}

      {selectedSlugs.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-[#9AA1AA]">
          <ArrowsRightLeftIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-[14px]">Search for IPOs above to start comparing</p>
        </div>
      )}
    </div>
  );
}
