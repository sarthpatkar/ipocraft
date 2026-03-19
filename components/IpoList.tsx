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
      <div className="border border-[#e2e8f0] bg-white rounded-lg px-5 py-6 text-center">
        <p className="text-[13px] text-[#64748b]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((ipo) => (
        <Link key={ipo.id} href={`/ipo/${ipo.slug}`} className="block h-full">
          <IpoCard ipo={ipo} />
        </Link>
      ))}
    </div>
  );
}
