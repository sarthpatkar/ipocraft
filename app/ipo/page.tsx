import { ipos } from "@/data/ipos";
import Link from "next/link";

export default function IPOPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming IPOs</h1>

      <div className="grid gap-4">
        {ipos.map((ipo) => (
          <Link
            key={ipo.slug}
            href={`/ipo/${ipo.slug}`}
            className="bg-slate-900 p-6 rounded-xl border border-slate-800 block"
          >
            <h2 className="text-xl font-semibold">{ipo.name}</h2>
            <p className="text-gray-400">Price: {ipo.price}</p>
            <p className="text-gray-400">GMP: {ipo.gmp}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}