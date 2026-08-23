"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  BuildingLibraryIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export type AllotmentIpo = {
  id: number;
  name: string;
  slug: string;
  status: string | null;
  ipo_type: string | null;
  registrar: string | null;
  allotment_date: string | null;
  listing_date: string | null;
  price_max: number | null;
  price_min: number | null;
  allotment_out?: boolean | null;
};

const REGISTRAR_URLS: Record<string, string> = {
  "link intime": "https://linkintime.co.in/initial_offer/public-issues.html",
  "kfin technologies": "https://kprism.kfintech.com/ipostatus/",
  "kfin": "https://kprism.kfintech.com/ipostatus/",
  "bigshare": "https://ido.bigshareonline.com/IPO_Status.html",
  "purva sharegistry": "https://www.purvashare.com/investor-service/ipo-query",
  "skyline": "https://www.skylinerta.com/ipo_status.php",
  "cameo": "https://ipo.cameoindia.com/",
  "maashitla": "https://maashitla.com/allotment-status/public-issues",
  "ssr corporate": "https://ssr.shareinvestors.in/IPO_Status.html",
  "beetal": "https://beetalfinancial.com/ipo-allotment-status/",
  "integrated": "https://www.integratedindia.in/IPOAllotmentStatus.aspx",
  "mass": "http://www.masserv.com/opt.asp",
  "alankit": "https://alankit.com/ipo-allotment-status",
};

export default function AllotmentClient({ ipos }: { ipos: AllotmentIpo[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "MAINBOARD" | "SME">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OUT" | "AWAITING">("ALL");
  const [activeGuideTab, setActiveGuideTab] = useState<"pan" | "app" | "dpid">("pan");

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const getRegistrarUrl = (registrar: string | null) => {
    if (!registrar) return null;
    const lower = registrar.toLowerCase();
    for (const [key, url] of Object.entries(REGISTRAR_URLS)) {
      if (lower.includes(key)) return url;
    }
    return null;
  };

  const isAllotmentDeclared = (ipo: AllotmentIpo) => {
    if (ipo.allotment_out === true) return true;
    if (ipo.status?.toLowerCase() === "listed") return true;
    if (ipo.allotment_date && ipo.allotment_date < todayStr) return true;
    return false;
  };

  const filteredIpos = useMemo(() => {
    return ipos.filter((ipo) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = ipo.name.toLowerCase().includes(q);
        const matchRegistrar = ipo.registrar?.toLowerCase().includes(q);
        if (!matchName && !matchRegistrar) return false;
      }

      // Type Filter
      if (typeFilter === "SME" && ipo.ipo_type?.toUpperCase() !== "SME") return false;
      if (typeFilter === "MAINBOARD" && ipo.ipo_type?.toUpperCase() === "SME") return false;

      // Status Filter
      const isDeclared = isAllotmentDeclared(ipo);
      if (statusFilter === "OUT" && !isDeclared) return false;
      if (statusFilter === "AWAITING" && isDeclared) return false;

      return true;
    });
  }, [ipos, search, typeFilter, statusFilter, todayStr]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-[1.75rem] sm:text-[2.2rem] font-bold text-[#0f172a] dark:text-[#F1F3F5] leading-tight"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO Allotment Tracker
        </h1>
        <p className="text-[14px] sm:text-[14.5px] text-[#475569] dark:text-[#9AA1AA] max-w-3xl leading-relaxed mt-1">
          Check allotment status live for recent Mainboard and SME IPOs. Find official registrar links, exchange verification options, and allotment timelines.
        </p>
      </div>

      {/* Exchange Quick Verification Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <a
          href="https://www.bseindia.com/investors/appli_check.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] hover:border-gray-300 dark:hover:border-gray-500 transition-colors shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 font-bold text-[12.5px]">
              BSE
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                BSE Direct Allotment Check
              </div>
              <div className="text-[11.5px] text-[#64748B] dark:text-[#9AA1AA]">
                Verify issue status directly via BSE India portal
              </div>
            </div>
          </div>
          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
        </a>

        <a
          href="https://www.nseindia.com/products/content/equities/ipos/ipo_status.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-lg border border-gray-200 dark:border-[#252A31] bg-white dark:bg-[#111418] hover:border-gray-300 dark:hover:border-gray-500 transition-colors shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-bold text-[12.5px]">
              NSE
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                NSE Direct Bid Verification
              </div>
              <div className="text-[11.5px] text-[#64748B] dark:text-[#9AA1AA]">
                Check application status with PAN on NSE India
              </div>
            </div>
          </div>
          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
        </a>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IPO name or Registrar..."
              className="w-full pl-9 pr-3.5 py-1.5 text-[13px] rounded-md border border-gray-200 dark:border-[#252A31] bg-gray-50/50 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 placeholder-gray-400 dark:placeholder-[#6B7280]"
            />
          </div>

          {/* Segment Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["ALL", "MAINBOARD", "SME"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeFilter(tab)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors whitespace-nowrap ${
                  typeFilter === tab
                    ? "bg-[#1e3a8a] text-white dark:bg-[#171B20] dark:text-[#F1F3F5] border border-transparent dark:border-[#252A31]"
                    : "bg-gray-100 dark:bg-[#171B20] text-[#475569] dark:text-[#9AA1AA] hover:bg-gray-200 dark:hover:bg-[#1F242B]"
                }`}
              >
                {tab === "ALL" ? "All Segments" : tab === "MAINBOARD" ? "Mainboard" : "SME IPOs"}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-[#252A31] text-[12px]">
          <span className="text-[#64748B] dark:text-[#9AA1AA] font-medium mr-1">Status:</span>
          {(["ALL", "OUT", "AWAITING"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                statusFilter === st
                  ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] font-semibold border border-gray-200 dark:border-[#252A31]"
                  : "text-[#64748B] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
              }`}
            >
              {st === "ALL" ? "All" : st === "OUT" ? "Declared / Out" : "Awaiting Allotment"}
            </button>
          ))}
          <span className="ml-auto text-[11.5px] text-[#9AA1AA] dark:text-[#6B7280]">
            Showing {filteredIpos.length} IPOs
          </span>
        </div>
      </div>

      {/* Main Listing Table & Cards */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg overflow-hidden shadow-xs">
        <div className="divide-y divide-gray-100 dark:divide-[#252A31]">
          {filteredIpos.map((ipo) => {
            const url = getRegistrarUrl(ipo.registrar);
            const isDeclared = isAllotmentDeclared(ipo);

            return (
              <div
                key={ipo.id}
                className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8fafc] dark:hover:bg-[#171B20]/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link
                      href={`/ipo/${ipo.slug}`}
                      className="text-[14.5px] sm:text-[15px] font-semibold text-[#0f172a] dark:text-[#F1F3F5] hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      {ipo.name}
                    </Link>

                    {ipo.ipo_type?.toUpperCase() === "SME" && (
                      <span className="text-amber-700 dark:text-amber-400 text-[11px] font-medium shrink-0">
                        (SME)
                      </span>
                    )}

                    {isDeclared ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-semibold border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                        <CheckBadgeIcon className="w-3.5 h-3.5" />
                        Allotment Out
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#171B20] text-slate-600 dark:text-[#9AA1AA] text-[10.5px] font-medium border border-slate-200 dark:border-[#252A31] shrink-0">
                        Awaiting
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-[#64748B] dark:text-[#9AA1AA]">
                    <div className="flex items-center gap-1.5">
                      <span>Allotment:</span>
                      <span className="text-[#0f172a] dark:text-[#F1F3F5] font-medium">
                        {formatDate(ipo.allotment_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>Listing:</span>
                      <span className="text-[#0f172a] dark:text-[#F1F3F5]">
                        {formatDate(ipo.listing_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                      <span>Registrar:</span>
                      <span className="text-[#0f172a] dark:text-[#F1F3F5] truncate font-medium">
                        {ipo.registrar || "Exchange Disclosed"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-3.5 py-1.5 bg-[#1e3a8a] hover:bg-[#1a327a] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[12.5px] font-semibold rounded-md transition-colors shadow-xs"
                    >
                      <span>Check on {ipo.registrar ? ipo.registrar.split(" ")[0] : "Registrar"}</span>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href="https://www.bseindia.com/investors/appli_check.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-3.5 py-1.5 bg-slate-100 dark:bg-[#171B20] hover:bg-slate-200 dark:hover:bg-[#1F242B] text-slate-800 dark:text-[#F1F3F5] text-[12.5px] font-semibold rounded-md border border-gray-200 dark:border-[#252A31] transition-colors"
                    >
                      <span>Check on BSE</span>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredIpos.length === 0 && (
            <div className="p-8 text-center text-[#64748B] dark:text-[#9AA1AA]">
              <QuestionMarkCircleIcon className="w-7 h-7 mx-auto mb-2 text-gray-400 dark:text-[#6B7280]" />
              <div className="text-[14px] font-semibold text-[#0f172a] dark:text-[#F1F3F5]">No matching IPOs found</div>
              <div className="text-[12.5px] mt-0.5">Try adjusting your search query or filter.</div>
            </div>
          )}
        </div>
      </div>

      {/* Guide: Step-by-Step Allotment Verification */}
      <div className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <BuildingLibraryIcon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          <h2
            className="text-[15px] sm:text-[16px] font-bold text-[#0f172a] dark:text-[#F1F5F9]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            How to Check IPO Allotment Status
          </h2>
        </div>

        {/* Tab switcher for lookup methods */}
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#252A31] pb-2.5">
          <button
            onClick={() => setActiveGuideTab("pan")}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-colors ${
              activeGuideTab === "pan"
                ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] border border-gray-200 dark:border-[#252A31]"
                : "text-[#64748B] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
            }`}
          >
            Method 1: Using PAN (Fastest)
          </button>
          <button
            onClick={() => setActiveGuideTab("app")}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-colors ${
              activeGuideTab === "app"
                ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] border border-gray-200 dark:border-[#252A31]"
                : "text-[#64748B] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
            }`}
          >
            Method 2: Application No
          </button>
          <button
            onClick={() => setActiveGuideTab("dpid")}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-colors ${
              activeGuideTab === "dpid"
                ? "bg-gray-100 dark:bg-[#171B20] text-[#0f172a] dark:text-[#F1F3F5] border border-gray-200 dark:border-[#252A31]"
                : "text-[#64748B] dark:text-[#9AA1AA] hover:bg-gray-50 dark:hover:bg-[#171B20]"
            }`}
          >
            Method 3: DP ID / Client ID
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-[13px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          {activeGuideTab === "pan" && (
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Click on the <strong>Check on Registrar</strong> button above for your specific IPO.</li>
              <li>Select <strong>PAN</strong> as your query identification method.</li>
              <li>Enter your 10-digit Permanent Account Number (PAN).</li>
              <li>Submit to view shares allotted and transaction details.</li>
            </ol>
          )}

          {activeGuideTab === "app" && (
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Find your IPO Application Number in your broker's order confirmation email.</li>
              <li>Select <strong>Application Number</strong> on the registrar portal.</li>
              <li>Choose ASBA or Non-ASBA mode.</li>
              <li>Submit to view allotment status.</li>
            </ol>
          )}

          {activeGuideTab === "dpid" && (
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Select depository (NSDL or CDSL) on the registrar page.</li>
              <li>For <strong>CDSL</strong>, enter your 16-digit Beneficiary Account number.</li>
              <li>For <strong>NSDL</strong>, enter your 8-character DP ID followed by 8-digit Client ID.</li>
              <li>Submit to verify shares credited to your demat account.</li>
            </ol>
          )}
        </div>

        <div className="p-3 rounded-md bg-gray-50 dark:bg-[#171B20] border border-gray-200 dark:border-[#252A31] flex items-start gap-2 text-[12px] text-[#475569] dark:text-[#9AA1AA]">
          <InformationCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Bank ASBA Mandate:</strong> If shares are not allotted, your blocked bank funds will be released within 24-48 hours after allotment confirmation.
          </span>
        </div>
      </div>
    </div>
  );
}
