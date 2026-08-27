import { createSupabaseServerClient } from "@/lib/supabaseServer";

type BrokerCtaItem = {
  id: string;
  name: string;
  cta_url: string;
};

type RawBrokerRow = {
  id?: unknown;
  name?: unknown;
  cta_url?: unknown;
};

function normalizeBrokerRows(rows: RawBrokerRow[] | null): BrokerCtaItem[] {
  return (rows ?? [])
    .map((row) => {
      if (!row || !row.id || !row.name || !row.cta_url) return null;
      return {
        id: String(row.id),
        name: String(row.name),
        cta_url: String(row.cta_url),
      };
    })
    .filter((broker): broker is BrokerCtaItem => broker !== null);
}

/**
 * Compact broker affiliate CTA strip for the IPO detail page.
 * Reuses the same `brokers` table BrokerList/BrokerCard read from (see
 * components/BrokerList.tsx) so broker data + affiliate links stay
 * admin-managed in one place. Renders nothing if there's no data or the
 * query fails — this is a promo section, not core page content.
 */
export default async function BrokerAffiliateCta() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("brokers")
    .select("id, name, cta_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Failed to fetch brokers for affiliate CTA:", error);
    return null;
  }

  const brokers = normalizeBrokerRows(data as RawBrokerRow[] | null);
  if (brokers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-blue-50/60 dark:bg-[#151E2E] border border-[#1C317A]/20 dark:border-[#3D5BA9]/30">
      <div className="mb-3">
        <p className="text-[13px] font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
          Open a Demat Account to Apply
        </p>
        <p className="text-[12px] text-[#475569] dark:text-[#9AA1AA] mt-0.5">
          Compare brokers and open an account to apply for this IPO. Some links below are affiliate/referral links.
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {brokers.map((broker) => (
          <a
            key={broker.id}
            href={broker.cta_url}
            target="_blank"
            rel="noreferrer noopener sponsored"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#111418] border border-[#1C317A]/20 dark:border-[#3D5BA9]/30 hover:border-[#1C317A]/50 dark:hover:border-[#3D5BA9]/60 rounded-md text-[12.5px] font-semibold text-[#0f172a] dark:text-[#F1F5F9] transition-colors shadow-xs"
          >
            Open {broker.name} Account
          </a>
        ))}
      </div>
    </div>
  );
}
