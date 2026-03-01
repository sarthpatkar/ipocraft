import BrokerCard, { BrokerListItem } from "@/components/BrokerCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type Props = {
  limit?: number;
};

type RawBrokerRow = {
  id?: unknown;
  name?: unknown;
  slug?: unknown;
  logo_url?: unknown;
  account_opening?: unknown;
  account_maintenance?: unknown;
  equity_delivery?: unknown;
  equity_intraday?: unknown;
  futures?: unknown;
  options?: unknown;
  cta_url?: unknown;
  notes?: unknown;
};

function normalizeBrokerRows(rows: RawBrokerRow[] | null): BrokerListItem[] {
  return (rows ?? [])
    .map((row) => {
      if (!row || !row.id || !row.name || !row.slug) return null;
      return {
        id: String(row.id),
        name: String(row.name),
        slug: String(row.slug),
        logo_url: row.logo_url ? String(row.logo_url) : null,
        account_opening: row.account_opening ? String(row.account_opening) : null,
        account_maintenance: row.account_maintenance
          ? String(row.account_maintenance)
          : null,
        equity_delivery: row.equity_delivery ? String(row.equity_delivery) : null,
        equity_intraday: row.equity_intraday ? String(row.equity_intraday) : null,
        futures: row.futures ? String(row.futures) : null,
        options: row.options ? String(row.options) : null,
        cta_url: row.cta_url ? String(row.cta_url) : null,
        notes: row.notes ? String(row.notes) : null,
      };
    })
    .filter((broker): broker is BrokerListItem => broker !== null);
}

export default async function BrokerList({ limit }: Props) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("brokers")
    .select(
      "id, name, slug, logo_url, account_opening, account_maintenance, equity_delivery, equity_intraday, futures, options, cta_url, notes, sort_order, is_active"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch brokers:", error);
    return (
      <div className="border border-rose-200 bg-rose-50 rounded-lg px-5 py-4">
        <p className="text-[13px] text-rose-700">
          Unable to load broker information right now.
        </p>
      </div>
    );
  }

  const brokers = normalizeBrokerRows(data as RawBrokerRow[] | null);

  if (brokers.length === 0) {
    return (
      <div className="border border-[#e2e8f0] bg-white rounded-lg px-5 py-6 text-center">
        <p className="text-[13px] text-[#64748b]">
          No broker data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      {brokers.map((broker) => (
        <BrokerCard key={broker.id} broker={broker} />
      ))}
    </div>
  );
}
