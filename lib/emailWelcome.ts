import { canonicalUrl } from "@/lib/site-url";
import { signUnsubscribeToken } from "@/lib/unsubscribeToken";

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// Small hand-drawn line icons (18px, single stroke, brand navy) — used instead
// of emoji, which read as generic/AI-templated.
const ICON = {
  trend:
    '<polyline points="3,16 9,10 13,14 21,4" fill="none" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="15,4 21,4 21,10" fill="none" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  eye:
    '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" fill="none" stroke="#1C317A" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="#1C317A" stroke-width="1.8"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="#1C317A" stroke-width="1.8"/><line x1="3" y1="10" x2="21" y2="10" stroke="#1C317A" stroke-width="1.8"/><line x1="8" y1="3" x2="8" y2="7" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round"/><line x1="16" y1="3" x2="16" y2="7" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round"/>',
  compare:
    '<polyline points="7,3 3,7 7,11" fill="none" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="7" x2="21" y2="7" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round"/><polyline points="17,13 21,17 17,21" fill="none" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="17" x2="21" y2="17" stroke="#1C317A" stroke-width="1.8" stroke-linecap="round"/>',
};

function svg(paths: string) {
  return `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

function listItem(icon: string, title: string, punch: string) {
  return `
    <tr>
      <td width="20" valign="top" style="padding:4px 12px 18px 0;">${svg(icon)}</td>
      <td valign="top" style="padding:0 0 18px;">
        <p style="margin:0;color:#0F172A;font-size:15px;line-height:1.55;font-family:${FONT};">
          <strong style="font-weight:700;">${title}.</strong> <span style="color:#475569;">${punch}</span>
        </p>
      </td>
    </tr>`;
}

/**
 * One-time welcome email, sent the moment someone subscribes to GMP alerts
 * for the first time. Zomato-notification energy: short punchy lines, one
 * joke per beat, no over-explaining. Editorial list with line icons, not a
 * grid of boxed "feature cards" — table-based markup for cross-client email.
 */
export function buildWelcomeEmail(recipientEmail: string): { subject: string; html: string; text: string } {
  const token = signUnsubscribeToken(recipientEmail);
  const unsubscribeUrl = `${canonicalUrl("/api/alerts/unsubscribe")}?email=${encodeURIComponent(recipientEmail)}&token=${token}`;
  const gmpUrl = canonicalUrl("/gmp");
  const calendarUrl = canonicalUrl("/ipo-calendar");
  const compareUrl = canonicalUrl("/compare");
  const disclaimerUrl = canonicalUrl("/disclaimer");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Welcome to IPOCraft</title>
<style>
  @media (max-width: 600px) {
    .wrap { width: 100% !important; }
    .px { padding-left: 22px !important; padding-right: 22px !important; }
  }
  a.btn:hover { background:#152658 !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#EEF1F6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Thank you for trusting us with your inbox. Here's what that gets you.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F6;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="wrap" width="580" cellpadding="0" cellspacing="0" style="width:580px;max-width:580px;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">

          <!-- Hero -->
          <tr>
            <td style="background:#12224F;background:linear-gradient(135deg,#1C317A 0%,#12224F 100%);padding:32px 32px 32px;" class="px">
              <img src="cid:ipocraft-logo" width="132" height="39" alt="IPOCraft" style="display:block;margin:0 0 22px;border:0;" />
              <p style="margin:0;color:#FFFFFF;font-size:32px;line-height:1.2;font-weight:700;font-family:${FONT};letter-spacing:-0.01em;">
                You're in.
              </p>
              <p style="margin:8px 0 0;color:#D3E0FA;font-size:16px;line-height:1.4;font-family:${FONT};">
                We're genuinely happy about that. ❤️
              </p>
            </td>
          </tr>

          <!-- Copy — warm, respectful, just the reader and IPOCraft -->
          <tr>
            <td style="padding:28px 32px 4px;" class="px">
              <p style="margin:0 0 14px;color:#1E293B;font-size:16px;line-height:1.65;font-family:${FONT};">
                Thank you for trusting us with a spot in your inbox. That's not a small thing to hand over, and we don't take it lightly.
              </p>
              <p style="margin:0 0 14px;color:#334155;font-size:15px;line-height:1.65;font-family:${FONT};">
                IPOs move quickly — GMP shifts, subscription numbers climb, allotment dates get fixed, sometimes within hours. We built IPOCraft so none of that has to reach you late or secondhand. It'll be here, the moment it happens, exactly as it is.
              </p>
              <p style="margin:0 0 22px;color:#334155;font-size:15px;line-height:1.95;font-family:${FONT};">
                <span style="background:#FDE68A;padding:3px 6px;border-radius:3px;color:#1E293B;font-weight:700;">Free for the next 30 days.</span> No card needed. We'd rather earn your trust first than ask for anything up front.
              </p>
            </td>
          </tr>

          <!-- List -->
          <tr>
            <td style="padding:10px 32px 4px;" class="px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${listItem(ICON.trend, "Live GMP", "So you always know exactly where things stand.")}
                ${listItem(ICON.eye, "Subscription data", "Real demand, as it happens, not after the fact.")}
                ${listItem(ICON.calendar, "Allotment & listing dates", "The moments that matter, right when they're confirmed.")}
                ${listItem(ICON.compare, "Compare IPOs", "Two IPOs, side by side, so the choice feels a little easier.")}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:14px 32px 8px;" class="px">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="border-radius:8px;background:#1C317A;">
                  <a href="${gmpUrl}" class="btn" style="display:inline-block;padding:15px 32px;color:#FFFFFF;font-size:15.5px;font-weight:700;text-decoration:none;border-radius:8px;font-family:${FONT};">
                    Show me the numbers
                  </a>
                </td>
              </tr></table>
              <p style="margin:18px 0 0;font-size:13.5px;font-family:${FONT};">
                <a href="${calendarUrl}" style="color:#1C317A;text-decoration:none;font-weight:600;">IPO calendar</a>
                <span style="color:#94A3B8;"> &nbsp;·&nbsp; </span>
                <a href="${compareUrl}" style="color:#1C317A;text-decoration:none;font-weight:600;">Compare two IPOs</a>
              </p>
            </td>
          </tr>

          <tr><td style="padding:26px 32px 0;" class="px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E7ECF3;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:22px 32px 8px;" class="px">
              <p style="margin:0 0 8px;color:#334155;font-size:14.5px;line-height:1.7;font-family:${FONT};">
                Glad you're here. Really. ❤️<br/>
                <strong style="color:#0F172A;">— The IPOCraft team</strong>
              </p>
              <p style="margin:0;color:#64748B;font-size:13px;line-height:1.6;font-family:${FONT};">
                P.S. Thank you for giving us a chance. We'll do our best to deserve it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:18px 32px 24px;" class="px">
              <p style="margin:0 0 10px;color:#475569;font-size:12.5px;line-height:1.65;font-family:${FONT};">
                IPOCraft is an independent informational platform and is not registered with SEBI as an investment adviser, research analyst, or broker. Nothing here is financial advice or a recommendation to buy, sell, or hold any security.
              </p>
              <p style="margin:0 0 10px;color:#475569;font-size:12.5px;line-height:1.65;font-family:${FONT};">
                Grey Market Premium (GMP) is an unofficial, unregulated indicator — it does not guarantee listing price or performance and can change without notice. Data is sourced from public filings and exchange disclosures; verify independently before making investment decisions.
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

  const text = [
    "You're in.",
    "We're genuinely happy about that. ❤️",
    "",
    "Thank you for trusting us with a spot in your inbox. That's not a small thing to hand over, and we don't take it lightly.",
    "",
    "IPOs move quickly — GMP shifts, subscription numbers climb, allotment dates get fixed, sometimes within hours. We built IPOCraft so none of that has to reach you late or secondhand. It'll be here, the moment it happens, exactly as it is.",
    "",
    "Free for the next 30 days. No card needed. We'd rather earn your trust first than ask for anything up front.",
    "",
    "- Live GMP — so you always know exactly where things stand.",
    "- Subscription data — real demand, as it happens, not after the fact.",
    "- Allotment & listing dates — the moments that matter, right when they're confirmed.",
    "- Compare IPOs — two IPOs, side by side, so the choice feels a little easier.",
    "",
    `Show me the numbers: ${gmpUrl}`,
    `IPO calendar: ${calendarUrl}`,
    `Compare IPOs: ${compareUrl}`,
    "",
    "Glad you're here. Really. ❤️",
    "— The IPOCraft team",
    "",
    "P.S. Thank you for giving us a chance. We'll do our best to deserve it.",
    "",
    "---",
    "IPOCraft is an independent informational platform and is not registered with SEBI as an investment adviser, research analyst, or broker. Nothing here is financial advice or a recommendation to buy, sell, or hold any security.",
    "",
    "Grey Market Premium (GMP) is an unofficial, unregulated indicator — it does not guarantee listing price or performance and can change without notice. Data is sourced from public filings and exchange disclosures; verify independently before making investment decisions.",
    "",
    `Full disclaimer: ${disclaimerUrl}`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { subject: "You're in — and we're genuinely glad", html, text };
}
