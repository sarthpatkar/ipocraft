export type AllotmentBadge =
  | "Allotment Out"
  | "Allotment Awaited"
  | null;

export function getAllotmentBadge(ipo: any): AllotmentBadge {
  const today = new Date();

  const listingDateObj = ipo?.listing_date
    ? new Date(ipo.listing_date)
    : null;

  const allotmentDateObj = ipo?.allotment_date
    ? new Date(ipo.allotment_date)
    : null;

  // Listed detection (status OR date)
  const isListed =
    ipo?.status?.toLowerCase() === "listed" ||
    (listingDateObj && listingDateObj <= today);

  const isAllotmentDayReached =
    allotmentDateObj && allotmentDateObj <= today;

  // Admin override detection
  const rawAllotment = ipo?.allotment_out;
  const statusField = ipo?.allotment_status;

  const adminMarkedOut =
    rawAllotment === true ||
    rawAllotment === "true" ||
    rawAllotment === 1 ||
    rawAllotment === "1" ||
    statusField === "out";

  /**
   * PRIORITY ORDER
   * 1. Admin marked OUT → always OUT
   * 2. Listed → OUT
   * 3. Allotment date reached → Awaited
   * 4. Else → null
   */

  if (adminMarkedOut) return "Allotment Out";

  if (isListed) return "Allotment Out";

  if (isAllotmentDayReached) return "Allotment Awaited";

  return null;
}