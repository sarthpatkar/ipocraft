export function getIPOStatus(ipo: any) {
  const today = new Date();

  const open = ipo.open_date ? new Date(ipo.open_date) : null;
  const close = ipo.close_date ? new Date(ipo.close_date) : null;
  const listing = ipo.listing_date ? new Date(ipo.listing_date) : null;
  const allotment = ipo.allotment_date ? new Date(ipo.allotment_date) : null;

  // MAIN STATUS
  let status = "Closed";

  if (listing && today >= listing) {
    status = "Listed";
  } else if (open && close && today >= open && today <= close) {
    status = "Open";
  } else if (open && today < open) {
    status = "Upcoming";
  } else if (close && today > close) {
    status = "Closed";
  }

  // ALLOTMENT STATUS
  let allotmentStatus = null;

  if (allotment) {
    allotmentStatus =
      today >= allotment ? "Allotment Out" : "Allotment Awaited";
  }

  return { status, allotmentStatus };
}