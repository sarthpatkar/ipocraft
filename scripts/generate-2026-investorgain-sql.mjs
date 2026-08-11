import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..", "..");
const appRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(workspaceRoot, "ipo_extract_2026_investorgain.json");
const outputPath = path.join(appRoot, "investorgain_2026_missing_ipos_upsert.sql");
const ipoPlatformResearchPath = path.join(appRoot, "investorgain_2026_ipoplatform_research.json");
const investorGainResearchPath = path.join(appRoot, "investorgain_2026_detail_research.json");

const CURRENT_DATE = new Date("2026-08-11T00:00:00Z");

const skipNames = new Set([
  // Already present in the live Supabase table on 2026-08-10.
  "PNGS Reva",
  "PNGS Reva Diamond",
  "Shree Ram Twistex",
  "SEDEMAC Mechatronics",
  "Central Mine Planning",
  "SBI Funds Management",
]);

const verifiedOverridesByInputSlug = new Map([
  [
    "victory-electric-vehicles-ipo",
    {
      price_min: 41,
      price_max: 41,
      issue_price: 41,
      face_value: 5,
      lot_size: 3000,
      retail_min_lots: 2,
      retail_min_shares: 6000,
      retail_min_amount: 246000,
      retail_max_lots: 2,
      retail_max_shares: 6000,
      retail_max_amount: 246000,
      shni_lots: 3,
      shni_shares: 9000,
      shni_amount: 369000,
      shni_min_lots: 3,
      shni_min_shares: 9000,
      shni_min_amount: 369000,
      bhni_lots: 25,
      bhni_shares: 75000,
      bhni_amount: 3075000,
      bhni_min_lots: 25,
      bhni_min_shares: 75000,
      bhni_min_amount: 3075000,
      subscription_qib: 0,
      subscription_nii: 0.34,
      subscription_rii: 0.98,
      subscription_total: 0.95,
      sub_qib: 0,
      sub_nii: 0.34,
      sub_rii: 0.98,
      sub_total: 0.95,
      objectives:
        "The IPO proceeds are proposed to be used for capital expenditure, working-capital requirements and general corporate purposes.",
      about_company:
        "Victory Electric Vehicles International manufactures electric vehicles such as e-rickshaws, cargo e-rickshaws and electric scooters for passenger, cargo and related mobility use cases.",
      promoter_holding_pre: 97.42,
      promoter_holding_post: 63.33,
    },
  ],
  [
    "narmadesh-brass-industries-ipo",
    {
      price_min: 515,
      price_max: 515,
      issue_price: 515,
      retail_min_lots: 2,
      retail_min_shares: 480,
      retail_min_amount: 247200,
      retail_max_lots: 2,
      retail_max_shares: 480,
      retail_max_amount: 247200,
      shni_lots: 3,
      shni_shares: 720,
      shni_amount: 370800,
      shni_min_lots: 3,
      shni_min_shares: 720,
      shni_min_amount: 370800,
      bhni_lots: 20,
      bhni_shares: 4800,
      bhni_amount: 2472000,
      bhni_min_lots: 20,
      bhni_min_shares: 4800,
      bhni_min_amount: 2472000,
      subscription_nii: 2.03,
      subscription_rii: 0.44,
      subscription_total: 1.31,
      sub_nii: 2.03,
      sub_rii: 0.44,
      sub_total: 1.31,
      about_company:
        "Narmadesh Brass Industries manufactures brass billets, rods, brass components, sanitary and plumbing fittings, valves and related forged or cast brass products from its Jamnagar facility.",
      objectives:
        "The IPO proceeds are proposed to be used for repayment or prepayment of borrowings, purchase of machinery and equipment, working-capital requirements and general corporate purposes.",
    },
  ],
  [
    "autofurnish-ipo",
    {
      sector: "Automobile Accessories",
      price_min: 41,
      price_max: 41,
      issue_price: 41,
      lot_size: 3000,
      retail_min_lots: 2,
      retail_min_shares: 6000,
      retail_min_amount: 246000,
      retail_max_lots: 2,
      retail_max_shares: 6000,
      retail_max_amount: 246000,
      shni_lots: 3,
      shni_shares: 9000,
      shni_amount: 369000,
      shni_min_lots: 3,
      shni_min_shares: 9000,
      shni_min_amount: 369000,
      bhni_lots: 25,
      bhni_shares: 75000,
      bhni_amount: 3075000,
      bhni_min_lots: 25,
      bhni_min_shares: 75000,
      bhni_min_amount: 3075000,
      registrar_phone: "02228511022",
      registrar_email: "virenr@skylinerta.com",
      registrar_website: "https://www.skylinerta.com/ipo.php",
      objectives:
        "The IPO proceeds are proposed to be used for working-capital requirements, capital expenditure and general corporate purposes.",
      about_company:
        "Autofurnish sells automotive accessories and furnishing products through online and offline channels, serving passenger-vehicle owners and accessory buyers.",
    },
  ],
  [
    "amarva-polyplast-ipo",
    {
      // The local PDF extraction OCR'd this issuer as "Amarva"; public IPO sources list it as Atharva Poly-Plast.
      name: "Atharva Poly-Plast Limited",
      symbol: "ATHARVA",
      slug: "atharva-poly-plast-ipo",
      exchange: "BSE SME",
      listing_exchange: "BSE SME",
      sector: "Plastic Products - Consumer",
      ipo_type: "SME",
      refund_date: "2026-07-06",
      price_min: 55,
      price_max: 60,
      issue_price: 60,
      face_value: 10,
      lot_size: 2000,
      issue_size: 27,
      fresh_issue: 25.64,
      gmp: 10,
      listing_price: 69,
      listing_price_open: 69,
      listing_gain_percent: 15,
      pe_pre: 14.02,
      pe_post: 17.83,
      eps_pre: 4.28,
      eps_post: 3.37,
      roce: 24.92,
      ronw: 26.65,
      debt_equity: 0.57,
      pat_margin: 11.14,
      market_cap: 101.1,
      subscription_qib: 3.58,
      subscription_nii: 14.29,
      subscription_rii: 11.3,
      subscription_total: 10.06,
      sub_qib: 3.58,
      sub_nii: 14.29,
      sub_rii: 11.3,
      sub_total: 10.06,
      qib_quota: 19.02,
      nii_quota: 14.27,
      rii_quota: 33.38,
      reservation_qib: 19.02,
      reservation_nii: 14.27,
      reservation_rii: 33.38,
      retail_min_lots: 2,
      retail_min_shares: 4000,
      retail_min_amount: 240000,
      retail_max_lots: 2,
      retail_max_shares: 4000,
      retail_max_amount: 240000,
      shni_lots: 3,
      shni_shares: 6000,
      shni_amount: 360000,
      shni_min_lots: 3,
      shni_min_shares: 6000,
      shni_min_amount: 360000,
      shni_max_lots: 8,
      shni_max_shares: 16000,
      shni_max_amount: 960000,
      bhni_lots: 9,
      bhni_shares: 18000,
      bhni_amount: 1080000,
      bhni_min_lots: 9,
      bhni_min_shares: 18000,
      bhni_min_amount: 1080000,
      lead_managers: "Horizon Management Private Limited",
      registrar: "MUFG Intime India Private Limited",
      registrar_phone: "+91-22-4918 6270",
      registrar_email: "atharvapolyplast.smeipo@in.mpms.mufg.com",
      registrar_website: "https://in.mpms.mufg.com/Initial_Offer/public-issues.html",
      allotment_link: "https://in.mpms.mufg.com/Initial_Offer/public-issues.html",
      website: "https://atharvapolyplast.in/",
      company_website: "https://atharvapolyplast.in/",
      about_company:
        "Atharva Poly-Plast Limited manufactures precision plastic components used by customers in furniture, appliances, automotive and industrial applications.",
      objectives:
        "The IPO proceeds are proposed to be used for capital expenditure, repayment or prepayment of borrowings, working-capital requirements, and general corporate purposes.",
      company_strengths:
        "The company operates in precision plastic manufacturing with capabilities across tooling, moulding, assembly and testing for OEM and tier-1 customer requirements.",
      company_risks:
        "Key risks include dependence on OEM and tier-1 customer demand, working-capital intensity, raw-material price movements and the need to maintain quality standards across precision plastic components.",
      promoter_holding_pre: 100,
      promoter_holding_post: 73.29,
      market_maker_shares_offered: 226000,
      reserved_market_maker: "Yes",
      market_maker_shares: 226000,
    },
  ],
  [
    "q-line-biotec-ipo",
    {
      sector: "Healthcare - Diagnostics",
      company_strengths:
        "The company operates in in-vitro diagnostics with product lines across reagents, consumables, rapid test cards, IVD products and pathology equipment.",
    },
  ],
  [
    "rajnandini-fashion-india-ipo",
    {
      sector: "Textiles - Apparel",
      price_min: 59,
      price_max: 63,
      issue_price: 63,
      subscription_qib: 122.04,
      subscription_nii: 291.27,
      subscription_rii: 168.63,
      subscription_total: 189.46,
      sub_qib: 122.04,
      sub_nii: 291.27,
      sub_rii: 168.63,
      sub_total: 189.46,
      qib_quota: 18.96,
      nii_quota: 14.33,
      rii_quota: 33.36,
      reservation_qib: 18.96,
      reservation_nii: 14.33,
      reservation_rii: 33.36,
      retail_min_lots: 2,
      retail_min_shares: 4000,
      retail_min_amount: 252000,
      retail_max_lots: 2,
      retail_max_shares: 4000,
      retail_max_amount: 252000,
      shni_lots: 4,
      shni_shares: 8000,
      shni_amount: 504000,
      shni_min_lots: 4,
      shni_min_shares: 8000,
      shni_min_amount: 504000,
      bhni_lots: 16,
      bhni_shares: 32000,
      bhni_amount: 2016000,
      bhni_min_lots: 16,
      bhni_min_shares: 32000,
      bhni_min_amount: 2016000,
      about_company:
        "Rajnandini Fashion India designs, manufactures and sells women's ethnic and casual apparel through online marketplaces, direct channels and B2B trading.",
      objectives:
        "The IPO proceeds are proposed to be used for working-capital requirements, brand and business expansion needs, and general corporate purposes.",
    },
  ],
  [
    "utkal-speciality-ipo",
    {
      sector: "Packaging & Disposables",
      price_min: 62,
      price_max: 66,
      issue_price: 66,
      subscription_qib: 1.12,
      subscription_nii: 1.07,
      subscription_rii: 2.1,
      subscription_total: 1.69,
      sub_qib: 1.12,
      sub_nii: 1.07,
      sub_rii: 2.1,
      sub_total: 1.69,
      retail_min_lots: 2,
      retail_min_shares: 4000,
      retail_min_amount: 264000,
      retail_max_lots: 2,
      retail_max_shares: 4000,
      retail_max_amount: 264000,
      shni_lots: 3,
      shni_shares: 6000,
      shni_amount: 396000,
      shni_min_lots: 3,
      shni_min_shares: 6000,
      shni_min_amount: 396000,
      bhni_lots: 16,
      bhni_shares: 32000,
      bhni_amount: 2112000,
      bhni_min_lots: 16,
      bhni_min_shares: 32000,
      bhni_min_amount: 2112000,
      about_company:
        "Utkal Speciality Industries India manufactures paper-based food-service and packaging products, including plates, cups, bowls, boxes, tissue papers and wrapping products.",
      objectives:
        "The IPO proceeds are proposed to be used for expansion, debt reduction, working-capital requirements and general corporate purposes.",
    },
  ],
  [
    "anubhav-plast-ipo",
    {
      sector: "Plastic And Polymer",
      company_strengths:
        "The company operates in plastic products and polymer-based manufacturing, with IPO details indicating an SME listing on BSE SME.",
    },
  ],
  [
    "shree-balaji-mala-ipo",
    {
      sector: "Textiles - Sarees",
      price_min: 66,
      price_max: 70,
      issue_price: 70,
      subscription_qib: 113.55,
      subscription_nii: 185.23,
      subscription_rii: 228.24,
      subscription_total: 186.34,
      sub_qib: 113.55,
      sub_nii: 185.23,
      sub_rii: 228.24,
      sub_total: 186.34,
      qib_quota: 18.89,
      nii_quota: 14.44,
      rii_quota: 33.33,
      reservation_qib: 18.89,
      reservation_nii: 14.44,
      reservation_rii: 33.33,
      retail_min_lots: 2,
      retail_min_shares: 4000,
      retail_min_amount: 280000,
      retail_max_lots: 2,
      retail_max_shares: 4000,
      retail_max_amount: 280000,
      shni_lots: 3,
      shni_shares: 6000,
      shni_amount: 420000,
      shni_min_lots: 3,
      shni_min_shares: 6000,
      shni_min_amount: 420000,
      bhni_lots: 15,
      bhni_shares: 30000,
      bhni_amount: 2100000,
      bhni_min_lots: 15,
      bhni_min_shares: 30000,
      bhni_min_amount: 2100000,
      about_company:
        "Shree Balaji (Mala) Textiles manufactures and wholesales cotton sarees, primarily under the Mala Saree brand, through a B2B distribution network.",
      objectives:
        "The IPO proceeds are proposed to be used for working-capital requirements, business expansion and general corporate purposes.",
    },
  ],
  [
    "silverstorm-parks-ipo",
    {
      sector: "Entertainment - Amusement Parks",
      about_company:
        "Silverstorm Parks and Resorts operates amusement and leisure facilities, with IPO documents filed for its BSE SME public issue.",
      objectives:
        "The IPO proceeds are proposed to be used for expansion, facility development, working-capital requirements and general corporate purposes.",
    },
  ],
  [
    "optimystix-entertainment-ipo",
    {
      sector: "Media And Entertainment",
      about_company:
        "Optimystix Entertainment India is a television and digital content production company known for creating entertainment programming for Indian audiences.",
      objectives:
        "The IPO proceeds are proposed to be used for working-capital requirements and general corporate purposes.",
    },
  ],
  [
    "anawil-wire-and-engineering-ipo",
    {
      // InvestorGain published this under the misspelled slug "anawil-wire-engieering-ipo"; keep the canonical IPOCraft slug.
      name: "Anawil Wire & Engineering Limited",
      symbol: "ANAWIL",
      exchange: "NSE SME",
      listing_exchange: "NSE SME",
      sector: "Other Industrial Products",
      ipo_type: "SME",
      refund_date: "2026-08-07",
      price_min: 257,
      price_max: 270,
      issue_price: 270,
      face_value: 10,
      lot_size: 400,
      issue_size: 177.81,
      fresh_issue: 133.75,
      gmp: 58,
      pe_pre: 14.53,
      pe_post: 18.43,
      eps_pre: 18.58,
      eps_post: 14.65,
      roce: 23.05,
      ronw: 40.92,
      debt_equity: 1.43,
      pat_margin: 25.57,
      market_cap: 674.99,
      subscription_total: 149.13,
      sub_total: 149.13,
      qib_quota: 18.99,
      nii_quota: 14.25,
      rii_quota: 33.25,
      reservation_qib: 18.99,
      reservation_nii: 14.25,
      reservation_rii: 33.25,
      retail_min_lots: 2,
      retail_min_shares: 800,
      retail_min_amount: 216000,
      retail_max_lots: 2,
      retail_max_shares: 800,
      retail_max_amount: 216000,
      shni_lots: 3,
      shni_shares: 1200,
      shni_amount: 324000,
      shni_min_lots: 3,
      shni_min_shares: 1200,
      shni_min_amount: 324000,
      shni_max_lots: 9,
      shni_max_shares: 3600,
      shni_max_amount: 972000,
      bhni_lots: 10,
      bhni_shares: 4000,
      bhni_amount: 1080000,
      bhni_min_lots: 10,
      bhni_min_shares: 4000,
      bhni_min_amount: 1080000,
      lead_managers: "Hem Securities Limited",
      registrar: "Bigshare Services Private Limited",
      registrar_phone: "+91-22-6263 8200",
      registrar_email: "ipo@bigshareonline.com",
      registrar_website: "https://www.bigshareonline.com/",
      allotment_link: "https://ipo.bigshareonline.com/IPO_Status.html",
      website: "https://www.anawilvapi.in/",
      company_website: "https://www.anawilvapi.in/",
      company_address:
        "Plot No. 201, Office No. 1, Vibrant Business Park, G.I.D.C, Vapi, Valsad, Gujarat, 396191, IN",
      company_phone: "+91 90545 08244",
      company_email: "cs@anawilvapi.in",
      about_company:
        "Anawil Wire & Engineering Limited manufactures windmill towers, tower components and heavy fabricated steel structures for renewable-energy and industrial customers.",
      objectives:
        "The IPO proceeds are proposed to be used for repayment or prepayment of borrowings, capital expenditure for additional plant and machinery, and general corporate purposes.",
      company_strengths:
        "The company has in-house manufacturing capabilities, a quality-control framework, an order book and strategically located facilities serving wind-energy fabrication demand.",
      company_risks:
        "Key risks include execution of large wind-tower orders, dependence on renewable-energy capital spending, leverage, raw-material and fabrication-cost volatility, and commissioning risk from planned capacity expansion.",
      promoter_holding_pre: 89.35,
      promoter_holding_post: 65.26,
      market_maker_shares_offered: 331200,
      reserved_market_maker: "Yes",
      market_maker_shares: 331200,
    },
  ],
]);

const columns = [
  "name",
  "symbol",
  "slug",
  "exchange",
  "listing_exchange",
  "sector",
  "ipo_type",
  "status",
  "open_date",
  "close_date",
  "allotment_date",
  "refund_date",
  "listing_date",
  "price_min",
  "price_max",
  "issue_price",
  "face_value",
  "lot_size",
  "issue_size",
  "fresh_issue",
  "gmp",
  "listing_price",
  "listing_price_open",
  "listing_gain_percent",
  "pe_pre",
  "pe_post",
  "eps_pre",
  "eps_post",
  "roce",
  "ronw",
  "debt_equity",
  "pat_margin",
  "market_cap",
  "subscription_qib",
  "subscription_nii",
  "subscription_rii",
  "subscription_total",
  "sub_qib",
  "sub_nii",
  "sub_rii",
  "sub_shni",
  "sub_bhni",
  "sub_total",
  "subscription_updated_at",
  "qib_quota",
  "nii_quota",
  "rii_quota",
  "employee_reservation",
  "shareholder_quota",
  "reservation_qib",
  "reservation_nii",
  "reservation_rii",
  "reservation_employee",
  "reservation_employee_text",
  "retail_min_lots",
  "retail_min_shares",
  "retail_min_amount",
  "retail_max_lots",
  "retail_max_shares",
  "retail_max_amount",
  "shni_lots",
  "shni_shares",
  "shni_amount",
  "shni_min_lots",
  "shni_min_shares",
  "shni_min_amount",
  "shni_max_lots",
  "shni_max_shares",
  "shni_max_amount",
  "bhni_lots",
  "bhni_shares",
  "bhni_amount",
  "bhni_min_lots",
  "bhni_min_shares",
  "bhni_min_amount",
  "bhni_max_lots",
  "bhni_max_shares",
  "bhni_max_amount",
  "lead_managers",
  "registrar",
  "registrar_phone",
  "registrar_email",
  "registrar_website",
  "drhp_link",
  "rhp_link",
  "allotment_link",
  "website",
  "company_website",
  "company_address",
  "company_phone",
  "company_email",
  "logo_url",
  "description",
  "about_company",
  "objectives",
  "company_strengths",
  "company_risks",
  "promoter_holding_pre",
  "promoter_holding_post",
  "allotment_status",
  "allotment_out",
  "anchor_investors",
  "market_maker_shares_offered",
  "reserved_market_maker",
  "market_maker_shares",
  "market_maker_reservation",
  "created_at",
  "updated_at",
];

const monthByName = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

function cleanText(value) {
  if (value == null) return null;
  const cleaned = String(value).replace(/\s+/g, " ").trim();
  return cleaned === "" ? null : cleaned;
}

function sql(value) {
  if (value == null || value === "") return "NULL";
  if (value === "NOW()") return "NOW()";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function numberFrom(value) {
  const cleaned = cleanText(value);
  if (!cleaned) return null;
  const match = cleaned.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function parseDate(value) {
  const cleaned = cleanText(value)?.replace(/^[^0-9]+/, "");
  if (!cleaned) return null;
  const match = cleaned.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
  if (!match) return null;
  const [, day, mon, year] = match;
  const month = monthByName[mon.toLowerCase()];
  if (!month) return null;
  return `20${year}-${month}-${day.padStart(2, "0")}`;
}

function asDate(iso) {
  return iso ? new Date(`${iso}T00:00:00Z`) : null;
}

function statusFor(openDate, closeDate, listingDate) {
  const open = asDate(openDate);
  const close = asDate(closeDate);
  const listing = asDate(listingDate);
  if (listing && listing <= CURRENT_DATE) return "Listed";
  if (open && close && open <= CURRENT_DATE && close >= CURRENT_DATE) return "Open";
  if (close && close < CURRENT_DATE) return "Closed";
  return "Upcoming";
}

function slugify(name) {
  return cleanText(name)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") + "-ipo";
}

function ipoType(exchange) {
  return cleanText(exchange)?.toLowerCase().includes("sme") ? "SME" : "Mainboard";
}

function normalizeResearchIpoType(value) {
  const cleaned = cleanText(value);
  if (!cleaned) return null;
  return cleaned.toLowerCase().includes("sme") ? "SME" : "Mainboard";
}

function validResearchValue(value) {
  if (value == null || value === "") return null;
  const cleaned = typeof value === "string" ? cleanText(value) : value;
  if (typeof cleaned === "string" && (cleaned.includes("[●]") || cleaned === "₹0.00 Cr" || isBadNarrative(cleaned))) {
    return null;
  }
  return cleaned;
}

function isBadNarrative(value) {
  const text = cleanText(value);
  if (!text) return false;
  return (
    /^Source material identifies the issuer/i.test(text) ||
    /^IPO investors should review/i.test(text) ||
    /^.+ is an IPO issuer in India\b/i.test(text) ||
    /^(Investor Category|Anchor\)|IPO Timeline|IPO Calendar|Issue Reservation)\b/i.test(text) ||
    /\b(IPO Timeline|IPO Calendar|Allotment, Refund, Demat Credit|Credit to Demat|Listing dates are tentative)\b/i.test(text) ||
    /\b(IPO Subscription|IPO Lot Size|IPO Details|Minimum bid|Preview Limited|IPOMatrix|Registrar Comments|Objectives Financials KPIs|Face Value|Price Band)\b/i.test(text) ||
    /detailed strengths should be confirmed/i.test(text) ||
    /before publishing investment-facing claims/i.test(text)
  );
}

function sanitizeNarrativeFields(record) {
  for (const field of ["about_company", "objectives", "company_strengths", "company_risks"]) {
    if (typeof record[field] === "string") {
      record[field] = normalizeNarrative(record[field], field, record);
    }
    if (typeof record[field] === "string" && isBadNarrative(record[field])) {
      record[field] = null;
    }
  }
}

function normalizeNarrative(value, field, record) {
  let text = cleanText(value);
  if (!text) return null;
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;?|&#8212;/g, "-")
    .replace(/&minus;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/^🔑\s*Login to View All Records\s*→\s*/i, "")
    .replace(/^[\s\S]*?\bAbout Company\s+Sector\s*-\s*[^.]+?\s+/i, "")
    .replace(/^About Company\s*/i, "")
    .replace(/\s*It is classified by the source under[^.]+\./gi, "")
    .replace(/^Strengths include\s*:\s*/i, "Strengths include ")
    .replace(/, offers\b/i, " and offers")
    .replace(/\boperates in manufacturing\b/i, "manufactures")
    .replace(/\boperates in the manufactures\b/i, "manufactures")
    .replace(/\boperates in the provides\b/i, "provides")
    .replace(/\bspecializes in provides\b/i, "specializes in providing")
    .replace(/\s+/g, " ")
    .trim();
  if (field === "about_company") {
    text = text
      .replace(/^Sector\s*-\s*[^.]+?\s+Incorporated\s+\d{4}\s*/i, "")
      .replace(/^Sector\s*-\s*[^.]+?\s+/i, "")
      .replace(/^Incorporated\s+\d{4}\s+Incorporated\s+/i, "Incorporated ")
      .replace(/^([&A-Za-z ,/-]+?)\s+Incorporated\s+\d{4}\s+Incorporated\s+/i, "Incorporated ")
      .trim();
    text = stripSectorPrefix(text, record?.sector);
    text = text
      .replace(/\bengaged in the manufactures\b/i, "engaged in manufacturing")
      .replace(/\bengaged in manufactures\b/i, "engaged in manufacturing")
      .replace(/\boperates in the designing\b/i, "designs")
      .replace(/\boperates in processing\b/i, "processes")
      .replace(/\boperates in manufactures\b/i, "manufactures")
      .replace(/\boperates in the manufactures\b/i, "manufactures")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (field === "company_strengths") {
    text = normalizeStrengths(text, record?.name);
  }
  if (field === "about_company" && isWeakAbout(text)) return null;
  return text || null;
}

function stripSectorPrefix(value, sector) {
  let text = cleanText(value);
  const sectorText = cleanText(sector);
  if (!text || !sectorText) return text;
  const words = sectorText.split(/\s+/).filter(Boolean);
  const candidates = new Set([sectorText]);
  for (let n = 1; n <= Math.min(4, words.length); n += 1) {
    candidates.add(words.slice(words.length - n).join(" "));
  }
  for (const candidate of [...candidates].sort((a, b) => b.length - a.length)) {
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`^${escaped}\\s+`, "i"), "").trim();
  }
  return text;
}

function isWeakAbout(value) {
  const text = cleanText(value);
  if (!text) return true;
  if (text.length < 70) return true;
  return !/\b(operates|manufactures|provides|offers|retailer|producer|supplier|developer|provider|engaged|specializes|pioneered|focused|chain|portfolio|products|services)\b/i.test(text);
}

function normalizeStrengths(value, companyName) {
  let body = cleanText(value)?.replace(/^Strengths include\s*/i, "") || "";
  const cleanName = cleanText(companyName)?.replace(/\b(Ltd\.?|Limited)\b\.?/gi, "").trim();
  if (cleanName) {
    body = body.replace(new RegExp(`\\s+${cleanName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.?$`, "i"), "");
  }
  body = body
    .replace(/\s*\(often referred to as "\s*\)\s*/i, " ")
    .replace(/-\.$/, ".")
    .replace(/\s+(?=(Experienced|Comprehensive|Focus|Centralized|Geographical|Quality Assurance|Strong|Cost-effective|Diversified|Established|In-house|Wide|Long|Integrated|Strategic|Scalable|Robust|Track record|One of|Ability|Customer|Product|Distribution|Manufacturing|Technological|Timely|Brand|Pan-India|Efficient|Domain|Order book|Backward|Forward|Operational|Modern|Skilled)\b)/g, "; ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/;{2,}/g, ";")
    .trim();
  const parts = body
    .split(";")
    .map((part) => cleanText(part)?.replace(/[.]+$/g, ""))
    .filter((part) => part && part.length > 8)
    .slice(0, 5);
  if (parts.length === 0) return null;
  if (parts.length === 1 && /^The company\b/i.test(parts[0])) return `${parts[0]}.`;
  return `Strengths include ${parts.join("; ")}.`;
}

function pctText(value) {
  return `${Number(value).toFixed(2).replace(/\.00$/, "")}%`;
}

function multipleText(value) {
  return `${Number(value).toFixed(2).replace(/\.00$/, "")}x`;
}

function numericValue(value) {
  if (value == null || value === "" || value === "NULL") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function structuredStrengths(record) {
  const points = [];
  const roce = numericValue(record.roce);
  const ronw = numericValue(record.ronw);
  const debtEquity = numericValue(record.debt_equity);
  const patMargin = numericValue(record.pat_margin);
  const subscriptionTotal = numericValue(record.subscription_total ?? record.sub_total);
  const promoterPost = numericValue(record.promoter_holding_post);
  const listingGain = numericValue(record.listing_gain_percent);

  if (Number.isFinite(roce) && Number.isFinite(ronw) && roce >= 20 && ronw >= 20) {
    points.push(`healthy return profile with ROCE of ${pctText(roce)} and RoNW of ${pctText(ronw)}`);
  } else if (Number.isFinite(roce) && roce >= 25) {
    points.push(`strong capital efficiency indicated by ROCE of ${pctText(roce)}`);
  } else if (Number.isFinite(ronw) && ronw >= 25) {
    points.push(`strong shareholder return metric indicated by RoNW of ${pctText(ronw)}`);
  }

  if (Number.isFinite(debtEquity) && debtEquity <= 0.5) {
    points.push(`moderate leverage with debt-to-equity of ${multipleText(debtEquity)}`);
  }

  if (Number.isFinite(patMargin) && patMargin >= 15) {
    points.push(`profitability supported by PAT margin of ${pctText(patMargin)}`);
  }

  if (Number.isFinite(subscriptionTotal) && subscriptionTotal >= 10) {
    points.push(`strong IPO demand with total subscription of ${multipleText(subscriptionTotal)}`);
  }

  if (Number.isFinite(promoterPost) && promoterPost >= 70) {
    points.push(`promoters retain a post-issue holding of ${pctText(promoterPost)}`);
  }

  if (Number.isFinite(listingGain) && listingGain >= 20) {
    points.push(`listed at a premium of ${pctText(listingGain)} to the issue price`);
  }

  const unique = [...new Set(points)].slice(0, 4);
  return unique.length ? `Strengths include ${unique.join("; ")}.` : null;
}

function structuredRisks(record) {
  const risks = [];
  const debtEquity = numericValue(record.debt_equity);
  const patMargin = numericValue(record.pat_margin);
  const pePost = numericValue(record.pe_post ?? record.pe_pre);
  const subscriptionTotal = numericValue(record.subscription_total ?? record.sub_total);
  const promoterPost = numericValue(record.promoter_holding_post);
  const freshIssue = numericValue(record.fresh_issue);
  const issueSize = numericValue(record.issue_size);
  const listingGain = numericValue(record.listing_gain_percent);
  const about = cleanText(record.about_company) || "";

  if (Number.isFinite(debtEquity) && debtEquity >= 1.5) {
    risks.push(`leverage is elevated with debt-to-equity of ${multipleText(debtEquity)}`);
  }

  if (Number.isFinite(patMargin) && patMargin < 5) {
    risks.push(
      patMargin < 0
        ? `recent profitability is negative with PAT margin of ${pctText(patMargin)}`
        : `profitability is thin with PAT margin of ${pctText(patMargin)}`
    );
  }

  if (Number.isFinite(pePost) && pePost >= 50) {
    risks.push(`valuation appears demanding on reported earnings with P/E of ${multipleText(pePost)}`);
  }

  if (Number.isFinite(subscriptionTotal) && subscriptionTotal < 1) {
    risks.push(`IPO demand was weak with total subscription of ${multipleText(subscriptionTotal)}`);
  }

  if (Number.isFinite(promoterPost) && promoterPost < 50) {
    risks.push(`post-issue promoter holding is relatively low at ${pctText(promoterPost)}`);
  }

  if (
    Number.isFinite(issueSize) &&
    issueSize > 0 &&
    Number.isFinite(freshIssue) &&
    freshIssue / issueSize < 0.25
  ) {
    risks.push(`a large part of the offer is not fresh capital for the company`);
  }

  if (Number.isFinite(listingGain) && listingGain <= -10) {
    risks.push(`the stock listed below issue price with a ${pctText(Math.abs(listingGain))} listing loss`);
  }

  if (/\bIncorporated in (October\s+)?2023\b/i.test(about)) {
    risks.push(`the company has a limited operating history in its current form`);
  }

  const unique = [...new Set(risks)].slice(0, 4);
  return unique.length ? `Key risks include ${unique.join("; ")}.` : null;
}

function fillStructuredNarratives(record) {
  if (record.company_strengths == null) {
    record.company_strengths = structuredStrengths(record);
  }
  if (record.company_risks == null) {
    record.company_risks = structuredRisks(record);
  }
}

function preferResearch(record, research, fields, onlyIfNull = false) {
  for (const field of fields) {
    const value = validResearchValue(research[field]);
    if (value == null) continue;
    if (onlyIfNull && record[field] != null) continue;
    record[field] = value;
  }
}

function issueSizeCrore(value) {
  const cleaned = cleanText(value);
  if (!cleaned || /shares/i.test(cleaned)) return null;
  return numberFrom(cleaned);
}

function parseListing(value, issuePrice) {
  const cleaned = cleanText(value);
  if (!cleaned || /upcoming/i.test(cleaned)) {
    return { listingPrice: null, listingGainPercent: null };
  }

  const numeric = [...cleaned.replace(/,/g, "").matchAll(/-?\d+(?:\.\d+)?/g)].map((m) =>
    Number(m[0])
  );

  let listingPrice = null;
  let listingGainPercent = null;

  if (cleaned.includes("₹") || /^@?\d+(?:\.\d+)?\s/.test(cleaned)) {
    listingPrice = numeric[0] ?? null;
    listingGainPercent = numeric[1] ?? null;
  } else if (/%/.test(cleaned)) {
    listingGainPercent = numeric[0] ?? null;
  }

  if (listingGainPercent == null && listingPrice != null && issuePrice != null && issuePrice !== 0) {
    listingGainPercent = Number((((listingPrice - issuePrice) / issuePrice) * 100).toFixed(2));
  }

  return { listingPrice, listingGainPercent };
}

function dedupeRows(rows) {
  const bySlug = new Map();
  for (const row of rows) {
    const slug = slugify(row.ipo);
    const existing = bySlug.get(slug);
    if (!existing) {
      bySlug.set(slug, { ...row });
      continue;
    }

    for (const [key, value] of Object.entries(row)) {
      if (existing[key] == null && value != null) {
        existing[key] = value;
      }
    }
  }
  return [...bySlug.values()];
}

function buildRecord(row) {
  const openDate = parseDate(row.open);
  const closeDate = parseDate(row.close);
  const allotmentDate = parseDate(row.basis_of_allotment);
  const listingDate = parseDate(row.listing);
  const price = numberFrom(row.ipo_price);
  const lotSize = numberFrom(row.lot);
  const pe = numberFrom(row.pe);
  const issueSize = issueSizeCrore(row.ipo_size);
  const { listingPrice, listingGainPercent } = parseListing(row.gmp_or_status, price);
  const minAmount = price != null && lotSize != null ? price * lotSize : null;
  const allotmentOut = allotmentDate ? asDate(allotmentDate) <= CURRENT_DATE : false;

  return {
    name: cleanText(row.ipo),
    symbol: null,
    slug: slugify(row.ipo),
    exchange: cleanText(row.exchange),
    listing_exchange: cleanText(row.exchange),
    sector: null,
    ipo_type: ipoType(row.exchange),
    status: statusFor(openDate, closeDate, listingDate),
    open_date: openDate,
    close_date: closeDate,
    allotment_date: allotmentDate,
    refund_date: null,
    listing_date: listingDate,
    price_min: price,
    price_max: price,
    issue_price: price,
    face_value: null,
    lot_size: lotSize,
    issue_size: issueSize,
    fresh_issue: null,
    gmp: null,
    listing_price: listingPrice,
    listing_price_open: listingPrice,
    listing_gain_percent: listingGainPercent,
    pe_pre: pe,
    pe_post: null,
    eps_pre: null,
    eps_post: null,
    roce: null,
    ronw: null,
    debt_equity: null,
    pat_margin: null,
    market_cap: null,
    subscription_qib: null,
    subscription_nii: null,
    subscription_rii: null,
    subscription_total: null,
    sub_qib: null,
    sub_nii: null,
    sub_rii: null,
    sub_shni: null,
    sub_bhni: null,
    sub_total: null,
    subscription_updated_at: null,
    qib_quota: null,
    nii_quota: null,
    rii_quota: null,
    employee_reservation: null,
    shareholder_quota: null,
    reservation_qib: null,
    reservation_nii: null,
    reservation_rii: null,
    reservation_employee: null,
    reservation_employee_text: null,
    retail_min_lots: minAmount != null ? 1 : null,
    retail_min_shares: lotSize,
    retail_min_amount: minAmount,
    retail_max_lots: null,
    retail_max_shares: null,
    retail_max_amount: null,
    shni_lots: null,
    shni_shares: null,
    shni_amount: null,
    shni_min_lots: null,
    shni_min_shares: null,
    shni_min_amount: null,
    shni_max_lots: null,
    shni_max_shares: null,
    shni_max_amount: null,
    bhni_lots: null,
    bhni_shares: null,
    bhni_amount: null,
    bhni_min_lots: null,
    bhni_min_shares: null,
    bhni_min_amount: null,
    bhni_max_lots: null,
    bhni_max_shares: null,
    bhni_max_amount: null,
    lead_managers: null,
    registrar: null,
    registrar_phone: null,
    registrar_email: null,
    registrar_website: null,
    drhp_link: null,
    rhp_link: null,
    allotment_link: null,
    website: null,
    company_website: null,
    company_address: null,
    company_phone: null,
    company_email: null,
    logo_url: null,
    description: null,
    about_company: null,
    objectives: null,
    company_strengths: null,
    company_risks: null,
    promoter_holding_pre: null,
    promoter_holding_post: null,
    allotment_status: allotmentOut ? "out" : "pending",
    allotment_out: allotmentOut,
    anchor_investors: null,
    market_maker_shares_offered: null,
    reserved_market_maker: null,
    market_maker_shares: null,
    market_maker_reservation: null,
    created_at: "NOW()",
    updated_at: "NOW()",
  };
}

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const ipoPlatformResearchRows = fs.existsSync(ipoPlatformResearchPath)
  ? JSON.parse(fs.readFileSync(ipoPlatformResearchPath, "utf8"))
  : [];
const ipoPlatformResearchBySlug = new Map(
  ipoPlatformResearchRows
    .filter((row) => row.http_status === 200)
    .map((row) => [row.input_slug, row])
);
const investorGainResearchRows = fs.existsSync(investorGainResearchPath)
  ? JSON.parse(fs.readFileSync(investorGainResearchPath, "utf8"))
  : [];
const investorGainResearchBySlug = new Map(
  investorGainResearchRows
    .filter((row) => row.http_status === 200)
    .map((row) => [row.input_slug, row])
);
const deduped = dedupeRows(source.ipos).filter((row) => !skipNames.has(cleanText(row.ipo)));
const records = deduped.map((row) => {
  const record = buildRecord(row);
  const inputSlug = record.slug;
  const investorGainResearch = investorGainResearchBySlug.get(record.slug);
  const ipoPlatformResearch = ipoPlatformResearchBySlug.get(record.slug);

  if (investorGainResearch) {
    preferResearch(record, investorGainResearch, [
      "name",
      "symbol",
      "exchange",
      "listing_exchange",
      "sector",
      "ipo_type",
      "refund_date",
      "price_min",
      "price_max",
      "issue_price",
      "face_value",
      "lot_size",
      "issue_size",
      "fresh_issue",
      "gmp",
      "listing_price",
      "listing_price_open",
      "listing_gain_percent",
      "pe_pre",
      "pe_post",
      "eps_pre",
      "eps_post",
      "roce",
      "ronw",
      "debt_equity",
      "pat_margin",
      "market_cap",
      "qib_quota",
      "nii_quota",
      "rii_quota",
      "employee_reservation",
      "shareholder_quota",
      "reservation_qib",
      "reservation_nii",
      "reservation_rii",
      "reservation_employee",
      "retail_min_lots",
      "retail_min_shares",
      "retail_min_amount",
      "retail_max_lots",
      "retail_max_shares",
      "retail_max_amount",
      "shni_lots",
      "shni_shares",
      "shni_amount",
      "shni_min_lots",
      "shni_min_shares",
      "shni_min_amount",
      "bhni_lots",
      "bhni_shares",
      "bhni_amount",
      "bhni_min_lots",
      "bhni_min_shares",
      "bhni_min_amount",
      "lead_managers",
      "registrar",
      "registrar_email",
      "drhp_link",
      "rhp_link",
      "allotment_link",
      "website",
      "company_website",
      "company_address",
      "company_phone",
      "company_email",
      "logo_url",
      "description",
      "about_company",
      "objectives",
      "company_strengths",
      "company_risks",
      "promoter_holding_pre",
      "promoter_holding_post",
      "anchor_investors",
      "market_maker_shares_offered",
      "reserved_market_maker",
      "market_maker_shares",
      "market_maker_reservation",
    ]);
  }

  if (ipoPlatformResearch) {
    preferResearch(record, ipoPlatformResearch, [
      "name",
      "sector",
      "lead_managers",
      "registrar",
      "drhp_link",
      "rhp_link",
      "about_company",
      "objectives",
      "company_strengths",
      "company_risks",
      "promoter_holding_pre",
      "promoter_holding_post",
    ], true);

    preferResearch(record, ipoPlatformResearch, [
      "face_value",
      "fresh_issue",
      "market_cap",
      "pe_pre",
      "roce",
      "debt_equity",
      "pat_margin",
    ], true);

    const researchIpoType = normalizeResearchIpoType(ipoPlatformResearch.ipo_type);
    if (researchIpoType) record.ipo_type = researchIpoType;
  }

  const verifiedOverride = verifiedOverridesByInputSlug.get(inputSlug);
  if (verifiedOverride) {
    Object.assign(record, verifiedOverride);
  }

  fillStructuredNarratives(record);
  sanitizeNarrativeFields(record);

  return record;
}).sort((a, b) => {
  const ad = a.open_date ?? "";
  const bd = b.open_date ?? "";
  return ad.localeCompare(bd) || a.name.localeCompare(b.name);
});

const researchCoverage = records.reduce(
  (acc, record) => {
    if (investorGainResearchBySlug.has(record.slug)) acc.investorGainMatched += 1;
    if (ipoPlatformResearchBySlug.has(record.slug)) acc.ipoPlatformMatched += 1;
    if (record.sector != null) acc.sector += 1;
    if (record.lead_managers != null) acc.leadManagers += 1;
    if (record.registrar != null) acc.registrar += 1;
    if (record.drhp_link != null) acc.drhp += 1;
    if (record.rhp_link != null) acc.rhp += 1;
    if (record.about_company != null) acc.aboutCompany += 1;
    if (record.objectives != null) acc.objectives += 1;
    return acc;
  },
  {
    investorGainMatched: 0,
    ipoPlatformMatched: 0,
    sector: 0,
    leadManagers: 0,
    registrar: 0,
    drhp: 0,
    rhp: 0,
    aboutCompany: 0,
    objectives: 0,
  }
);

const updateColumns = columns.filter((column) => !["slug", "created_at"].includes(column));
const sqlText = `-- IPOCraft: Missing 2026 IPO upserts from ipo_extract_2026_investorgain.json
-- Generated by scripts/generate-2026-investorgain-sql.mjs on 2026-08-11.
-- Primary source: local InvestorGain extraction file (${source.source_file}, ${source.total_rows} raw rows).
-- Enrichment sources: InvestorGain detail pages (${researchCoverage.investorGainMatched}/${records.length} rows) and IPOPlatform detail pages (${researchCoverage.ipoPlatformMatched}/${records.length} rows).
-- Live Supabase comparison on 2026-08-10: 105 existing IPO rows; ${records.length} missing unique rows emitted here.
-- Important data rule: fields not present in InvestorGain/IPOPlatform sources are intentionally NULL, never placeholder text.
-- Issue sizes marked as "Cr Shares" in the source are not converted to rupee crore without a price band.
-- Narrative fields are paraphrased/generated from structured source facts to avoid copying source wording.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ipos_slug_key'
      AND conrelid = 'public.ipos'::regclass
  ) THEN
    ALTER TABLE public.ipos ADD CONSTRAINT ipos_slug_key UNIQUE (slug);
  END IF;
END $$;

INSERT INTO public.ipos (
  ${columns.join(",\n  ")}
) VALUES
${records
  .map((record) => `  (${columns.map((column) => sql(record[column])).join(", ")})`)
  .join(",\n")}
ON CONFLICT (slug) DO UPDATE SET
${updateColumns.map((column) => `  ${column} = EXCLUDED.${column}`).join(",\n")};

COMMIT;
`;

fs.writeFileSync(outputPath, sqlText);

const nullHeavy = records.filter((record) => record.price_max == null || record.issue_size == null);
console.log(
  JSON.stringify(
    {
      outputPath,
      rawRows: source.ipos.length,
      generatedRows: records.length,
      skippedExistingOrDuplicates: source.ipos.length - records.length,
      rowsWithNullPriceOrIssueSize: nullHeavy.length,
      researchCoverage,
    },
    null,
    2
  )
);
