/**
 * Centralized formatting utilities for dates, timestamps, currencies, and numbers.
 * Ensures consistent financial presentation across IPOCraft without raw ISO strings.
 */

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Parses any date input safely (ISO string, YYYY-MM-DD, Date object, timestamp).
 */
export function parseDateSafely(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "—" || trimmed === "-") return null;

    // Handle YYYY-MM-DD format explicitly to avoid timezone shift issues
    const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const monthIndex = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      return new Date(Date.UTC(year, monthIndex, day));
    }

    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

/**
 * Standard date display format: "22 Aug 2026"
 */
export function formatDisplayDate(
  value: unknown,
  fallback = "—"
): string {
  const d = parseDateSafely(value);
  if (!d) return fallback;

  const day = d.getUTCDate();
  const month = MONTH_NAMES_SHORT[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Compact date format: "22 Aug"
 */
export function formatShortDate(
  value: unknown,
  fallback = "—"
): string {
  const d = parseDateSafely(value);
  if (!d) return fallback;

  const day = d.getUTCDate();
  const month = MONTH_NAMES_SHORT[d.getUTCMonth()];

  return `${day} ${month}`;
}

/**
 * Standard date-time format: "22 Aug 2026, 05:43 PM IST"
 */
export function formatDateTime(
  value: unknown,
  fallback = "—"
): string {
  const d = parseDateSafely(value);
  if (!d) return fallback;

  // Convert to IST (UTC+5:30)
  const istTime = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  const day = istTime.getUTCDate();
  const month = MONTH_NAMES_SHORT[istTime.getUTCMonth()];
  const year = istTime.getUTCFullYear();

  let hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const hourStr = String(hours).padStart(2, "0");

  return `${day} ${month} ${year}, ${hourStr}:${minutes} ${ampm} IST`;
}

/**
 * Human relative time with clean standardized wording.
 * e.g. "Just now", "5 mins ago", "2 hrs ago", "3 days ago"
 */
export function formatTimeAgo(
  value: unknown,
  prefix = ""
): string {
  const d = parseDateSafely(value);
  if (!d) return `${prefix}recently`.trim();

  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return `${prefix}just now`.trim();

  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return `${prefix}just now`.trim();
  if (diffMins === 1) return `${prefix}1 min ago`.trim();
  if (diffMins < 60) return `${prefix}${diffMins} mins ago`.trim();

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs === 1) return `${prefix}1 hr ago`.trim();
  if (diffHrs < 24) return `${prefix}${diffHrs} hrs ago`.trim();

  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return `${prefix}1 day ago`.trim();
  if (diffDays < 30) return `${prefix}${diffDays} days ago`.trim();

  return `${prefix}${formatDisplayDate(d)}`.trim();
}

/**
 * Clean day string for subscription table day header.
 * Avoids dumping raw ISO timestamps into the Day column.
 */
export function formatSubscriptionDayHeader(value: unknown, index?: number): string {
  if (value == null || value === "") {
    return index != null ? `Day ${index + 1}` : "Latest";
  }

  const str = String(value).trim();
  if (/^day\s*\d+/i.test(str)) {
    return str;
  }
  if (/^\d+$/.test(str)) {
    return `Day ${str}`;
  }

  // If it's an ISO timestamp or date string, do not print the raw timestamp
  if (str.includes("T") || str.includes("-") || str.includes(":")) {
    const d = parseDateSafely(str);
    if (d) {
      return formatShortDate(d);
    }
    return "Latest";
  }

  return str;
}

/**
 * Format subscription value without colored pill backgrounds.
 * e.g. 145.38 -> "145.38x"
 */
export function formatSubscriptionTimes(value: unknown, fallback = "—"): string {
  if (value == null || value === "" || value === "—" || value === "-") return fallback;
  const n = Number(value);
  if (isNaN(n) || n === 0) return fallback;
  return `${n.toFixed(2)}x`;
}
