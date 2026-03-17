type IpoWithOpenDate = {
  open_date?: string | null;
};

function getOpenDateTimestamp(openDate?: string | null) {
  if (!openDate) return null;

  const timestamp = Date.parse(openDate);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function compareByNewestOpenDate<T extends IpoWithOpenDate>(a: T, b: T) {
  const aTimestamp = getOpenDateTimestamp(a.open_date);
  const bTimestamp = getOpenDateTimestamp(b.open_date);

  if (aTimestamp == null && bTimestamp == null) return 0;
  if (aTimestamp == null) return 1;
  if (bTimestamp == null) return -1;

  return bTimestamp - aTimestamp;
}

export function sortIposByNewestOpenDate<T extends IpoWithOpenDate>(rows: T[]) {
  return [...rows].sort(compareByNewestOpenDate);
}
