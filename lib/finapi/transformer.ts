import type {
  RawFinApiIpo,
  RawFinApiGmpTrend,
  NormalizedIpoData,
} from "./types";
import { SEBI_RETAIL_MAX_INVESTMENT, SEBI_SHNI_MAX_INVESTMENT } from "@/lib/sebi-constants";

export function parsePriceRange(
  rawRange?: string | null
): { price_min: number | null; price_max: number | null } {
  if (!rawRange) return { price_min: null, price_max: null };

  const cleaned = String(rawRange)
    .replace(/[₹,\s]/g, "")
    .replace(/–|—|to/gi, "-");

  const parts = cleaned.split("-").map((p) => parseFloat(p)).filter((n) => !isNaN(n));

  if (parts.length === 0) return { price_min: null, price_max: null };
  if (parts.length === 1) return { price_min: parts[0], price_max: parts[0] };

  const min = Math.min(parts[0], parts[1]);
  const max = Math.max(parts[0], parts[1]);
  return { price_min: min, price_max: max };
}

export function parseNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return isNaN(value) ? null : value;
  const str = String(value).replace(/[₹,xX%\s]/g, "").trim();
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

export function normalizeStatus(
  rawStatus?: string | null,
  listingDate?: string | null
): "Open" | "Upcoming" | "Listed" | "Closed" {
  const upper = (rawStatus || "").toUpperCase().trim();

  if (upper === "LIVE" || upper === "OPEN") {
    return "Open";
  }

  if (upper === "UPCOMING") {
    return "Upcoming";
  }

  if (upper === "LISTED") {
    return "Listed";
  }

  if (upper === "CLOSED") {
    if (listingDate) {
      const listing = new Date(listingDate);
      const today = new Date();
      if (listing <= today) {
        return "Listed";
      }
    }
    return "Closed";
  }

  return "Upcoming";
}

export function normalizeIpoType(rawType?: string | null): "Mainboard" | "SME" {
  const type = (rawType || "").toLowerCase().trim();
  if (type.includes("sme")) return "SME";
  return "Mainboard";
}

export function calculateLotTiers(
  lotSize: number | null,
  priceMax: number | null
) {
  if (!lotSize || !priceMax || lotSize <= 0 || priceMax <= 0) {
    return {
      retail_min_lots: 1,
      retail_min_shares: lotSize ?? null,
      retail_min_amount: lotSize ? lotSize * (priceMax || 0) : null,
      retail_max_lots: null,
      retail_max_shares: null,
      retail_max_amount: null,
      shni_min_lots: null,
      shni_min_shares: null,
      shni_min_amount: null,
      shni_max_lots: null,
      shni_max_shares: null,
      shni_max_amount: null,
      bhni_min_lots: null,
      bhni_min_shares: null,
      bhni_min_amount: null,
    };
  }

  const oneLotAmount = lotSize * priceMax;

  // Retail (Min 1 lot, Max up to ₹2,00,000)
  const retail_min_lots = 1;
  const retail_min_shares = lotSize;
  const retail_min_amount = oneLotAmount;

  const maxRetailLots = Math.max(1, Math.floor(SEBI_RETAIL_MAX_INVESTMENT / oneLotAmount));
  const retail_max_lots = maxRetailLots;
  const retail_max_shares = maxRetailLots * lotSize;
  const retail_max_amount = retail_max_shares * priceMax;

  // Small HNI / sHNI (₹2,00,000 to ₹10,00,000)
  const shni_min_lots = retail_max_lots + 1;
  const shni_min_shares = shni_min_lots * lotSize;
  const shni_min_amount = shni_min_shares * priceMax;

  const maxShniLots = Math.max(shni_min_lots, Math.floor(SEBI_SHNI_MAX_INVESTMENT / oneLotAmount));
  const shni_max_lots = maxShniLots;
  const shni_max_shares = maxShniLots * lotSize;
  const shni_max_amount = shni_max_shares * priceMax;

  // Big HNI / bHNI (> ₹10,00,000)
  const bhni_min_lots = shni_max_lots + 1;
  const bhni_min_shares = bhni_min_lots * lotSize;
  const bhni_min_amount = bhni_min_shares * priceMax;

  return {
    retail_min_lots,
    retail_min_shares,
    retail_min_amount,
    retail_max_lots,
    retail_max_shares,
    retail_max_amount,
    shni_min_lots,
    shni_min_shares,
    shni_min_amount,
    shni_max_lots,
    shni_max_shares,
    shni_max_amount,
    bhni_min_lots,
    bhni_min_shares,
    bhni_min_amount,
  };
}

export function formatBulletPoints(items?: string[] | null): string | null {
  if (!items || !items.length) return null;
  return items.map((item, idx) => `${idx + 1}. ${item.trim()}`).join("\n");
}

export function formatObjectives(utilization?: Record<string, string | null | undefined> | null): string | null {
  if (!utilization) return null;
  const parts: string[] = [];

  for (const [key, val] of Object.entries(utilization)) {
    if (val) {
      const cleanKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      parts.push(`• ${cleanKey}: ₹${val} Cr`);
    }
  }

  return parts.length ? parts.join("\n") : null;
}

export function parseGmpDateToIso(dateStr: string, defaultYear = 2026): string {
  // Handles strings like "18 August", "7 August", "2026-08-18"
  if (dateStr.includes("-")) {
    return new Date(dateStr).toISOString();
  }

  const months: Record<string, number> = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const month = months[monthName] ?? 7; // default August
    const date = new Date(Date.UTC(defaultYear, month, isNaN(day) ? 1 : day, 12, 0, 0));
    return date.toISOString();
  }

  return new Date().toISOString();
}

export function parseGmpTrends(
  trends?: RawFinApiGmpTrend[] | null
): { gmp: number; dateIso: string }[] {
  if (!trends || !Array.isArray(trends)) return [];

  const results: { gmp: number; dateIso: string }[] = [];

  for (const point of trends) {
    if (point.gmp != null) {
      const gmpNum = parseNumber(point.gmp);
      if (gmpNum !== null) {
        results.push({
          gmp: gmpNum,
          dateIso: parseGmpDateToIso(point.date),
        });
      }
    }
  }

  // Sort ascending by date for chart consistency
  results.sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime());
  return results;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function transformFinApiIpo(raw: RawFinApiIpo): NormalizedIpoData {
  const { price_min, price_max } = parsePriceRange(raw.priceRange);
  const lot_size = parseNumber(raw.lotSize);
  const status = normalizeStatus(raw.status, raw.schedule?.listingDate);
  const ipo_type = normalizeIpoType(raw.type);

  // Lot tiers
  const lots = calculateLotTiers(lot_size, price_max);

  // GMP
  const gmpTrends = parseGmpTrends(raw.greyMarketPremium?.gmpTrends);
  const latestGmpPoint = gmpTrends.at(-1);
  const fallbackGmp =
    parseNumber((raw.greyMarketPremium as any)?.currentGmp) ??
    parseNumber((raw.greyMarketPremium as any)?.gmp) ??
    parseNumber((raw as any)?.gmp) ??
    null;
  const gmp = latestGmpPoint ? latestGmpPoint.gmp : fallbackGmp;

  // Subscriptions
  const sub_total = parseNumber(raw.subscriptionNumbers?.total?.subscription);
  const sub_qib = parseNumber(raw.subscriptionNumbers?.institutional?.subscription);
  const sub_nii = parseNumber(raw.subscriptionNumbers?.nii?.subscription);
  const sub_rii = parseNumber(raw.subscriptionNumbers?.retail?.subscription);

  // Issue size
  const issue_size = raw.issueSize?.totalIssueSize
    ? String(raw.issueSize.totalIssueSize)
    : null;
  const fresh_issue = raw.issueSize?.freshIssue
    ? String(raw.issueSize.freshIssue)
    : null;

  // Narratives
  const company_strengths = formatBulletPoints(raw.strengths);
  const company_risks = formatBulletPoints(raw.risks);
  const objectives = formatObjectives(raw.utilizationOfProceeds);

  // Exchanges
  const exchange = raw.exchanges || (ipo_type === "SME" ? "NSE SME" : "NSE, BSE");

  return {
    symbol: raw.symbol ? raw.symbol.toUpperCase().trim() : null,
    name: raw.name.trim(),
    slug: generateSlug(raw.name),
    ipo_type,
    exchange,
    listing_exchange: exchange,
    status,
    price_min,
    price_max,
    lot_size,
    issue_size,
    fresh_issue,
    open_date: raw.schedule?.startDate || null,
    close_date: raw.schedule?.endDate || null,
    listing_date: raw.schedule?.listingDate || null,
    allotment_date: raw.schedule?.allotmentFinalization || null,
    refund_date: raw.schedule?.refundInitiation || null,
    gmp,
    sub_total,
    sub_qib,
    sub_nii,
    sub_rii,
    about_company: raw.aboutCompany || null,
    company_strengths,
    company_risks,
    objectives,
    logo_url: raw.logoUrl || null,
    drhp_link: raw.drhpLink || null,
    rhp_link: raw.rhpLink || null,
    ...lots,
    gmpTrends,
  };
}
