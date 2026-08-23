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

import { formatSubscriptionTimes, formatDisplayDate } from "@/lib/formatters";

function SubCell({ value, isTotal = false }: { value: any; isTotal?: boolean }) {
  const formatted = formatSubscriptionTimes(value, "—");
  if (formatted === "—") {
    return <span className="text-[#94A3B8] dark:text-[#64748B]">—</span>;
  }

  return (
    <span
      className={`tabular-nums ${
        isTotal
          ? "font-bold text-[#0f172a] dark:text-[#F1F5F9]"
          : "font-medium text-[#334155] dark:text-[#CBD5E1]"
      }`}
    >
      {formatted}
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
    <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg overflow-hidden shadow-xs">
      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 border-b border-gray-100 dark:border-[#252A31] gap-3">
        {/* Status Tabs */}
        <div className="flex bg-gray-50 dark:bg-[#171B20] p-1 rounded-md border border-gray-200 dark:border-[#252A31] w-fit">
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
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-xs border border-gray-900 dark:border-white"
                    : "text-gray-600 dark:text-[#9AA1AA] hover:text-gray-900 dark:hover:text-[#F1F5F9] border border-transparent"
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
          <label className="text-[11.5px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
            Segment
          </label>
          <select
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
            className="text-[12.5px] font-medium border border-gray-200 dark:border-[#252A31] rounded-md px-2.5 py-1.5 bg-white dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F5F9] focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-1 dark:focus:ring-white"
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
          <thead className="bg-[#f8fafc] dark:bg-[#171B20] border-b border-gray-200 dark:border-[#252A31]">
            <tr>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider sticky left-0 bg-[#f8fafc] dark:bg-[#171B20] z-10 w-[220px]">
                IPO Name
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
                Status
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
                <GlossaryTooltip term="QIB">QIB</GlossaryTooltip>
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
                <GlossaryTooltip term="NII">NII</GlossaryTooltip>
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
                <GlossaryTooltip term="sNII">sNII</GlossaryTooltip>
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
                <GlossaryTooltip term="bNII">bNII</GlossaryTooltip>
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#475569] dark:text-[#9AA1AA] uppercase tracking-wider">
                <GlossaryTooltip term="Retail">Retail</GlossaryTooltip>
              </th>
              <th className="py-2.5 px-3.5 text-[11px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#252A31]">
            {processedData.length > 0 ? (
              processedData.map((row) => {
                const status = getLifecycleStatus(row);
                const isClosed = status === "closed";
                
                return (
                  <tr
                    key={row.id}
                    className={`group hover:bg-gray-50 dark:hover:bg-[#171B20]/60 bg-white dark:bg-[#111418] transition-colors ${
                      isClosed ? "opacity-75" : ""
                    }`}
                  >
                    <td className="py-3 px-4 align-middle sticky left-0 bg-white dark:bg-[#111418] group-hover:bg-gray-50 dark:group-hover:bg-[#171B20] z-10 w-[220px] border-r border-gray-200 dark:border-[#252A31]">
                      <Link
                        href={`/ipo/${row.slug}`}
                        className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {row.name}
                      </Link>
                      <div className="flex gap-1.5 items-center mt-0.5">
                        {row.ipo_type && (
                          <span className="text-[10.5px] text-gray-500 dark:text-[#9AA1AA] font-medium">
                            {row.ipo_type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 align-middle">
                      <span className={`text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                        status === 'open' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        status === 'upcoming' ? 'bg-gray-100 text-gray-700 dark:bg-[#171B20] dark:text-[#9AA1AA]' : 
                        'bg-gray-100 text-gray-700 dark:bg-[#171B20] dark:text-[#9AA1AA]'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_qib} />
                    </td>
                    <td className="py-3 px-3.5 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_nii} />
                    </td>
                    <td className="py-3 px-3.5 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_shni} />
                    </td>
                    <td className="py-3 px-3.5 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_bhni} />
                    </td>
                    <td className="py-3 px-3.5 align-middle text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_rii} />
                    </td>
                    <td className="py-3 px-3.5 align-middle text-[13.5px]" style={{ fontFamily: "var(--font-inter)" }}>
                      <SubCell value={row.sub_total} isTotal={true} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-10 text-center">
                  <p className="text-[13.5px] text-gray-500 dark:text-[#9AA1AA] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                    No IPOs found matching the criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile View (Cards) ── */}
      <div className="block lg:hidden divide-y divide-gray-100 dark:divide-[#252A31]">
        {processedData.length > 0 ? (
          processedData.map((row) => {
            const status = getLifecycleStatus(row);
            const isClosed = status === "closed";

            return (
              <div
                key={row.id}
                className={`p-3.5 ${isClosed ? "opacity-75 bg-gray-50/50 dark:bg-[#111418]/50" : "bg-white dark:bg-[#111418]"}`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Link
                    href={`/ipo/${row.slug}`}
                    className="text-[14.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] hover:text-blue-600 dark:hover:text-blue-400 leading-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {row.name}
                  </Link>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md shrink-0 ${
                    status === 'open' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                    status === 'upcoming' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-[#171B20] dark:text-[#9AA1AA]'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 dark:bg-[#171B20] p-2 rounded-md border border-gray-100 dark:border-[#252A31]">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wide">QIB</p>
                    <p className="text-[13px] mt-0.5"><SubCell value={row.sub_qib} /></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#171B20] p-2 rounded-md border border-gray-100 dark:border-[#252A31]">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wide">NII</p>
                    <p className="text-[13px] mt-0.5"><SubCell value={row.sub_nii} /></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#171B20] p-2 rounded-md border border-gray-100 dark:border-[#252A31]">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wide">Retail</p>
                    <p className="text-[13px] mt-0.5"><SubCell value={row.sub_rii} /></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#171B20] p-2 rounded-md border border-gray-100 dark:border-[#252A31]">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-[#9AA1AA] uppercase tracking-wide">Total</p>
                    <p className="text-[13.5px] mt-0.5"><SubCell value={row.sub_total} isTotal={true} /></p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center px-4">
            <p className="text-[13.5px] text-gray-500 dark:text-[#9AA1AA] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
              No IPOs found matching the criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

