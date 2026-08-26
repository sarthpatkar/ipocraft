/**
 * lib/chat/intentClassifier.ts
 * High-speed 0ms heuristic intent classifier & entity extractor.
 * Extracts intent, company names, and filters without costly LLM roundtrips.
 */

export type IntentType =
  | "gmp_lookup"
  | "subscription_lookup"
  | "timeline_lookup"
  | "compare_ipos"
  | "list_ipos"
  | "performance_lookup"
  | "allotment_odds"
  | "educational"
  | "off_topic";

export interface ClassifiedIntent {
  intent: IntentType;
  /** Extracted company names, lowercased */
  ipoNames: string[];
  /** Optional status filter: "open" | "upcoming" | "listed" | "closed" | null */
  statusFilter: string | null;
  /** Output format preference */
  outputFormat: "text" | "table" | "chart" | "auto";
  /** Limit for multi-item list */
  limit: number | null;
}

const GENERIC_WORDS = new Set([
  "ipo", "ipos", "latest", "recent", "open", "upcoming", "closed", "listed",
  "new", "today", "yesterday", "tomorrow", "this", "week", "month", "all",
  "gmp", "allotment", "status", "subscription", "price", "band", "date",
  "dates", "gain", "gains", "return", "returns", "performance", "sme", "mainboard", "compare",
  "vs", "versus", "and", "or", "what", "is", "the", "for", "in", "of",
  "tell", "me", "about", "show", "how", "much", "many", "when", "odds", "chance",
  "live", "active", "right", "now", "current", "currently", "available", "bids", "demand",
  "estimated", "listing", "expected", "ratios", "highest", "lowest", "maximum", "minimum",
  "top", "multiple", "multiples", "which", "are", "have", "with", "total", "retail", "qib", "nii",
  "ratio", "shares", "stock", "stocks", "market", "premium", "draw", "lottery", "calendar", "timeline"
]);

function isGeneralMarketQuery(lower: string): boolean {
  return (
    lower.includes("all open") ||
    lower.includes("open ipo") ||
    lower.includes("active ipo") ||
    lower.includes("open today") ||
    lower.includes("ipos open") ||
    lower.includes("highest expected") ||
    lower.includes("highest gmp") ||
    lower.includes("compare subscription") ||
    lower.includes("subscription multiple") ||
    lower.includes("subscription demand") ||
    lower.includes("top active") ||
    lower.includes("compare active") ||
    lower.includes("opening, closing, or listing") ||
    lower.includes("opening and listing this week") ||
    lower.includes("recently listed") ||
    lower.includes("listing day performance") ||
    lower.includes("which ipos") ||
    lower.includes("what are open") ||
    lower.includes("compare top")
  );
}

export function classifyIntent(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }>
): ClassifiedIntent {
  const cleanInput = userMessage.toLowerCase().replace(/[?!,.:;()"]/g, " ").trim();
  const lower = cleanInput;

  // 1. Identify Status Filter
  let statusFilter: string | null = null;
  if (lower.includes("open") || lower.includes("live") || lower.includes("active") || lower.includes("today") || lower.includes("right now")) {
    statusFilter = "open";
  } else if (lower.includes("upcoming") || lower.includes("next week") || lower.includes("pipeline")) {
    statusFilter = "upcoming";
  } else if (lower.includes("listed") || lower.includes("historical") || lower.includes("past")) {
    statusFilter = "listed";
  } else if (lower.includes("closed")) {
    statusFilter = "closed";
  }

  // 2. Identify Intent Type
  let intent: IntentType = "educational";

  if (lower.includes("compare") || lower.includes(" vs ") || lower.includes(" versus ") || lower.includes("better than")) {
    intent = "compare_ipos";
  } else if (lower.includes("gmp") || lower.includes("grey market") || lower.includes("premium")) {
    intent = "gmp_lookup";
  } else if (lower.includes("subscri") || lower.includes("bid") || lower.includes("demand") || lower.includes("qib") || lower.includes("rii") || lower.includes("nii")) {
    intent = "subscription_lookup";
  } else if (lower.includes("date") || lower.includes("when") || lower.includes("timeline") || lower.includes("calendar") || lower.includes("listing day") || lower.includes("allotment day")) {
    intent = "timeline_lookup";
  } else if (lower.includes("chance") || lower.includes("odds") || lower.includes("probability") || lower.includes("will i get") || lower.includes("lottery")) {
    intent = "allotment_odds";
  } else if (lower.includes("gain") || lower.includes("return") || lower.includes("performance") || lower.includes("listing price") || lower.includes("listed at")) {
    intent = "performance_lookup";
  } else if (lower.includes("open") || lower.includes("upcoming") || lower.includes("list") || lower.includes("latest") || lower.includes("recent") || lower.includes("active") || lower.includes("today") || lower.includes("sme")) {
    intent = "list_ipos";
  } else if (
    lower.includes("what is") ||
    lower.includes("how does") ||
    lower.includes("meaning") ||
    lower.includes("explain") ||
    lower.includes("asba") ||
    lower.includes("drhp") ||
    lower.includes("rhp")
  ) {
    intent = "educational";
  } else if (
    lower.includes("weather") ||
    lower.includes("cricket") ||
    lower.includes("politics") ||
    lower.includes("movie") ||
    lower.includes("recipe") ||
    lower.includes("football")
  ) {
    intent = "off_topic";
  }

  // 3. Extract Specific Company Names (only if NOT a general query)
  const ipoNames: string[] = [];

  if (!isGeneralMarketQuery(lower)) {
    // Multi-company comparison
    if (lower.includes(" vs ") || lower.includes(" and ") || lower.includes(",")) {
      const parts = lower
        .replace(/^(compare|show|check|gmp of|subscription of)\s+/g, "")
        .split(/(\band\b|\bvs\b|,)/g)
        .map((p) => p.trim())
        .filter((p) => p && p !== "and" && p !== "vs" && p !== ",");

      for (const part of parts) {
        const words = part.split(/\s+/).filter((w) => w.length >= 3 && !GENERIC_WORDS.has(w));
        const clean = words.join(" ").trim();
        if (clean && clean.length >= 3) {
          ipoNames.push(clean);
        }
      }
    }

    // Single company extraction
    if (ipoNames.length === 0) {
      let candidate = lower
        .replace(/^(what is the gmp of|what is gmp of|gmp of|gmp for|subscription of|allotment of|timeline of|tell me about|how is|details of|price of|status of)\s+/gi, "")
        .trim();

      const words = candidate.split(/\s+/).filter((w) => w.length >= 3 && !GENERIC_WORDS.has(w));
      const clean = words.join(" ").trim();
      if (clean && clean.length >= 3) {
        ipoNames.push(clean);
      }
    }
  }

  // If specific company extracted and intent was default educational, elevate to gmp_lookup
  if (ipoNames.length > 0 && intent === "educational" && !lower.includes("what is ipo") && !lower.includes("meaning")) {
    intent = "gmp_lookup";
  }

  // Context carryover (for "its", "this", "that")
  if (ipoNames.length === 0 && (lower.includes("its ") || lower.includes("that ") || lower.includes("this company"))) {
    const lastUserMsg = [...history].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      const prevClassified = classifyIntent(lastUserMsg.content, []);
      if (prevClassified.ipoNames.length > 0) {
        ipoNames.push(...prevClassified.ipoNames);
      }
    }
  }

  return {
    intent,
    ipoNames,
    statusFilter,
    outputFormat: lower.includes("chart") ? "chart" : lower.includes("table") ? "table" : "auto",
    limit: null,
  };
}

