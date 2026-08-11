import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(appRoot, "..");
const sourcePath = path.join(workspaceRoot, "ipo_extract_2026_investorgain.json");
const outPath = path.join(appRoot, "investorgain_2026_detail_research.json");

const REPORT_URL =
  "https://webnodejs.investorgain.com/cloud/v2/report/data-read/394/1/8/2026/2026-27/0/all?search=0&v=23-18";
const BASE = "https://www.investorgain.com";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clean(value) {
  if (value == null) return null;
  const text = String(value)
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/&#8377;/g, "₹")
    .replace(/&amp;/g, "&")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text && !/^\[?●\]?$/.test(text) && !/^\$[0-9a-f]+$/i.test(text) && text !== "-" ? text : null;
}

function slugify(name) {
  return clean(name)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") + "-ipo";
}

function numberFrom(value) {
  const text = clean(value);
  if (!text) return null;
  const match = text.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function croreFromAmount(value) {
  const num = numberFrom(value);
  if (num == null) return null;
  return num < 100_000 ? num : Number((num / 10_000_000).toFixed(2));
}

function jsonString(value) {
  if (value == null || value === "") return null;
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value
      .replace(/\\u003c/g, "<")
      .replace(/\\u003e/g, ">")
      .replace(/\\u0026/g, "&")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

function field(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const stringMatch = html.match(new RegExp(`\\\\"${escaped}\\\\":\\\\"((?:\\\\\\\\.|[^\\\\"])*)\\\\"`));
  if (stringMatch) return clean(jsonString(stringMatch[1]));
  const bareMatch = html.match(new RegExp(`\\\\"${escaped}\\\\":(-?\\d+(?:\\.\\d+)?|true|false|null)`));
  if (!bareMatch || bareMatch[1] === "null") return null;
  if (bareMatch[1] === "true") return true;
  if (bareMatch[1] === "false") return false;
  return Number(bareMatch[1]);
}

function propertyValue(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(
    new RegExp(`\\\\\\"name\\\\\\":\\\\\\"${escaped}\\\\\\",\\\\\\"value\\\\\\":\\\\\\"([^\\\\"]*)\\\\\\"`)
  );
  return match ? clean(jsonString(match[1])) : null;
}

function firstHrefByTitle(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`href="([^"]+)"[^>]+title="[^"]*${escaped}[^"]*"`, "i"));
  if (!match) return null;
  return match[1].replace(/&amp;/g, "&");
}

function orgJsonLd(html, companyName) {
  const blocks = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed?.["@type"] === "Organization") blocks.push(parsed);
    } catch {
      // Ignore unrelated malformed snippets.
    }
  }
  const normalizedCompany = clean(companyName)?.toLowerCase();
  return (
    blocks.find((block) => clean(block.name)?.toLowerCase() === normalizedCompany) ||
    blocks.find((block) => {
      const name = clean(block.name)?.toLowerCase() || "";
      return name && normalizedCompany?.includes(name) && !name.includes("investorgain");
    }) ||
    blocks.find((block) => {
      const name = clean(block.name)?.toLowerCase() || "";
      return !name.includes("investorgain") && (block.address || block.telephone || block.email);
    }) ||
    null
  );
}

function fullAddress(org) {
  const addr = org?.address;
  if (!addr) return null;
  return clean(
    [
      addr.streetAddress,
      addr.addressLocality,
      addr.addressRegion,
      addr.postalCode,
      addr.addressCountry,
    ]
      .filter(Boolean)
      .join(", ")
  );
}

function tableName(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<tr><td>${escaped}</td><td class="text-val">([\\s\\S]*?)<\\/td><\\/tr>`, "i"));
  return match ? clean(match[1]) : null;
}

function linkedNamesInSentence(html, marker) {
  const i = html.indexOf(marker);
  if (i < 0) return null;
  const slice = html.slice(Math.max(0, i - 1500), i + 1000);
  const names = [];
  for (const match of slice.matchAll(/<a [^>]*style="text-decoration: underline;"[^>]*>([\s\S]*?)<\/a>/g)) {
    names.push(clean(match[1]));
  }
  return [...new Set(names.filter(Boolean))].join(", ") || null;
}

function cleanSectionText(value) {
  return clean(value)
    ?.replace(/^#+\s*/g, "")
    .replace(/\bView Full Details\b[\s\S]*$/i, "")
    .replace(/\bFinancial Highlights\b[\s\S]*$/i, "")
    .replace(/\bKey Performance Indicators\b[\s\S]*$/i, "")
    .replace(/\bCompany Address\b[\s\S]*$/i, "")
    .replace(/\s+/g, " ")
    .trim() || null;
}

function textSection(html, startPattern, endPatterns) {
  const text = clean(html);
  if (!text) return null;
  const start = text.search(startPattern);
  if (start < 0) return null;
  const after = text.slice(start);
  const endIndexes = endPatterns
    .map((pattern) => after.search(pattern))
    .filter((index) => index > 0);
  const end = endIndexes.length ? Math.min(...endIndexes) : Math.min(after.length, 2000);
  return cleanSectionText(after.slice(0, end));
}

function sentenceCandidates(section) {
  if (!section) return [];
  return section
    .replace(/^About Company\s*/i, "")
    .replace(/^Sector\s*-\s*[^.]+/i, "")
    .replace(/^Incorporated\s+\d{4}\s*/i, "")
    .split(/(?<=[.!?])\s+/)
    .map(clean)
    .filter(Boolean);
}

function paraphraseBusinessSentence(sentence, companyName) {
  let text = sentence
    .replace(/^🔑\s*Login to View All Records\s*→\s*/i, "")
    .replace(/^About Company\s*/i, "")
    .replace(/^Sector\s*-\s*[^.]+?\s+Incorporated\s+\d{4}\s*/i, "")
    .replace(new RegExp(`^${companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "The company ")
    .replace(/\bOur Company\b/g, "The company")
    .replace(/\bThe Company\b/g, "The company")
    .replace(/\bis engaged in the business of\b/i, "operates in")
    .replace(/\bis engaged in\b/i, "operates in")
    .replace(/\bis involved in\b/i, "operates in")
    .replace(/\bmanufacturing of\b/i, "manufactures")
    .replace(/\btrading of\b/i, "trades in")
    .replace(/\bproviding\b/i, "provides")
    .replace(/\boffering\b/i, "offers")
    .replace(/\s+/g, " ")
    .trim();
  if (/^[a-z]/.test(text)) text = `The company ${text}`;
  return clean(text);
}

function sourceBackedAbout(companyName, sector, html) {
  const section = textSection(html, /## About Company|About Company/i, [
    /Competitive Strengths|Key Strengths/i,
    /## .* IPO Objectives|IPO Objectives/i,
    /Financial Highlights/i,
    /Company Address/i,
  ]);
  const candidate = sentenceCandidates(section).find((sentence) =>
    /\b(engaged|manufactur|provide|offer|operat|product|service|retail|distribut|supply|construct|develop)\w*\b/i.test(sentence) &&
    !/\b(IPO Subscription|IPO Lot Size|IPO Details|Minimum bid|Multiples of|Preview Limited|IPOMatrix|Registrar|Face Value|Price Band|Issue Size|Objectives Financials)\b/i.test(sentence)
  );
  if (!candidate) return null;
  const summary = paraphraseBusinessSentence(candidate, companyName);
  if (!summary || summary.length < 60) return null;
  return summary;
}

function sourceBackedStrengths(html) {
  const section = textSection(html, /Competitive Strengths|Key Strengths/i, [
    /## .* IPO Objectives|IPO Objectives/i,
    /Financial Highlights/i,
    /Key Performance Indicators/i,
    /Peer Comparison/i,
  ]);
  if (!section) return null;
  const cleaned = section
    .replace(/^(Competitive Strengths|Key Strengths)\s*/i, "")
    .replace(/\s*\*\s*/g, "; ")
    .replace(/\s+/g, " ")
    .trim();
  const parts = cleaned
    .split(/;|(?<=[.!?])\s+(?=[A-Z])/)
    .map((part) => clean(part.replace(/^\d+\s*/, "")))
    .filter((part) => part && part.length > 20 && !/^Competitive Strengths|^Key Strengths/i.test(part))
    .slice(0, 4);
  if (parts.length === 0) return null;
  return `Strengths include ${parts.join("; ")}.`;
}

function parseDetail(row, html) {
  const companyName = field(html, "company_name") || row.IPO;
  const org = orgJsonLd(html, companyName);
  const priceMin = numberFrom(field(html, "issue_price_lower"));
  const priceMax = numberFrom(field(html, "issue_price_upper"));
  const issuePrice = numberFrom(field(html, "issue_price_final") || field(html, "allotment_price"));
  const lotSize = numberFrom(field(html, "market_lot_size"));
  const minOrderQty = numberFrom(field(html, "minimum_order_quantity"));
  const minOrderAmount = numberFrom(field(html, "min_order_amount"));
  const maxRetailQty = numberFrom(field(html, "max_retail_qty"));
  const minHniQty = numberFrom(field(html, "min_hni_qty"));
  const minBhniQty = numberFrom(field(html, "min_bhni_qty"));
  const listingPrice = numberFrom(field(html, "listing_price"));
  const listingGain =
    listingPrice != null && issuePrice ? Number((((listingPrice - issuePrice) / issuePrice) * 100).toFixed(2)) : null;

  const qibShares = numberFrom(field(html, "shares_offered_qib"));
  const niiShares = numberFrom(field(html, "shares_offered_nii"));
  const riiShares = numberFrom(field(html, "shares_offered_rii"));
  const employeeShares = numberFrom(field(html, "shares_offered_emp"));
  const shareholderShares = numberFrom(field(html, "shares_offered_shareholders"));
  const totalShares = numberFrom(field(html, "shares_offered_total"));
  const pct = (shares) =>
    totalShares && shares != null ? Number(((shares / totalShares) * 100).toFixed(2)) : null;

  const sector = clean(field(html, "company_sector") || propertyValue(html, "Sector"));
  const about = clean(field(html, "about_company")) || sourceBackedAbout(companyName, sector, html);
  const objectives = clean(field(html, "objectives"));
  const strengths = clean(field(html, "likes")) || sourceBackedStrengths(html);
  const finalProspectus = field(html, "final_prospectus");
  const rhp = field(html, "prospectus_rhp") || finalProspectus || firstHrefByTitle(html, "RHP");
  const drhp = field(html, "prospectus_drhp") || firstHrefByTitle(html, "DRHP");

  const leadManagers =
    tableName(html, "Lead Managers") ||
    linkedNamesInSentence(html, "lead manager") ||
    clean(field(html, "lead_manager_name"));
  const registrar =
    tableName(html, "Registrar") ||
    linkedNamesInSentence(html, "registrar") ||
    propertyValue(html, "Registrar");
  const marketMaker = linkedNamesInSentence(html, "Market Maker");

  return {
    input_name: row.IPO,
    input_slug: slugify(row.IPO),
    source_url: `${BASE}${row["~URLRewrite_Folder_Name"]}`,
    http_status: 200,
    investorgain_id: row["~id"],
    name: companyName,
    symbol: clean(field(html, "nse_symbol") || field(html, "bse_scripcode") || field(html, "bse_cd")),
    exchange: clean(field(html, "ipo_listing_at") || row.Exchange),
    listing_exchange: clean(field(html, "ipo_listing_at") || row.Exchange),
    sector,
    ipo_type: clean(field(html, "issue_category")) === "SME" ? "SME" : "Mainboard",
    price_min: priceMin,
    price_max: priceMax,
    issue_price: issuePrice,
    face_value: numberFrom(field(html, "face_value")),
    lot_size: lotSize,
    issue_size: numberFrom(field(html, "issue_size")) ?? croreFromAmount(field(html, "ttl_issue_size_in_amt") || field(html, "issue_size_in_amt")),
    fresh_issue: numberFrom(field(html, "fresh_issue")) ?? croreFromAmount(field(html, "ttl_issue_size_fresh_in_amt") || field(html, "issue_size_fresh_in_amt")),
    gmp: numberFrom(field(html, "gmp") || propertyValue(html, "GMP")),
    listing_price: listingPrice,
    listing_price_open: listingPrice,
    listing_gain_percent: listingGain,
    pe_pre: numberFrom(field(html, "pe_ratio")),
    pe_post: numberFrom(field(html, "post_pe_ratio")),
    eps_pre: numberFrom(field(html, "kpi_eps")),
    eps_post: numberFrom(field(html, "kpi_eps_post")),
    roce: numberFrom(field(html, "kpi_roce")),
    ronw: numberFrom(field(html, "kpi_ronw") || field(html, "kpi_roe")),
    debt_equity: numberFrom(field(html, "kpi_debt_equity")),
    pat_margin: numberFrom(field(html, "kpi_pat_margin")),
    market_cap: numberFrom(field(html, "market_cap")),
    qib_quota: pct(qibShares),
    nii_quota: pct(niiShares),
    rii_quota: pct(riiShares),
    employee_reservation: pct(employeeShares),
    shareholder_quota: pct(shareholderShares),
    reservation_qib: pct(qibShares),
    reservation_nii: pct(niiShares),
    reservation_rii: pct(riiShares),
    reservation_employee: pct(employeeShares),
    retail_min_lots: lotSize && minOrderQty ? Math.ceil(minOrderQty / lotSize) : null,
    retail_min_shares: minOrderQty || lotSize,
    retail_min_amount: minOrderAmount || (issuePrice && minOrderQty ? issuePrice * minOrderQty : null),
    retail_max_lots: lotSize && maxRetailQty ? Math.floor(maxRetailQty / lotSize) : null,
    retail_max_shares: maxRetailQty,
    retail_max_amount: issuePrice && maxRetailQty ? issuePrice * maxRetailQty : null,
    shni_lots: lotSize && minHniQty ? Math.ceil(minHniQty / lotSize) : null,
    shni_shares: minHniQty,
    shni_amount: issuePrice && minHniQty ? issuePrice * minHniQty : null,
    shni_min_lots: lotSize && minHniQty ? Math.ceil(minHniQty / lotSize) : null,
    shni_min_shares: minHniQty,
    shni_min_amount: issuePrice && minHniQty ? issuePrice * minHniQty : null,
    bhni_lots: lotSize && minBhniQty ? Math.ceil(minBhniQty / lotSize) : null,
    bhni_shares: minBhniQty,
    bhni_amount: issuePrice && minBhniQty ? issuePrice * minBhniQty : null,
    bhni_min_lots: lotSize && minBhniQty ? Math.ceil(minBhniQty / lotSize) : null,
    bhni_min_shares: minBhniQty,
    bhni_min_amount: issuePrice && minBhniQty ? issuePrice * minBhniQty : null,
    lead_managers: leadManagers,
    registrar,
    registrar_email: clean(field(html, "registrar_email")),
    drhp_link: drhp,
    rhp_link: rhp,
    allotment_link: clean(field(html, "ipo_allotment_url")),
    website: clean(org?.url),
    company_website: clean(org?.url),
    company_address: fullAddress(org),
    company_phone: clean(org?.telephone),
    company_email: clean(org?.email),
    logo_url: firstHrefByTitle(html, "Logo") || `https://www.chittorgarh.net/images/ipo/${field(html, "urlrewrite_folder_name")}-logo.jpg`,
    description: clean(field(html, "ipo_detail")),
    about_company: about,
    objectives: objectives
      ? clean(objectives)
      : null,
    company_strengths: strengths ? clean(strengths) : null,
    company_risks: null,
    promoter_holding_pre: numberFrom(field(html, "promoter_shareholding_pre_issue")),
    promoter_holding_post: numberFrom(field(html, "promoter_shareholding_post_issue")),
    anchor_investors: clean(field(html, "anchor_investor_url")),
    market_maker_shares_offered: numberFrom(field(html, "shares_offered_market_maker")),
    reserved_market_maker: field(html, "firm_market_maker_status") ? "Yes" : null,
    market_maker_shares: numberFrom(field(html, "shares_offered_market_maker")),
    market_maker_reservation: marketMaker,
    refund_date: clean(field(html, "timetable_refunds_dt"))?.slice(0, 10) || null,
  };
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml,application/json",
        "user-agent": "Mozilla/5.0 IPOCraft data verification",
        referer: "https://www.investorgain.com/report/current-ipo/394/all/",
      },
    });
    return { status: res.status, text: await res.text(), url: res.url || url };
  } finally {
    clearTimeout(timeout);
  }
}

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const report = JSON.parse((await fetchText(REPORT_URL)).text);
if (report.msg !== 1) throw new Error(`InvestorGain report API failed: ${report.error || "unknown error"}`);

const reportBySlug = new Map();
for (const row of report.reportTableData || []) {
  reportBySlug.set(slugify(row.IPO), row);
}

const seen = new Set();
const rows = [];
for (const row of source.ipos) {
  const slug = slugify(row.ipo);
  if (seen.has(slug)) continue;
  seen.add(slug);
  const reportRow = reportBySlug.get(slug);
  if (!reportRow) {
    rows.push({ input_name: row.ipo, input_slug: slug, error: "not found in InvestorGain report API" });
    continue;
  }
  try {
    const url = `${BASE}${reportRow["~URLRewrite_Folder_Name"]}`;
    const page = await fetchText(url);
    if (page.status !== 200) {
      rows.push({ input_name: row.ipo, input_slug: slug, source_url: url, http_status: page.status });
    } else {
      rows.push(parseDetail(reportRow, page.text));
    }
    console.log(`${rows.length}/${seen.size} ${slug} ${page.status}`);
  } catch (error) {
    rows.push({
      input_name: row.ipo,
      input_slug: slug,
      source_url: reportRow ? `${BASE}${reportRow["~URLRewrite_Folder_Name"]}` : null,
      error: error instanceof Error ? error.message : String(error),
    });
    console.log(`${rows.length}/${seen.size} ${slug} ERROR`);
  }
  await sleep(1100);
}

fs.writeFileSync(outPath, JSON.stringify(rows, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, matched: rows.filter((row) => row.http_status === 200).length }, null, 2));
