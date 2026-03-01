

"use client";

import { useMemo, useState, useEffect } from "react";

type Ipo = {
  id: number;
  name: string;
  slug: string;
  gmp: number | null;
  sub_total: string | null;
  price_min: number | null;
  price_max: number | null;
  issue_size: string | null;
  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  listing_date: string | null;
  ipo_type: string | null;
};

type Props = {
  ipos: Ipo[];
  gmpMap?: Record<number, number>;
};

function formatDate(d?: string | null) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "-";
  }
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function GmpTable({ ipos, gmpMap = {} }: Props) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("none");

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    let data = [...ipos];

    if (debounced) {
      data = data.filter((ipo) =>
        ipo.name.toLowerCase().includes(debounced.toLowerCase())
      );
    }

    if (type !== "all") {
      data = data.filter((ipo) => ipo.ipo_type === type);
    }

    if (sort === "gmp") {
      data.sort((a, b) => (b.gmp || 0) - (a.gmp || 0));
    }

    if (sort === "sub") {
      data.sort(
        (a, b) =>
          parseFloat(b.sub_total || "0") - parseFloat(a.sub_total || "0")
      );
    }

    return data;
  }, [ipos, debounced, type, sort]);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search IPO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="mainboard">Mainboard</option>
          <option value="sme">SME</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="none">Sort</option>
          <option value="gmp">Highest GMP</option>
          <option value="sub">Most Subscribed</option>
        </select>
      </div>

      {/* Table container */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left">
              <th className="p-3 border-b">IPO</th>
              <th className="p-3 border-b">GMP</th>
              <th className="p-3 border-b">Subscription</th>
              <th className="p-3 border-b">Price</th>
              <th className="p-3 border-b">Size</th>
              <th className="p-3 border-b">Open</th>
              <th className="p-3 border-b">Close</th>
              <th className="p-3 border-b">Allotment</th>
              <th className="p-3 border-b">Listing</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-500">
                  No IPOs found for selected filters
                </td>
              </tr>
            )}

            {filtered.map((ipo) => (
              <tr key={ipo.id} className="hover:bg-gray-50">
                <td className="p-3 border-b font-medium">
                  {highlight(ipo.name, debounced)}
                </td>

                <td className="p-3 border-b font-semibold">
                  ₹{ipo.gmp ?? "-"}
                </td>

                <td className="p-3 border-b">{ipo.sub_total ?? "-"}</td>

                <td className="p-3 border-b">
                  ₹{ipo.price_min ?? "-"} - ₹{ipo.price_max ?? "-"}
                </td>

                <td className="p-3 border-b">{ipo.issue_size ?? "-"}</td>

                <td className="p-3 border-b">{formatDate(ipo.open_date)}</td>

                <td className="p-3 border-b">{formatDate(ipo.close_date)}</td>

                <td className="p-3 border-b">
                  {formatDate(ipo.allotment_date)}
                </td>

                <td className="p-3 border-b">
                  {formatDate(ipo.listing_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}