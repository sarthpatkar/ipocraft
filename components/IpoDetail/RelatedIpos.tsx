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
    <section className="bg-white dark:bg-[#111B2D] border border-[#e2e8f0] dark:border-[#22304A] rounded-xl p-5 sm:p-6 mb-6">
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5 text-[#2563eb] dark:text-[#3B82F6]">
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
              className="group border border-[#e2e8f0] dark:border-[#22304A] bg-[#f8fafc] dark:bg-[#162238] rounded-xl p-3 hover:border-[#3B82F6]/50 transition-colors"
            >
              <p className="text-[13px] font-semibold truncate text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors">
                {ipo.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {ipo.status && (
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_COLORS[ipo.status] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
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

