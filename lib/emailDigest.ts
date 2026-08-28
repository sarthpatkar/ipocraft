import { getServiceSupabaseClient } from "@/lib/supabaseAdmin";
import { canonicalUrl } from "@/lib/site-url";
import { signUnsubscribeToken } from "@/lib/unsubscribeToken";
import { formatSubscriptionTimes } from "@/lib/formatters";

type DigestIpo = {
  name: string;
  slug: string;
  gmp: number | null;
  price_max: number | null;
  close_date: string | null;
  ipo_type: string | null;
  sub_total: string | number | null;
};

export type Digest = {
  mainboard: DigestIpo[];
  sme: DigestIpo[];
};

/** Top 5 currently-open IPOs by GMP, split Mainboard/SME — matches the "top 5 GMP" copy on /alerts. */
export async function fetchDigestIpos(): Promise<Digest> {
  const db = getServiceSupabaseClient();
  const { data, error } = await db
    .from("ipos")
    .select("name, slug, gmp, price_max, close_date, ipo_type, sub_total")
    .eq("status", "Open")
    .order("gmp", { ascending: false, nullsFirst: false });

  if (error) throw new Error(`Failed to load IPOs for digest: ${error.message}`);

  const all = (data || []) as DigestIpo[];
  const mainboard = all.filter((i) => i.ipo_type !== "SME").slice(0, 5);
  const sme = all.filter((i) => i.ipo_type === "SME").slice(0, 5);
  return { mainboard, sme };
}

export function digestIsEmpty(digest: Digest): boolean {
  return digest.mainboard.length === 0 && digest.sme.length === 0;
}

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function gmpPercent(ipo: DigestIpo): number | null {
  if (ipo.gmp == null || !ipo.price_max) return null;
  return (ipo.gmp / ipo.price_max) * 100;
}

function gmpText(ipo: DigestIpo): string {
  if (ipo.gmp == null) return `<span style="color:#64748B;font-weight:600;font-size:14px;font-family:${FONT};">—</span>`;
  const pct = gmpPercent(ipo);
  const positive = ipo.gmp > 0;
  const color = positive ? "#15803D" : "#475569";
  const pctLabel = pct != null ? ` (${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%)` : "";
  return `<span style="color:${color};font-weight:700;font-size:15px;font-family:${FONT};">${positive ? "+" : ""}₹${ipo.gmp}${pctLabel}</span>`;
}

function closeLabel(ipo: DigestIpo): string {
  if (!ipo.close_date) return "";
  const close = new Date(ipo.close_date);
  const isToday = close.toDateString() === new Date().toDateString();
  const formatted = close.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  if (isToday) return `<span style="color:#C2410C;font-weight:700;">Closes today</span>`;
  return `Closes ${formatted}`;
}

/** "12.40x subscribed" — blank when there's no subscription data yet (e.g. an issue that just opened). */
function subLabel(ipo: DigestIpo): string {
  const formatted = formatSubscriptionTimes(ipo.sub_total, "");
  if (!formatted) return "";
  return `<div style="margin-top:2px;color:#64748B;font-size:12px;font-family:${FONT};">${formatted} subscribed</div>`;
}

function rowHtml(ipo: DigestIpo): string {
  const url = canonicalUrl(`/ipo/${ipo.slug}`);
  return `
    <tr>
      <td style="padding:13px 0;border-bottom:1px solid #EEF1F6;">
        <a href="${url}" style="color:#0F172A;font-weight:600;font-size:15.5px;text-decoration:none;font-family:${FONT};">${ipo.name}</a>
        <div style="margin-top:3px;color:#64748B;font-size:12.5px;font-family:${FONT};">${closeLabel(ipo)}</div>
      </td>
      <td style="padding:13px 0;border-bottom:1px solid #EEF1F6;text-align:right;white-space:nowrap;vertical-align:top;">
        ${gmpText(ipo)}
        ${subLabel(ipo)}
      </td>
    </tr>`;
}

function sectionHtml(title: string, ipos: DigestIpo[]): string {
  if (ipos.length === 0) return "";
  return `
    <tr><td style="padding:22px 32px 0;">
      <p style="margin:0 0 6px;color:#1C317A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;font-family:${FONT};">${title}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${ipos.map(rowHtml).join("")}
      </table>
    </td></tr>`;
}

/** Tone-matched opening line based on today's real leading GMP — reactive, never fabricated. Warm, not a punchline. */
function pickOpener(topPick: DigestIpo | undefined): string {
  if (!topPick || topPick.gmp == null) return "A quiet morning. Here's what we've got anyway.";
  const pct = gmpPercent(topPick) ?? 0;
  if (pct >= 40) return "What a morning — someone out there is smiling.";
  if (pct >= 15) return "A good one today. Worth a proper look.";
  if (topPick.gmp > 0) return "Small moves today, but movement all the same.";
  return "A calm morning out there. That's alright too.";
}

export function buildDigestEmail(digest: Digest, recipientEmail: string): { subject: string; html: string; text: string } {
  const token = signUnsubscribeToken(recipientEmail);
  const unsubscribeUrl = `${canonicalUrl("/api/alerts/unsubscribe")}?email=${encodeURIComponent(recipientEmail)}&token=${token}`;
  const gmpUrl = canonicalUrl("/gmp");
  const disclaimerUrl = canonicalUrl("/disclaimer");
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const topPick = [...digest.mainboard, ...digest.sme].sort((a, b) => (b.gmp ?? -Infinity) - (a.gmp ?? -Infinity))[0];
  const opener = pickOpener(topPick);

  const topPickLine = topPick && topPick.gmp != null && topPick.gmp > 0
    ? (() => {
        const pct = gmpPercent(topPick);
        const pctLabel = pct != null ? ` — ${pct >= 0 ? "+" : ""}${pct.toFixed(0)}% and climbing` : "";
        return `
    <tr><td style="padding:22px 32px 0;">
      <p style="margin:0;color:#334155;font-size:15px;line-height:1.8;font-family:${FONT};">
        Leading today: <a href="${canonicalUrl(`/ipo/${topPick.slug}`)}" style="background:#FDE68A;padding:3px 6px;border-radius:3px;color:#1E293B;font-weight:700;text-decoration:none;">${topPick.name}</a>${pctLabel}.
      </p>
    </td></tr>`;
      })()
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>IPOCraft Morning GMP Brief</title>
<style>
  @media (max-width: 600px) {
    .wrap { width: 100% !important; }
    .px { padding-left: 22px !important; padding-right: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#EEF1F6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${opener} ${[...digest.mainboard, ...digest.sme].slice(0, 3).map((i) => i.name).join(" · ")}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="wrap" width="580" cellpadding="0" cellspacing="0" style="width:580px;max-width:580px;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">

          <tr>
            <td style="background:#12224F;background:linear-gradient(135deg,#1C317A 0%,#12224F 100%);padding:28px 32px;" class="px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td><img src="cid:ipocraft-logo" width="112" height="33" alt="IPOCraft" style="display:block;border:0;" /></td>
                <td align="right" valign="middle" style="color:#D3E0FA;font-size:13px;font-family:${FONT};">${dateLabel}</td>
              </tr></table>
              <p style="margin:16px 0 0;color:#FFFFFF;font-size:22px;line-height:1.3;font-weight:700;font-family:${FONT};letter-spacing:-0.01em;">${opener}</p>
            </td>
          </tr>

          ${topPickLine}
          ${sectionHtml("Mainboard IPOs", digest.mainboard)}
          ${sectionHtml("SME IPOs", digest.sme)}

          <tr><td align="center" style="padding:28px 32px 8px;" class="px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="border-radius:8px;background:#1C317A;">
                <a href="${gmpUrl}" style="display:inline-block;padding:15px 30px;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;font-family:${FONT};">
                  Show me the board
                </a>
              </td>
            </tr></table>
          </td></tr>

          <tr><td style="padding:24px 32px 0;" class="px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E7ECF3;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>

          <tr><td style="padding:18px 32px 0;" class="px">
            <p style="margin:0;color:#64748B;font-size:13px;line-height:1.6;font-family:${FONT};">Thanks for reading this far. See you tomorrow. ❤️</p>
          </td></tr>

          <tr>
            <td style="background:#F8FAFC;padding:16px 32px 22px;" class="px">
              <p style="margin:0 0 10px;color:#475569;font-size:12.5px;line-height:1.65;font-family:${FONT};">
                IPOCraft is an independent informational platform, not registered with SEBI as an investment adviser, research analyst, or broker. Nothing here is financial advice.
              </p>
              <p style="margin:0 0 10px;color:#475569;font-size:12.5px;line-height:1.65;font-family:${FONT};">
                Grey Market Premium (GMP) is an unofficial, unregulated indicator — it does not guarantee listing price or performance and can change without notice. Data is sourced from public filings and exchange disclosures; verify independently before applying.
              </p>
              <p style="margin:0;font-size:12.5px;font-family:${FONT};">
                <a href="${disclaimerUrl}" style="color:#1C317A;text-decoration:underline;font-weight:600;">Full disclaimer</a>
                <span style="color:#94A3B8;"> &nbsp;·&nbsp; </span>
                <a href="${unsubscribeUrl}" style="color:#1C317A;text-decoration:underline;font-weight:600;">Unsubscribe</a>
                <span style="color:#94A3B8;"> &nbsp;·&nbsp; </span>
                <span style="color:#64748B;">ipocraft.com</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textSubLine = (i: DigestIpo) => {
    const sub = formatSubscriptionTimes(i.sub_total, "");
    const gmp = i.gmp != null ? `₹${i.gmp}` : "GMP not available";
    return `- ${i.name}: ${gmp}${sub ? `, ${sub} subscribed` : ""}`;
  };

  const textLines = [
    `IPOCraft Morning GMP Brief — ${dateLabel}`,
    opener,
    "",
    ...(digest.mainboard.length
      ? ["Mainboard IPOs:", ...digest.mainboard.map(textSubLine), ""]
      : []),
    ...(digest.sme.length
      ? ["SME IPOs:", ...digest.sme.map(textSubLine), ""]
      : []),
    `Full tracker: ${gmpUrl}`,
    "",
    "Thanks for reading this far. See you tomorrow. ❤️",
    "",
    "---",
    "IPOCraft is an independent informational platform, not registered with SEBI as an investment adviser, research analyst, or broker. Nothing here is financial advice.",
    "",
    "Grey Market Premium (GMP) is an unofficial, unregulated indicator — it does not guarantee listing price or performance and can change without notice. Data is sourced from public filings and exchange disclosures; verify independently before applying.",
    "",
    `Full disclaimer: ${disclaimerUrl}`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ];

  return {
    subject: opener,
    html,
    text: textLines.join("\n"),
  };
}
