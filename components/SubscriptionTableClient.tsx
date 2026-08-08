"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { sortIposByNewestOpenDate } from "@/lib/ipoSort";
import GlossaryTooltip from "@/components/GlossaryTooltip";

type IpoRow = {
  id: number;
  name: string;
  slug: string;
  sub_qib: number | string | null;
  sub_nii: number | string | null;
  sub_shni: number | string | null;
  sub_bhni: number | string | null;
  sub_rii: number | string | null;
  sub_total: number | string | null;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  ipo_type: string | null;
};

type Props = {
  data: IpoRow[];
  filterStatus?: string;
  typeFilter?: string;
};

function getLocalYYYYMMDD(date = new Date()) {
  const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLifecycleStatus(ipo: Pick<IpoRow, "open_date" | "close_date">) {
  const todayStr = getLocalYYYYMMDD();
  if (ipo.close_date && ipo.close_date < todayStr) return "closed";
  if (ipo.open_date) {
    if (ipo.open_date > todayStr) return "upcoming";
    return "open";
  }
  return "upcoming";
}

function compareByClosingSoon(a: IpoRow, b: IpoRow) {
  const aTimestamp = a.close_date ? Date.parse(a.close_date) : null;
  const bTimestamp = b.close_date ? Date.parse(b.close_date) : null;
  if (aTimestamp == null && bTimestamp == null) return 0;
  if (aTimestamp == null) return 1;
  if (bTimestamp == null) return -1;
  return aTimestamp - bTimestamp;
}

function parseSub(val: any): number {
  if (!val) return 0;
  const parsed = Number(val);
  return isNaN(parsed) ? 0 : parsed;
}

function SubCell({ value }: { value: any }) {
  const num = parseSub(value);
  if (num === 0) return <span className="text-gray-400">—</span>;
  
  let colorClass = "text-gray-900";
  let bgClass = "bg-transparent";
  
  if (num >= 50) {
    colorClass = "text-emerald-700 font-bold";
    bgClass = "bg-emerald-100/50";
  } else if (num >= 10) {
    colorClass = "text-green-600 font-semibold";
  } else if (num >= 1) {
    colorClass = "text-blue-600 font-medium";
  } else {
    colorClass = "text-orange-500";
  }

  return (
    <span className={`inline-block px-1.5 py-0.5 rounded ${colorClass} ${bgClass}`}>
      {num.toFixed(2)}x
    </span>
  );
}

export default function SubscriptionTableClient({
  data,
  filterStatus,
  typeFilter,
}: Props) {
  const [activeTab, setActiveTab] = useState(filterStatus || "active");
  const [activeType, setActiveType] = useState(typeFilter || "all");

  const todayStr = getLocalYYYYMMDD();

  const processedData = useMemo(() => {
    let list = [...data];

    // 1. Filter by Status
    if (activeTab === "active") {
      list = list.filter((ipo) => {
        if (!ipo.close_date) return false;
        if (ipo.listing_date && ipo.listing_date <= todayStr) return false;
        return ipo.close_date >= todayStr || (ipo.open_date && ipo.open_date <= todayStr);
      });
      list.sort(compareByClosingSoon);
    } else if (activeTab === "upcoming") {
      list = list.filter((ipo) => ipo.open_date && ipo.open_date > todayStr);
      list = sortIposByNewestOpenDate(list);
    } else if (activeTab === "closed") {
      list = list.filter((ipo) => ipo.close_date && ipo.close_date < todayStr);
      list.sort((a, b) => {
        const aT = a.close_date ? Date.parse(a.close_date) : 0;
        const bT = b.close_date ? Date.parse(b.close_date) : 0;
        return bT - aT; 
      });
    }

    // 2. Filter by Type
    if (activeType !== "all") {
      list = list.filter(
        (ipo) => ipo.ipo_type?.toLowerCase() === activeType.toLowerCase()
      );
    }

    return list;
  }, [data, activeTab, activeType, todayStr]);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-[#f1f5f9] gap-4">
        {/* Status Tabs */}
        <div className="flex bg-[#f8fafc] p-1 rounded-lg border border-[#e2e8f0] w-fit">
          {[
            { id: "active", label: "Active" },
            { id: "upcoming", label: "Upcoming" },
            { id: "closed", label: "Closed" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-[13px] font-semibold rounded-md transition-all ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-sm border border-[#e2e8f0]"
                    : "text-[#64748b] hover:text-[#0f172a] border border-transparent"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Type Select */}
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
            Type
          </label>
          <select
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
            className="text-[13px] font-medium border border-[#cbd5e1] rounded-md px-3 py-1.5 bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <option value="all">All IPOs</option>
            <option value="mainboard">Mainboard</option>
            <option value="sme">SME</option>
          </select>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="py-3 px-5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider sticky left-0 bg-[#f8fafc] z-10 w-[220px]">
                IPO Name
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <GlossaryTooltip term="QIB">QIB</GlossaryTooltip>
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <GlossaryTooltip term="NII">NII</GlossaryTooltip>
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <GlossaryTooltip term="sNII">sNII</GlossaryTooltip>
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <GlossaryTooltip term="bNII">bNII</GlossaryTooltip>
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider bg-indigo-50/50">
                <GlossaryTooltip term="Retail">Retail</GlossaryTooltip>
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#0f172a] uppercase tracking-wider bg-indigo-50">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {processedData.length > 0 ? (
              processedData.map((row) => {
                const status = getLifecycleStatus(row);
                const isClosed = status === "closed";
                
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#f8fafc] transition-colors ${
                      isClosed ? "opacity-70 bg-gray-50/50" : ""
                    }`}
                  >
                    <td className="py-3.5 px-5 align-middle sticky left-0 bg-white z-10 w-[220px]">
                      <Link
                        href={`/ipo/${row.slug}`}
                        className="text-[14px] font-semibold text-[#0f172a] hover:text-[#2563eb] transition-colors line-clamp-1"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {row.name}
                      </Link>
                      <div className="flex gap-2 items-center mt-1">
                        {row.ipo_type && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${row.ipo_type.toLowerCase() === 'sme' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {row.ipo_type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-middle">
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_qib} />
                    </td>
                    <td className="py-3.5 px-4 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_nii} />
                    </td>
                    <td className="py-3.5 px-4 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_shni} />
                    </td>
                    <td className="py-3.5 px-4 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_bhni} />
                    </td>
                    <td className="py-3.5 px-4 align-middle text-[13px] bg-indigo-50/30" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_rii} />
                    </td>
                    <td className="py-3.5 px-4 align-middle text-[14px] font-bold bg-indigo-50/50" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_total} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <p className="text-[14px] text-[#64748b] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    No IPOs found matching the criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile View (Cards) ── */}
      <div className="block lg:hidden divide-y divide-[#f1f5f9]">
        {processedData.length > 0 ? (
          processedData.map((row) => {
            const status = getLifecycleStatus(row);
            const isClosed = status === "closed";

            return (
              <div
                key={row.id}
                className={`p-4 ${isClosed ? "opacity-75 bg-gray-50/50" : "bg-white"}`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Link
                    href={`/ipo/${row.slug}`}
                    className="text-[15px] font-semibold text-[#0f172a] hover:text-[#2563eb] leading-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {row.name}
                  </Link>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                    status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                    status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">QIB</p>
                    <p className="text-[13px] mt-0.5"><SubCell value={row.sub_qib} /></p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">NII</p>
                    <p className="text-[13px] mt-0.5"><SubCell value={row.sub_nii} /></p>
                  </div>
                  <div className="bg-indigo-50/50 p-2 rounded border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Retail</p>
                    <p className="text-[13px] mt-0.5"><SubCell value={row.sub_rii} /></p>
                  </div>
                  <div className="bg-indigo-100/50 p-2 rounded border border-indigo-200">
                    <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Total</p>
                    <p className="text-[14px] mt-0.5 font-bold"><SubCell value={row.sub_total} /></p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center px-4">
            <p className="text-[14px] text-[#64748b] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
              No IPOs found matching the criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
