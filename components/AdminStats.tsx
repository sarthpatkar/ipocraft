"use client";

export default function AdminStats({ ipos, brokers }: any) {
  const totalIpos = ipos.length;
  const activeIpos = ipos.filter((i: any) => i.status === "Open").length;
  const listedIpos = ipos.filter((i: any) => i.status === "Listed").length;
  const avgGmp =
    ipos.reduce((sum: number, i: any) => sum + (i.gmp || 0), 0) /
      (ipos.length || 1) || 0;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card title="Total IPOs" value={totalIpos} />
      <Card title="Active IPOs" value={activeIpos} />
      <Card title="Listed IPOs" value={listedIpos} />
      <Card title="Total Brokers" value={brokers.length} />
      <Card title="Avg GMP" value={`₹${avgGmp.toFixed(0)}`} />
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}