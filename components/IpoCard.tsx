type IPO = {
  name: string;
  exchange: string;
  sector: string;
  status: string;
  price_min: number;
  price_max: number;
  gmp: number;
  lot_size: number;
};

export default function IpoCard({ ipo }: { ipo: IPO }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="font-semibold text-lg">
        {ipo.name}
      </h2>

      <p className="text-sm text-gray-500">
        {ipo.exchange} • {ipo.sector}
      </p>

      <div className="mt-2 text-sm">
        Price: ₹{ipo.price_min} – ₹{ipo.price_max}
      </div>

      <div className="text-sm">
        GMP: ₹{ipo.gmp ?? "-"}
      </div>

      <div className="text-sm">
        Lot Size: {ipo.lot_size}
      </div>

      <div className="text-sm">
        Status: {ipo.status}
      </div>
    </div>
  );
}