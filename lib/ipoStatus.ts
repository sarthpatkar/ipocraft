/**
 * Single source of truth for IPO lifecycle status calculation.
 * Used across: IpoCard, GmpTableClient, SubscriptionTableClient, ipo-calendar page.
 */

export type IpoStatus = "Open" | "Upcoming" | "Closed" | "Listed";

/**
 * Returns IST date string (YYYY-MM-DD) for a given UTC date.
 * @param date - Date object (defaults to now)
 */
export function getISTDateString(date = new Date()): string {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

/**
 * Calculate IPO lifecycle status based on dates and listing info.
 * Priority: Listed > Open > Closed > Upcoming
 */
export function getIpoLifecycleStatus(
  openDate: string | null | undefined,
  closeDate: string | null | undefined,
  listingDate?: string | null | undefined,
): IpoStatus {
  const todayIST = getISTDateString();

  // Check if listed (after 4 PM IST = 10:30 UTC on listing day)
  if (listingDate) {
    const cutoffUTC = new Date(`${listingDate}T10:30:00Z`);
    if (!isNaN(cutoffUTC.getTime()) && Date.now() >= cutoffUTC.getTime()) {
      return "Listed";
    }
  }

  if (!openDate || !closeDate) return "Upcoming";

  if (todayIST < openDate) return "Upcoming";
  if (todayIST >= openDate && todayIST <= closeDate) return "Open";
  if (todayIST > closeDate) return "Closed";

  return "Upcoming";
}

/**
 * CSS classes for each IPO status badge.
 */
export const STATUS_BADGE_CLASSES: Record<IpoStatus, string> = {
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 status-open",
  Upcoming: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#171B20] dark:text-[#9AA1AA] dark:border-[#252A31]",
  Listed: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#171B20] dark:text-[#9AA1AA] dark:border-[#252A31]",
  Closed: "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
};

