import { ipos } from "@/data/ipos";

export default function GMPPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">IPO GMP Today</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-slate-900 rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-3 text-left">IPO</th>
              <th className="p-3 text-left">Price Band</th>
              <th className="p-3 text-left">GMP</th>
              <th className="p-3 text-left">Open Date</th>
            </tr>
          </thead>

          <tbody>
            {ipos.map((ipo) => (
              <tr key={ipo.slug} className="border-b border-slate-800">
                <td className="p-3">{ipo.name}</td>
                <td className="p-3">{ipo.price}</td>
                <td className="p-3 text-green-400 font-semibold">
                  {ipo.gmp}
                </td>
                <td className="p-3">{ipo.open}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}