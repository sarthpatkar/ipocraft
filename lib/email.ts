import nodemailer, { type Transporter } from "nodemailer";
import path from "path";

let transporter: Transporter | null = null;

// The real IPOCraft wordmark, embedded via CID so it renders inline in the
// email even when a client blocks remote images by default — referenced in
// template HTML as <img src="cid:ipocraft-logo">. White/light wordmark
// variant, meant for the navy hero band both templates use.
const LOGO_ATTACHMENT = {
  filename: "ipocraft-logo.png",
  path: path.join(process.cwd(), "public", "logo-dark.png"),
  cid: "ipocraft-logo",
};

/**
 * SMTP transport for IPOCraft's own mailbox (Hostinger webmail) — no
 * third-party email API (Resend/SendGrid/etc). Requires SMTP_HOST,
 * SMTP_PORT, SMTP_USER, SMTP_PASS in env. SMTP_PORT 465 = implicit TLS,
 * anything else falls back to STARTTLS (587/25).
 */
function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const from = process.env.SMTP_FROM || `IPOCraft <${process.env.SMTP_USER}>`;
  await getTransporter().sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    attachments: opts.html.includes("cid:ipocraft-logo") ? [LOGO_ATTACHMENT] : undefined,
  });
}

/**
 * Sends to many recipients with a small concurrency + delay so we don't trip
 * Hostinger's shared-hosting SMTP rate limits (typically ~100-150/hour).
 * Returns per-recipient results instead of throwing on individual failures.
 */
export async function sendMailBatch(
  recipients: string[],
  build: (to: string) => { subject: string; html: string; text: string },
  opts: { batchSize?: number; delayMs?: number } = {}
): Promise<{ sent: string[]; failed: { to: string; error: string }[] }> {
  const batchSize = opts.batchSize ?? 10;
  const delayMs = opts.delayMs ?? 1500;
  const sent: string[] = [];
  const failed: { to: string; error: string }[] = [];

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (to) => {
        try {
          const { subject, html, text } = build(to);
          await sendMail({ to, subject, html, text });
          sent.push(to);
        } catch (err: any) {
          failed.push({ to, error: err?.message || "Unknown send error" });
        }
      })
    );
    if (i + batchSize < recipients.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return { sent, failed };
}
