import type { IPOListItem } from "@/components/IpoCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 100;

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

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
  created_at?: unknown;
};

export type IpoCursor = {
  open_date: string | null;
  created_at: string | null;
  slug: string | null;
};

type IpoFeedParams = {
  supabase: SupabaseServerClient;
  limit?: number;
  status?: string;
  type?: string;
  q?: string;
  snapshot?: string | null;
  cursor?: IpoCursor | null;
};

export type IpoFeedResult = {
  items: IPOListItem[];
  hasMore: boolean;
  nextCursor: IpoCursor | null;
  snapshot: string;
};

type IpoFeedEntry = {
  item: IPOListItem;
  cursor: IpoCursor;
};

function normalizeLimit(value?: number) {
  if (!value || Number.isNaN(value)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.floor(value), 1), MAX_LIMIT);
}

function normalizeStatus(value?: string) {
  const status = value?.trim();
  if (!status) return null;
  if (status.toLowerCase() === "all") return null;
  return status;
}

function normalizeType(value?: string) {
  const type = value?.trim();
  if (!type) return null;
  if (type.toLowerCase() === "all") return null;
  return type.toLowerCase();
}

function normalizeSearch(value?: string) {
  const search = value?.trim();
  return search ? search : null;
}

function toNumberOrNull(value: unknown) {
  if (value == null) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

function toStringOrNull(value: unknown) {
  if (value == null) return null;
  return String(value);
}

function toBooleanOrFalse(value: unknown) {
  if (typeof value === "boolean") return value;
  return value === "true";
}

function normalizeIpoEntry(row: RawIpoRow): IpoFeedEntry | null {
  if (!row.id || !row.slug || !row.name) return null;

  const slug = String(row.slug);

  return {
    item: {
      id: Number(row.id),
      slug,
      name: String(row.name),
      exchange: toStringOrNull(row.exchange),
      sector: toStringOrNull(row.sector),
      status: toStringOrNull(row.status),
      price_min: toNumberOrNull(row.price_min),
      price_max: toNumberOrNull(row.price_max),
      gmp: toNumberOrNull(row.gmp),
      lot_size: toNumberOrNull(row.lot_size),
      open_date: toStringOrNull(row.open_date),
      close_date: toStringOrNull(row.close_date),
      listing_date: toStringOrNull(row.listing_date),
      allotment_date: toStringOrNull(row.allotment_date),
      allotment_link: toStringOrNull(row.allotment_link),
      allotment_out: toBooleanOrFalse(row.allotment_out),
      allotment_status: toStringOrNull(row.allotment_status),
      sub_total:
        row.sub_total == null
          ? null
          : typeof row.sub_total === "number"
          ? row.sub_total
          : String(row.sub_total),
      ipo_type: toStringOrNull(row.ipo_type),
    },
    cursor: {
      open_date: toStringOrNull(row.open_date),
      created_at: toStringOrNull(row.created_at),
      slug,
    },
  };
}

export async function getIpoFeedPage({
  supabase,
  limit,
  status,
  type,
  q,
  snapshot,
  cursor,
}: IpoFeedParams): Promise<IpoFeedResult> {
  const pageLimit = normalizeLimit(limit);
  const effectiveSnapshot = snapshot && snapshot.trim()
    ? snapshot
    : new Date().toISOString();

  const { data, error } = await supabase.rpc("get_ipos_page", {
    p_limit: pageLimit + 1,
    p_status: normalizeStatus(status),
    p_type: normalizeType(type),
    p_q: normalizeSearch(q),
    p_snapshot: effectiveSnapshot,
    p_cursor_open_date: cursor?.open_date ?? null,
    p_cursor_created_at: cursor?.created_at ?? null,
    p_cursor_slug: cursor?.slug ?? null,
  });

  if (error) {
    throw new Error(error.message || "Unable to load IPO feed");
  }

  const rows = Array.isArray(data) ? (data as RawIpoRow[]) : [];
  const entries = rows
    .map(normalizeIpoEntry)
    .filter((entry): entry is IpoFeedEntry => entry !== null);

  const hasMore = entries.length > pageLimit;
  const visibleEntries = entries.slice(0, pageLimit);
  const nextCursor = hasMore ? (visibleEntries.at(-1)?.cursor ?? null) : null;

  return {
    items: visibleEntries.map((entry) => entry.item),
    hasMore,
    nextCursor,
    snapshot: effectiveSnapshot,
  };
}
