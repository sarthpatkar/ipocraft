import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function fmtGmpPct(gmp: number | null, price: number | null): string {
  if (gmp == null || price == null || price === 0) return "";
  const pct = ((gmp / price) * 100).toFixed(1);
  return `(${Number(pct) >= 0 ? "+" : ""}${pct}%)`;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function statusColor(status: string | null): string {
  if (!status) return "#6B7280";
  const s = status.toLowerCase();
  if (s === "open") return "#059669";
  if (s === "upcoming") return "#D97706";
  if (s === "listed") return "#2563EB";
  return "#DC2626";
}

const BRAND = "#1C317A";
const BG_DARK = "#0D1117";
const BG_CARD = "#161B22";
const TEXT_PRIMARY = "#F0F6FC";
const TEXT_MUTED = "#8B949E";
const ACCENT = "#58A6FF";
const W = 1200;
const H = 630;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const template = searchParams.get("template") ?? "gmp";

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const db = getSupabase();
  const { data: ipo } = await db
    .from("ipos")
    .select(
      "name, gmp, price_max, price_min, sub_total, sub_rii, open_date, close_date, allotment_date, listing_date, status, ipo_type"
    )
    .eq("slug", slug)
    .single();

  if (!ipo) {
    return new Response("IPO not found", { status: 404 });
  }

  const issuePrice = (ipo.price_max ?? ipo.price_min) as number | null;
  const gmpVal = ipo.gmp as number | null;
  const gmpPct = fmtGmpPct(gmpVal, issuePrice);
  const ipoName = (ipo.name as string) ?? slug;
  const status = (ipo.status as string) ?? "—";
  const sColor = statusColor(status);

  // Allotment odds
  const subRii = (ipo.sub_rii ?? ipo.sub_total) as number | null;
  let oddsRatio = "—";
  let oddsPct = "—";
  if (subRii != null && subRii > 0) {
    if (subRii <= 1) {
      oddsRatio = "1 in 1";
      oddsPct = "100%";
    } else {
      const ratio = Math.round(subRii);
      oddsPct = `${((1 / subRii) * 100).toFixed(1)}%`;
      oddsRatio = `1 in ${ratio}`;
    }
  }

  // ── GMP Pulse template ──
  if (template === "gmp") {
    return new ImageResponse(
      <div
        style={{
          width: W,
          height: H,
          background: BG_DARK,
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent bar */}
        <div style={{ width: "100%", height: 5, background: BRAND, display: "flex" }} />

        {/* Body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "48px 64px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ color: ACCENT, fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Grey Market Premium
              </span>
              <span style={{ color: TEXT_PRIMARY, fontSize: 48, fontWeight: 700, lineHeight: 1.1, maxWidth: 700 }}>
                {ipoName} IPO
              </span>
            </div>
            <div
              style={{
                background: sColor + "22",
                border: `1.5px solid ${sColor}`,
                color: sColor,
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {status}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "#30363D", margin: "32px 0", display: "flex" }} />

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, flex: 1, alignItems: "center" }}>
            {/* GMP */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ color: TEXT_MUTED, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                GMP Today
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span
                  style={{
                    color: gmpVal != null && gmpVal >= 0 ? "#3FB950" : "#F85149",
                    fontSize: 72,
                    fontWeight: 800,
                    letterSpacing: "-2px",
                    lineHeight: 1,
                    display: "flex",
                  }}
                >
                  {gmpVal != null ? `\u20B9${gmpVal}` : "\u2014"}
                </span>
                {gmpPct ? (
                  <span
                    style={{
                      color: gmpVal != null && gmpVal >= 0 ? "#3FB950" : "#F85149",
                      fontSize: 28,
                      fontWeight: 700,
                      display: "flex",
                    }}
                  >
                    {gmpPct}
                  </span>
                ) : null}
              </div>
              {issuePrice ? (
                <span style={{ color: TEXT_MUTED, fontSize: 15, display: "flex" }}>
                  {`Issue Price: \u20B9${issuePrice} \u00B7 Est. Listing: \u20B9${issuePrice + (gmpVal ?? 0)}`}
                </span>
              ) : null}
            </div>

            {/* Separator */}
            <div style={{ width: 1, height: 100, background: "#30363D", display: "flex" }} />

            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Subscription", value: ipo.sub_total != null ? `${ipo.sub_total}x` : "\u2014" },
                { label: "Close Date", value: fmtDate(ipo.close_date as string) },
                { label: "Listing Date", value: fmtDate(ipo.listing_date as string) },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ color: TEXT_MUTED, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex" }}>
                    {item.label}
                  </span>
                  <span style={{ color: TEXT_PRIMARY, fontSize: 20, fontWeight: 600, display: "flex" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 64px",
            borderTop: "1px solid #30363D",
            background: BG_CARD,
          }}
        >
          <span style={{ color: BRAND, fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", display: "flex" }}>
            IPOCraft
          </span>
          <span style={{ color: TEXT_MUTED, fontSize: 14, display: "flex" }}>
            ipocraft.com/gmp · Data is indicative, not guaranteed
          </span>
        </div>
      </div>,
      { width: W, height: H,
        headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
      }
    );
  }

  if (template === "subscription") {
    const bars = [
      { label: "Retail (RII)", value: (ipo.sub_rii as number | null), color: "#3FB950" },
      { label: "Total", value: (ipo.sub_total as number | null), color: ACCENT },
    ];
    const maxVal = Math.max(...bars.map((b) => b.value ?? 0), 1);

    return new ImageResponse(
      <div style={{ width: W, height: H, background: BG_DARK, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
        <div style={{ width: "100%", height: 5, background: BRAND, display: "flex" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 64px", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ color: ACCENT, fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Subscription Snapshot
            </span>
            <span style={{ color: TEXT_PRIMARY, fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}>
              {ipoName} IPO
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}>
            {bars.map((bar) => (
              <div key={bar.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: TEXT_MUTED, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex" }}>
                    {bar.label}
                  </span>
                  <span style={{ color: TEXT_PRIMARY, fontSize: 20, fontWeight: 700, display: "flex" }}>
                    {bar.value != null ? `${bar.value}x` : "\u2014"}
                  </span>
                </div>
                <div style={{ width: "100%", height: 16, background: "#30363D", borderRadius: 8, overflow: "hidden", display: "flex" }}>
                  <div
                    style={{
                      width: `${Math.min(100, ((bar.value ?? 0) / maxVal) * 100)}%`,
                      height: "100%",
                      background: bar.color,
                      borderRadius: 8,
                      display: "flex",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: TEXT_MUTED, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex" }}>Closes</span>
              <span style={{ color: TEXT_PRIMARY, fontSize: 18, fontWeight: 600, display: "flex" }}>{fmtDate(ipo.close_date as string)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: TEXT_MUTED, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex" }}>Price Band</span>
              <span style={{ color: TEXT_PRIMARY, fontSize: 18, fontWeight: 600, display: "flex" }}>
                {issuePrice ? `\u20B9${ipo.price_min ?? issuePrice}\u2013\u20B9${issuePrice}` : "\u2014"}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 64px", borderTop: "1px solid #30363D", background: BG_CARD }}>
          <span style={{ color: BRAND, fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", display: "flex" }}>IPOCraft</span>
          <span style={{ color: TEXT_MUTED, fontSize: 14, display: "flex" }}>ipocraft.com/ipo/{slug}</span>
        </div>
      </div>,
      { width: W, height: H,
        headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
      }
    );
  }

  // ── Allotment Odds template (default) ──
  return new ImageResponse(
    <div style={{ width: W, height: H, background: BG_DARK, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", height: 5, background: BRAND, display: "flex" }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 64px",
          gap: 24,
          textAlign: "center",
        }}
      >
        <span style={{ color: ACCENT, fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Allotment Probability
        </span>
        <span style={{ color: TEXT_PRIMARY, fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>
          {ipoName} IPO
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#3FB950", fontSize: 96, fontWeight: 800, letterSpacing: "-4px", lineHeight: 1, display: "flex" }}>
            {oddsRatio}
          </span>
          <span style={{ color: TEXT_MUTED, fontSize: 24, fontWeight: 600, display: "flex" }}>
            {`applications will receive allotment \u00B7 ${oddsPct}`}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ color: TEXT_MUTED, fontSize: 16, display: "flex" }}>
            {`Retail subscription: ${subRii != null ? `${subRii}x` : "\u2014"} \u00B7 Allotment: ${fmtDate(ipo.allotment_date as string)}`}
          </span>
          <span style={{ color: "#6B7280", fontSize: 13, display: "flex" }}>
            Applying for more lots does NOT improve your odds — SEBI lottery
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 64px", borderTop: "1px solid #30363D", background: BG_CARD }}>
        <span style={{ color: BRAND, fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", display: "flex" }}>IPOCraft</span>
        <span style={{ color: TEXT_MUTED, fontSize: 14, display: "flex" }}>ipocraft.com/ipo/{slug}</span>
      </div>
    </div>,
    { width: W, height: H,
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
    }
  );
}
