import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "IPO Details";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { data: ipo } = await supabase
    .from("ipos")
    .select("name, gmp, price_max, price_min, status, ipo_type")
    .eq("slug", params.slug)
    .maybeSingle();

  const name = ipo?.name ?? "IPO Details";
  const gmp = ipo?.gmp != null ? Number(ipo.gmp) : null;
  const priceMax = ipo?.price_max != null ? Number(ipo.price_max) : null;
  const priceMin = ipo?.price_min != null ? Number(ipo.price_min) : null;
  const status = ipo?.status ?? "";
  const ipoType = ipo?.ipo_type ?? "";

  const gmpColor = gmp != null ? (gmp >= 0 ? "#34d399" : "#f87171") : "#94a3b8";
  const gmpText = gmp != null ? `GMP ₹${gmp}` : "GMP N/A";
  const priceBand = priceMax
    ? priceMin && priceMin !== priceMax
      ? `₹${priceMin} – ₹${priceMax}`
      : `₹${priceMax}`
    : "Price TBA";

  const estimatedGain =
    gmp != null && priceMax != null && priceMax > 0
      ? ((gmp / priceMax) * 100).toFixed(1)
      : null;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0f1a 0%, #1e3a8a 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: 18, color: "#93c5fd", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            IPOCraft
          </div>
          {ipoType && (
            <div style={{ fontSize: 12, color: "#7c3aed", backgroundColor: "#ede9fe", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
              {ipoType.toUpperCase()}
            </div>
          )}
          {status && (
            <div style={{
              fontSize: 12,
              color: status === "Open" ? "#065f46" : "#1e40af",
              backgroundColor: status === "Open" ? "#d1fae5" : "#dbeafe",
              borderRadius: 6,
              padding: "2px 8px",
              fontWeight: 700,
            }}>
              {status}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.15, maxWidth: 800 }}>
            {name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Grey Market Premium</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: gmpColor }}>
                {gmpText}
                {estimatedGain && (
                  <span style={{ fontSize: 22, marginLeft: 12, opacity: 0.85 }}>({estimatedGain}%)</span>
                )}
              </div>
            </div>
            <div style={{ width: 2, height: 60, backgroundColor: "#1e293b" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Price Band</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#f1f5f9" }}>{priceBand}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, color: "#475569" }}>www.ipocraft.com</div>
          <div style={{ fontSize: 14, color: "#334155" }}>Not investment advice · Educational use only</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
