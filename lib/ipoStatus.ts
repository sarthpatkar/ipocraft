export type IPOStatusResult = {
  status: "Upcoming" | "Open" | "Closed" | "Listed";
  allotmentStatus: "Allotment Out" | "Allotment Awaited" | null;
};

/**
 * Central IPO + Allotment status logic
 *
 * PRIORITY ORDER (Allotment)
 * 1. Admin marked OUT → always show OUT
 * 2. If Listed → OUT
 * 3. If allotment date reached → Awaited
 * 4. Else → null
 */
export function getIPOStatus(ipo: any): IPOStatusResult {
  const today = new Date();

  const open = ipo?.open_date ? new Date(ipo.open_date) : null;
  const close = ipo?.close_date ? new Date(ipo.close_date) : null;
  const listing = ipo?.listing_date ? new Date(ipo.listing_date) : null;
  const allotment = ipo?.allotment_date ? new Date(ipo.allotment_date) : null;

  /**
   * MAIN STATUS
   */
  let status: IPOStatusResult["status"] = "Closed";

  if (listing && today >= listing) {
    status = "Listed";
  } else if (open && close && today >= open && today <= close) {
    status = "Open";
  } else if (open && today < open) {
    status = "Upcoming";
  } else if (close && today > close) {
    status = "Closed";
  }

  /**
   * ADMIN OVERRIDE DETECTION
   */
  const rawAllotment = ipo?.allotment_out;
  const statusField = ipo?.allotment_status;

  const adminMarkedOut =
    rawAllotment === true ||
    rawAllotment === "true" ||
    rawAllotment === 1 ||
    rawAllotment === "1" ||
    statusField === "out";

  /**
   * ALLOTMENT STATUS (Priority System)
   */
  let allotmentStatus: IPOStatusResult["allotmentStatus"] = null;

  if (adminMarkedOut) {
    allotmentStatus = "Allotment Out";
  } else if (status === "Listed") {
    allotmentStatus = "Allotment Out";
  } else if (allotment && today >= allotment) {
    allotmentStatus = "Allotment Awaited";
  } else {
    allotmentStatus = null;
  }

  return { status, allotmentStatus };
}