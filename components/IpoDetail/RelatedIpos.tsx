import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function RelatedIpos({
  sector,
  currentSlug,
}: {
  sector: string | null | undefined;
  currentSlug: string;
}) {
  const supabase = await createSupabaseServerClient();

  // Try same sector first, fallback to recent listed
  let query = supabase
    .from("ipos")
    .select("id, slug, name, gmp, price_max, status, ipo_type, open_date")
    .neq("slug", currentSlug)
    .limit(4);

  if (sector) {
    query = query.eq("sector", sector);
  } else {
    query = query.eq("status", "Listed").order("listing_date", { ascending: false });
  }

  const { data: ipos } = await query;

  if (!ipos || ipos.length === 0) return null;

  const STATUS_COLORS: Record<string, string> = {
    Open: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Upcoming: "text-blue-700 bg-blue-50 border-blue-200",
    Listed: "text-violet-700 bg-violet-50 border-violet-200",
    Closed: "text-rose-600 bg-rose-50 border-rose-200",
  };

  return (
    <section className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-[#252A31] rounded-lg p-5 sm:p-6 mb-6">
      <p className="text-[11px] font-semibold tracking-wider uppercase mb-1.5 text-blue-600 dark:text-blue-400">
        {sector ? `More in ${sector}` : "Recent Listings"}
      </p>
      <h2 className="text-[1.25rem] font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
        Related IPOs
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ipos.map((ipo: any) => {
          const gmpNum = ipo.gmp != null ? Number(ipo.gmp) : null;
          const gmpColor = gmpNum != null ? (gmpNum >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400") : "text-gray-400";
          return (
            <Link
              key={ipo.id}
              href={`/ipo/${ipo.slug}`}
              className="group border border-gray-200 dark:border-[#252A31] bg-gray-50/50 dark:bg-[#171B20] rounded-md p-3 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <p className="text-[13px] font-semibold truncate text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ipo.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {ipo.status && (
                  <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-md border ${STATUS_COLORS[ipo.status] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
                    {ipo.status}
                  </span>
                )}
              </div>
              {gmpNum != null && (
                <p className={`text-[12px] font-semibold mt-1.5 tabular-nums ${gmpColor}`}>
                  GMP ₹{gmpNum}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

