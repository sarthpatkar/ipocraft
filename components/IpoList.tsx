import Link from "next/link";
import IpoCard, { IPOListItem } from "@/components/IpoCard";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

// Auto-calculate IPO status based on dates
function calculateStatus(ipo: {
  open_date?: string | null;
  close_date?: string | null;
  listing_date?: string | null;
  status?: string | null;
}) {
  const today = new Date();

  const open = ipo.open_date ? new Date(ipo.open_date) : null;
  const close = ipo.close_date ? new Date(ipo.close_date) : null;
  const listing = ipo.listing_date ? new Date(ipo.listing_date) : null;

  if (listing && listing <= today) return "Listed";
  if (open && today < open) return "Upcoming";
  if (open && close && today >= open && today <= close) return "Open";
  if (close && today > close) return "Closed";

  return ipo.status ?? "Upcoming";
}

type Props = {
  limit?: number;
  status?: string;
  search?: string;
  type?: string; // mainboard | sme
};

type RawIpoRow = {
  id?: unknown;
  slug?: unknown;
  name?: unknown;
  exchange?: unknown;
  sector?: unknown;
  status?: unknown;
  price_min?: unknown;
  price_max?: unknown;
  gmp?: unknown;
  lot_size?: unknown;
  open_date?: unknown;
  close_date?: unknown;
  listing_date?: unknown;
  allotment_date?: unknown;
  allotment_link?: unknown;
  allotment_out?: unknown;
  allotment_status?: unknown;
  sub_total?: unknown;
  ipo_type?: unknown;
};

function normalizeIpoRows(rows: RawIpoRow[] | null): IPOListItem[] {
  const result: IPOListItem[] = [];

  for (const row of rows ?? []) {
    if (!row || !row.id || !row.slug || !row.name) continue;

    result.push({
      id: Number(row.id),
      slug: String(row.slug),
      name: String(row.name),
      exchange: row.exchange ? String(row.exchange) : null,
      sector: row.sector ? String(row.sector) : null,
      status: row.status ? String(row.status) : null,
      price_min:
        row.price_min != null && !Number.isNaN(Number(row.price_min))
          ? Number(row.price_min)
          : null,
      price_max:
        row.price_max != null && !Number.isNaN(Number(row.price_max))
          ? Number(row.price_max)
          : null,
      gmp:
        row.gmp != null && !Number.isNaN(Number(row.gmp))
          ? Number(row.gmp)
          : null,
      lot_size:
        row.lot_size != null && !Number.isNaN(Number(row.lot_size))
          ? Number(row.lot_size)
          : null,
      open_date: row.open_date ? String(row.open_date) : null,
      close_date: row.close_date ? String(row.close_date) : null,
      listing_date: row.listing_date ? String(row.listing_date) : null,
      allotment_date: row.allotment_date ? String(row.allotment_date) : null,
      allotment_link: row.allotment_link ? String(row.allotment_link) : null,
      allotment_out:
        typeof row.allotment_out === "boolean"
          ? row.allotment_out
          : row.allotment_out === "true"
          ? true
          : false,
      allotment_status: row.allotment_status ? String(row.allotment_status) : null,
      sub_total:
        row.sub_total == null
          ? null
          : typeof row.sub_total === "number"
          ? row.sub_total
          : String(row.sub_total),
    });
  }

  return result;
}

export default async function IpoList({ limit, status, search, type }: Props) {
  const supabase = await createSupabaseServerClient();

  let baseQuery = supabase
    .from("ipos")
    .select(
      "id, slug, name, exchange, sector, status, price_min, price_max, gmp, lot_size, open_date, close_date, listing_date, allotment_date, allotment_link, allotment_out, allotment_status, sub_total, ipo_type"
    )
    .order("created_at", { ascending: false });

  const searchTerm = search?.trim();
  if (searchTerm) {
    const safeSearch = searchTerm.replace(/,/g, " ");
    baseQuery = baseQuery.or(`name.ilike.%${safeSearch}%,slug.ilike.%${safeSearch}%`);
  }

  const { data, error } = limit
    ? await baseQuery.limit(limit)
    : await baseQuery;

  if (error) {
    console.error("Failed to fetch IPO list:", error);
    return (
      <div className="border border-rose-200 bg-rose-50 rounded-lg px-5 py-4">
        <p className="text-[13px] text-rose-700">
          Unable to load IPO listings right now.
        </p>
      </div>
    );
  }

  // Optional filter by IPO type (mainboard / sme) on raw rows
  let rows: RawIpoRow[] | null = data as RawIpoRow[] | null;
  if (type && type !== "All") {
    const t = type.toLowerCase();
    rows = (rows ?? []).filter((r) => {
      const rowType = r?.ipo_type ? String(r.ipo_type).toLowerCase() : "";
      return rowType === t;
    });
  }

  const ipos = normalizeIpoRows(rows);

  // Compute auto status for every IPO first
  const iposWithStatus = ipos.map((ipo) => ({
    ...ipo,
    status: calculateStatus({
      open_date: ipo.open_date,
      close_date: ipo.close_date,
      listing_date: (ipo as any).listing_date ?? null,
      status: ipo.status,
    }),
  }));

  // Apply filtering on computed status
  let filteredIpos = iposWithStatus;

  if (status && status !== "All") {
    filteredIpos = iposWithStatus.filter((ipo) => {
      return ipo.status?.toLowerCase() === status.toLowerCase();
    });
  }

  if (filteredIpos.length === 0) {
    return (
      <div className="border border-[#e2e8f0] bg-white rounded-lg px-5 py-6 text-center">
        <p className="text-[13px] text-[#64748b]">No IPO listings available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {filteredIpos.map((ipo) => (
        <Link key={ipo.id} href={`/ipo/${ipo.slug}`} className="block h-full">
          <IpoCard ipo={ipo} />
        </Link>
      ))}
    </div>
  );
}
