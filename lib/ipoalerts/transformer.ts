// =============================================================================
// IPOAlerts — Field Transformer
// Maps raw IPOAlerts API response → IPOCraft DB enrichment schema
// =============================================================================

import type { IpoAlertsIpo, IpoAlertsEnrichmentData } from "./types";

// Map event strings from IPOAlerts schedule[] to DB column names
const SCHEDULE_EVENT_MAP: Record<string, keyof Pick<IpoAlertsEnrichmentData, "open_date" | "close_date" | "allotment_date" | "refund_date" | "listing_date">> = {
  "issue open date": "open_date",
  "open date": "open_date",
  "subscription open": "open_date",
  "issue close date": "close_date",
  "close date": "close_date",
  "subscription close": "close_date",
  "allotment finalization": "allotment_date",
  "allotment date": "allotment_date",
  "basis of allotment": "allotment_date",
  "refund initiation": "refund_date",
  "refund date": "refund_date",
  "listing date": "listing_date",
  "listing": "listing_date",
};

/**
 * Parse IPOAlerts schedule[] array into structured date fields.
 */
function parseSchedule(
  schedule?: IpoAlertsIpo["schedule"]
): Pick<IpoAlertsEnrichmentData, "open_date" | "close_date" | "allotment_date" | "refund_date" | "listing_date"> {
  const result = {
    open_date: null as string | null,
    close_date: null as string | null,
    allotment_date: null as string | null,
    refund_date: null as string | null,
    listing_date: null as string | null,
  };

  if (!schedule || !Array.isArray(schedule)) return result;

  for (const item of schedule) {
    if (!item.event || !item.date) continue;
    const normalizedEvent = item.event.toLowerCase().trim();
    for (const [key, field] of Object.entries(SCHEDULE_EVENT_MAP)) {
      if (normalizedEvent.includes(key)) {
        // Validate date format (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
          result[field] = item.date;
        }
        break;
      }
    }
  }

  return result;
}

/**
 * Parse priceRange string like "95-100" or "₹95 to ₹100" into min/max numbers.
 * Returns null if cannot parse.
 */
export function parsePriceRange(
  priceRange?: string | null
): { price_min: number | null; price_max: number | null } {
  if (!priceRange) return { price_min: null, price_max: null };

  // Remove currency symbols, spaces
  const cleaned = priceRange.replace(/[₹,\s]/g, "");

  // Match "95-100" or "95to100"
  const dashMatch = cleaned.match(/^(\d+(?:\.\d+)?)[–\-to]+(\d+(?:\.\d+)?)$/i);
  if (dashMatch) {
    return {
      price_min: parseFloat(dashMatch[1]),
      price_max: parseFloat(dashMatch[2]),
    };
  }

  // Single value "100"
  const singleMatch = cleaned.match(/^(\d+(?:\.\d+)?)$/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return { price_min: val, price_max: val };
  }

  return { price_min: null, price_max: null };
}

/**
 * Parse listing gain string like "15.5" or "-2" into a clean string "15.5".
 */
function parseListingGain(gain?: string | null): string | null {
  if (gain == null) return null;
  const str = String(gain).trim();
  if (!str || str === "null") return null;
  const num = parseFloat(str);
  if (isNaN(num)) return null;
  return num.toFixed(2);
}

/**
 * Transform an IPOAlerts IPO object → enrichment data to write to DB.
 * This only produces the DELTA fields that FinAPI doesn't provide.
 * Never use this to overwrite FinAPI primary data.
 */
export function transformIpoAlertsEnrichment(
  ipo: IpoAlertsIpo
): IpoAlertsEnrichmentData {
  const scheduleDates = parseSchedule(ipo.schedule);

  const mediaLinks =
    ipo.mediaCoverageLinks && ipo.mediaCoverageLinks.length > 0
      ? JSON.stringify(ipo.mediaCoverageLinks.slice(0, 5)) // max 5 links
      : null;

  return {
    symbol: ipo.symbol,
    listing_gain: parseListingGain(ipo.listingGain),
    nse_info_url: ipo.nseInfoUrl?.trim() || null,
    media_links: mediaLinks,
    prospectus_url: ipo.prospectusUrl?.trim() || null,
    lot_size: ipo.minQty ?? null,
    ...scheduleDates,
  };
}
