import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const sqlPath = path.join(appRoot, "investorgain_2026_missing_ipos_upsert.sql");
const outPath = path.join(appRoot, "investorgain_2026_ipoplatform_research.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clean(value) {
  if (value == null) return null;
  const stripped = String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8377;/g, "₹")
    .replace(/&#x20B9;/g, "₹")
    .replace(/\s+/g, " ")
    .trim();
  return stripped && !/^\[?●\]?$/.test(stripped) ? stripped : null;
}

function uniqueJoined(values) {
  const seen = new Set();
  const cleaned = [];
  for (const value of values) {
    const text = clean(value);
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(text);
  }
  return cleaned.length ? cleaned.join(", ") : null;
}

function numberFrom(value) {
  const text = clean(value);
  if (!text || /\[●\]/.test(text)) return null;
  const match = text.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function percentFrom(value) {
  return numberFrom(value);
}

function getRowsFromSql(sql) {
  return sql
    .split("\n")
    .filter((line) => line.startsWith("  ("))
    .map((line) => {
      const parts = line.split(", ");
      return {
        name: parts[0].replace(/^  \('/, "").replace(/'$/, "").replace(/''/g, "'"),
        slug: parts[2].slice(1, -1),
      };
    });
}

function extractJsonLd(html) {
  const blocks = [];
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      blocks.push(JSON.parse(match[1].trim()));
    } catch {
      // Ignore malformed third-party snippets.
    }
  }
  return blocks;
}

function walk(value, visitor) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visitor);
    return;
  }
  if (value && typeof value === "object") {
    visitor(value);
    for (const item of Object.values(value)) walk(item, visitor);
  }
}

function propertyMap(jsonLd) {
  const props = {};
  for (const block of jsonLd) {
    walk(block, (node) => {
      if (node["@type"] === "PropertyValue" && node.name) {
        props[String(node.name).trim()] = clean(node.value);
      }
    });
  }
  return props;
}

function firstFinancialProduct(jsonLd) {
  let found = null;
  for (const block of jsonLd) {
    walk(block, (node) => {
      if (!found && node["@type"] === "FinancialProduct") found = node;
    });
  }
  return found;
}

function itemUrls(jsonLd) {
  const urls = [];
  for (const block of jsonLd) {
    walk(block, (node) => {
      if (node["@type"] === "ListItem" && node.url) urls.push(node.url);
    });
  }
  return urls;
}

function htmlAnchors(html) {
  const anchors = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    anchors.push({
      href: match[1],
      text: clean(match[2]),
      raw: match[0],
    });
  }
  return anchors;
}

function docs(html) {
  const out = { drhp_link: null, rhp_link: null };
  for (const anchor of htmlAnchors(html)) {
    const href = anchor.href.startsWith("http") ? anchor.href : `https://www.ipoplatform.com${anchor.href}`;
    const text = anchor.text || "";
    const title = clean(anchor.raw) || "";
    const context = `${text} ${title}`;
    const looksLikeDocument =
      /\.pdf(?:$|\?)/i.test(href) ||
      /nsearchives|bseindia|chittorgarh\.net\/reports|storage|corporate/i.test(href);
    if (!looksLikeDocument) continue;
    if (!out.drhp_link && /\bDRHP\b/i.test(context)) out.drhp_link = href;
    if (!out.rhp_link && /\bRHP\b/i.test(context) && !/\bDRHP\b/i.test(context)) out.rhp_link = href;
  }
  return out;
}

function fallbackLeadManagers(html) {
  const names = [];
  const text = clean(html) || "";
  for (const match of text.matchAll(/([A-Z][A-Za-z0-9 &().,'/-]+?(?:Limited|Ltd\.?|Private Limited|Capital|Services|Bankers|Advisors|Securities)), based in [^.]{2,80}? is\s+the Lead Manager \(BRLM\)/gi)) {
    names.push(match[1]);
  }
  for (const anchor of htmlAnchors(html)) {
    if (/\/merchant-banker/i.test(anchor.href) && anchor.text && !/^read\b/i.test(anchor.text)) {
      names.push(anchor.text);
    }
  }
  return uniqueJoined(names);
}

function fallbackRegistrar(html) {
  const names = [];
  const text = clean(html) || "";
  for (const match of text.matchAll(/([A-Z][A-Za-z0-9 &().,'/-]+?(?:Limited|Ltd\.?|Private Limited|Services|Securities|Registrar|Registrars|Computers)[A-Za-z0-9 &().,'/-]*?)\s+is the Registrar for the IPO/gi)) {
    names.push(match[1]);
  }
  for (const match of text.matchAll(/The registrar for\s+.*?\s+IPO is\s+([A-Z][A-Za-z0-9 &().,'/-]+?)(?:\.| Investors| registrar website)/gi)) {
    names.push(match[1]);
  }
  for (const anchor of htmlAnchors(html)) {
    if (/\/ipo-registrar\//i.test(anchor.href) && anchor.text) {
      names.push(anchor.text);
    }
  }
  return uniqueJoined(names);
}

function sectionText(html, startPattern, endPattern) {
  const text = clean(html);
  if (!text) return null;
  const start = text.search(startPattern);
  if (start < 0) return null;
  const after = text.slice(start);
  const end = after.search(endPattern);
  return clean(end > 0 ? after.slice(0, end) : after.slice(0, 1000));
}

function paraphrasedAbout(name, sector, exchange, issueSize) {
  return null;
}

function cleanObjective(section) {
  if (!section) return null;
  let text = section
    .replace(/Object of Issue\s*\([^)]*\)/i, "")
    .replace(/IPO Objectives/i, "")
    .trim();
  text = clean(text);
  if (!text) return null;
  if (/offer for sale/i.test(text)) {
    return "The offer includes an offer-for-sale component; proceeds from that portion are received by selling shareholders, not the company.";
  }
  text = text
    .replace(/IPO Subscription[\s\S]*$/i, "")
    .replace(/Share Allocation[\s\S]*$/i, "")
    .replace(/View Full Details.*$/i, "")
    .trim();

  const objectives = [];
  if (/working capital/i.test(text)) objectives.push("fund working-capital requirements");
  if (/capital expenditure|capex|machiner|equipment|production capacity|solar/i.test(text)) {
    objectives.push("finance capital expenditure and operating assets");
  }
  if (/subsidiar|greenfield|project|unit|manufacturing/i.test(text)) {
    objectives.push("invest in project or manufacturing expansion");
  }
  if (/debt|borrowings|repay|prepay/i.test(text)) objectives.push("repay or reduce borrowings");
  if (/general corporate/i.test(text)) objectives.push("meet general corporate purposes");

  if (objectives.length === 0) return text.slice(0, 450);
  const unique = [...new Set(objectives)];
  return `The IPO proceeds are proposed to be used to ${unique.join(", ")}.`;
}

async function fetchPage(slug) {
  const url = `https://www.ipoplatform.com/ipo/${slug}/`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 IPOCraft data verification",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await res.text();
    return { url: res.url || url, status: res.status, html };
  } finally {
    clearTimeout(timeout);
  }
}

const rows = getRowsFromSql(fs.readFileSync(sqlPath, "utf8"));
const results = [];

for (const [index, row] of rows.entries()) {
  try {
    const page = await fetchPage(row.slug);
    const jsonLd = extractJsonLd(page.html);
    const props = propertyMap(jsonLd);
    const product = firstFinancialProduct(jsonLd);
    const links = docs(page.html);
    const urls = itemUrls(jsonLd);
    const objectiveSection = sectionText(page.html, /Object of Issue/i, /IPO Merchant Bankers|Lead Manager|Registrar/i);
    const issueSize = numberFrom(props["Issue Size"] || props["IPO Size"]);
    const sector = clean(product?.industry || props.Sector);
    const exchange = clean(props.Exchange);
    const name = clean(product?.issuer?.name || product?.name)?.replace(/\s+IPO$/i, "") || row.name;

    const enriched = {
      input_name: row.name,
      input_slug: row.slug,
      source_url: page.url,
      http_status: page.status,
      detail_id: urls[0]?.match(/\/(\d+)$/)?.[1] || null,
      name,
      sector,
      ipo_type: clean(props["IPO Type"]),
      exchange,
      face_value: numberFrom(props["Face Value"]),
      issue_size: issueSize,
      fresh_issue: numberFrom(props["Fresh Issue"]),
      market_cap: numberFrom(props["Market Capitalisation"]),
      pe_pre: numberFrom(props["PE Ratio"]),
      roce: percentFrom(props.ROCE),
      debt_equity: numberFrom(props["D/E"]),
      pat_margin: percentFrom(props["PAT margin"]),
      promoter_holding_pre: percentFrom(props["Pre Issue Promoter Holding"]),
      promoter_holding_post: percentFrom(props["Post Issue Promoter Holding"]),
      lead_managers: clean(props["Lead Manager"]) || fallbackLeadManagers(page.html),
      registrar: clean(props.Registrar) || fallbackRegistrar(page.html),
      drhp_link: links.drhp_link,
      rhp_link: links.rhp_link,
      about_company: paraphrasedAbout(name, sector, exchange, issueSize),
      objectives: cleanObjective(objectiveSection),
      company_strengths: null,
      company_risks: null,
    };

    results.push(enriched);
    console.log(`${index + 1}/${rows.length} ${row.slug} ${page.status}`);
  } catch (error) {
    results.push({
      input_name: row.name,
      input_slug: row.slug,
      error: error instanceof Error ? error.message : String(error),
    });
    console.log(`${index + 1}/${rows.length} ${row.slug} ERROR`);
  }
  await sleep(250);
}

fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ outPath, rows: results.length }, null, 2));
