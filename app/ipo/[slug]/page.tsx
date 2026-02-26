import { ipos } from "@/data/ipos";

export default function IPODetails({ params }: any) {
  const ipo = ipos.find((i) => i.slug === params.slug);

  if (!ipo) return <div className="p-6 text-white">IPO not found</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">{ipo.name}</h1>

      <div className="bg-slate-900 p-6 rounded-xl space-y-2">
        <p>Price Band: {ipo.price}</p>
        <p>Lot Size: {ipo.lot}</p>
        <p>GMP: {ipo.gmp}</p>
        <p>Open Date: {ipo.open}</p>
        <p>Close Date: {ipo.close}</p>
        <p>Listing Date: {ipo.listing}</p>
      </div>

      <p className="mt-6 text-gray-400">{ipo.description}</p>
    </main>
  );
}