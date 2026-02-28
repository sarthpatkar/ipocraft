"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type IPO = {
  id: number;
  name: string;
  slug: string;
  exchange: string;
  sector: string;
  price_min: number;
  price_max: number;
  gmp: number;
  lot_size: number;
  status: string;
};

export default function IPOPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchIPOs();
  }, []);

  const fetchIPOs = async () => {
    const { data, error } = await supabase
      .from("ipos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setIpos(data || []);
    }

    setLoading(false);
  };

  if (loading) return <div className="p-10">Loading IPOs...</div>;

  const filteredIpos =
    filter === "All"
      ? ipos
      : ipos.filter((ipo) => ipo.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">
        Latest IPO Listings
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Upcoming", "Open", "Listed", "Closed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 text-sm rounded border transition ${
              filter === tab
                ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#94a3b8]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIpos.map((ipo) => (
          <Link href={`/ipo/${ipo.slug}`} key={ipo.id}>
            <div
              className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold mb-2">
                {ipo.name}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {ipo.exchange} • {ipo.sector}
              </p>

              <p className="text-sm">
                Price Band: ₹{ipo.price_min} – ₹{ipo.price_max}
              </p>

              <p className="text-sm">
                GMP: ₹{ipo.gmp}
              </p>

              <p className="text-sm">
                Lot Size: {ipo.lot_size}
              </p>

              <span className="inline-block mt-3 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {ipo.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}