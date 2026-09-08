import Link from "next/link";
import IpoCard, { IPOListItem } from "@/components/IpoCard";

type Props = {
  items: IPOListItem[];
  emptyMessage?: string;
};

export default function IpoList({
  items,
  emptyMessage = "No IPO listings available yet.",
}: Props) {
  if (items.length === 0) {
    return (
      <div className="border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#111827] rounded-lg px-5 py-6 text-center">
        <p className="text-[13px] text-[#64748b] dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger-children">
      {items.map((ipo) => (
        // prefetch={false}: this grid can render many cards at once, and each
        // IPO detail page is a full static route (chart libs included) that
        // would otherwise be prefetched in full for every card in the
        // viewport. Click-time fetch is fast enough; hover still warms the
        // cache via the browser's own connection reuse.
        <Link key={ipo.id} href={`/ipo/${ipo.slug}`} className="block h-full" prefetch={false}>
          <IpoCard ipo={ipo} />
        </Link>
      ))}
    </div>
  );
}
