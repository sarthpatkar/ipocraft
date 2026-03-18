"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

const FIELD_ORDER = [
  "name",
  "exchange",
  "sector",
  "ipo_type",
  "status",
  "open_date",
  "close_date",
  "listing_date",
  "price_min",
  "price_max",
  "lot_size",
  "gmp",
  "sub_total",
  "sub_qib",
  "sub_nii",
  "sub_rii",
  "sub_bhni",
  "sub_shni",
  "subscription_updated_at",
  "about_company",
  "objectives",
  "company_strengths",
  "company_risks",
  "promoter_holding_pre",
  "promoter_holding_post",
  "reservation_qib",
  "reservation_nii",
  "reservation_rii",
  "reservation_employee",
  "face_value",
  "issue_size",
  "fresh_issue",
  "anchor_investors",
  "market_maker_shares_offered",
  "reserved_market_maker",
  "retail_min_lots",
  "retail_min_shares",
  "retail_min_amount",
  "retail_max_lots",
  "retail_max_shares",
  "retail_max_amount",
  "shni_min_lots",
  "shni_min_shares",
  "shni_min_amount",
  "shni_max_lots",
  "shni_max_shares",
  "shni_max_amount",
  "bhni_min_lots",
  "bhni_min_shares",
  "bhni_min_amount",
  "bhni_max_lots",
  "bhni_max_shares",
  "bhni_max_amount",
  "lead_managers",
  "registrar",
  "drhp_link",
  "rhp_link",
  "allotment_link",
  "listing_exchange",
  "listing_price",
  "listing_gain_percent",
  "allotment_date",
  "refund_date",
  "allotment_status",
  "eps_pre",
  "eps_post",
  "pe_pre",
  "pe_post",
  "roce",
  "debt_equity",
  "pat_margin",
  "market_cap",
  "company_address",
  "company_phone",
  "company_email",
  "company_website",
  "registrar_phone",
  "registrar_email",
  "registrar_website",
] as const;

type FieldName = (typeof FIELD_ORDER)[number];
type IpoFormState = Record<FieldName, string>;
type IpoType = "mainboard" | "sme";
type IpoStatus = "Open" | "Upcoming" | "Listed" | "Closed";
type AllotmentStatus = "pending" | "out";

const SECTION_CONFIG = [
  {
    id: "essentials",
    title: "Essentials",
    description:
      "Core IPO details for quick publishing and day-to-day admin updates.",
    defaultExpanded: true,
  },
  {
    id: "company_narrative",
    title: "Company Narrative",
    description: "About, objectives, strengths, and risk notes.",
    defaultExpanded: false,
  },
  {
    id: "ownership_reservation",
    title: "Ownership & Reservation",
    description: "Promoter and investor category allocation details.",
    defaultExpanded: false,
  },
  {
    id: "issue_details",
    title: "Issue Details",
    description: "Issue size structure, anchor details, and SME specifics.",
    defaultExpanded: false,
  },
  {
    id: "lot_details",
    title: "Lot Details",
    description: "Retail, SHNI, and BHNI lot table values.",
    defaultExpanded: false,
  },
  {
    id: "listing_allotment",
    title: "Listing, Allotment & Documents",
    description: "Key links, listing stats, and allotment controls.",
    defaultExpanded: false,
  },
  {
    id: "valuation",
    title: "Valuation",
    description: "Pre/post metrics and profitability indicators.",
    defaultExpanded: false,
  },
  {
    id: "contacts",
    title: "Contacts",
    description: "Issuer and registrar communication details.",
    defaultExpanded: false,
  },
] as const;

type SectionId = (typeof SECTION_CONFIG)[number]["id"];
type SectionConfig = (typeof SECTION_CONFIG)[number];

type FieldConfig = {
  name: FieldName;
  label: string;
  placeholder: string;
  section: SectionId;
  readOnly?: boolean;
};

type FocusableField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type IpoSource = Partial<Record<FieldName, unknown>> & {
  id?: string | number | null;
  slug?: string | null;
  gmp?: string | number | null;
};

type AdminFormProps = {
  ipo?: IpoSource | null;
  onClose?: () => void;
};

const FIELD_CONFIGS: FieldConfig[] = [
  { name: "name", label: "Company Name", placeholder: "e.g. ACME Industries Ltd", section: "essentials" },
  { name: "exchange", label: "Exchange", placeholder: "e.g. NSE, BSE", section: "essentials" },
  { name: "sector", label: "Sector", placeholder: "e.g. Financial Services", section: "essentials" },
  { name: "ipo_type", label: "IPO Type", placeholder: "Select IPO type", section: "essentials" },
  { name: "status", label: "Status", placeholder: "Select status", section: "essentials" },
  { name: "open_date", label: "Open Date", placeholder: "Select open date", section: "essentials" },
  { name: "close_date", label: "Close Date", placeholder: "Select close date", section: "essentials" },
  { name: "listing_date", label: "Listing Date", placeholder: "Select listing date", section: "essentials" },
  { name: "price_min", label: "Price Min", placeholder: "e.g. 85", section: "essentials" },
  { name: "price_max", label: "Price Max", placeholder: "e.g. 90", section: "essentials" },
  { name: "lot_size", label: "Lot Size", placeholder: "e.g. 160", section: "essentials" },
  { name: "gmp", label: "GMP", placeholder: "e.g. 22", section: "essentials" },
  { name: "sub_total", label: "Total Subscription (x)", placeholder: "e.g. 23.45", section: "essentials" },
  { name: "sub_qib", label: "QIB Subscription (x)", placeholder: "e.g. 31.20", section: "essentials" },
  { name: "sub_nii", label: "NII Subscription (x)", placeholder: "e.g. 18.40", section: "essentials" },
  { name: "sub_rii", label: "RII Subscription (x)", placeholder: "e.g. 11.32", section: "essentials" },
  { name: "sub_bhni", label: "BHNI Subscription (x)", placeholder: "e.g. 9.75", section: "essentials" },
  { name: "sub_shni", label: "SHNI Subscription (x)", placeholder: "e.g. 14.80", section: "essentials" },
  {
    name: "subscription_updated_at",
    label: "Subscription Last Updated",
    placeholder: "e.g. 2026-03-18 15:30",
    section: "essentials",
  },
  {
    name: "about_company",
    label: "About Company",
    placeholder: "Short company profile and business overview",
    section: "company_narrative",
  },
  {
    name: "objectives",
    label: "Objectives of Issue",
    placeholder: "List key uses of IPO proceeds",
    section: "company_narrative",
  },
  {
    name: "company_strengths",
    label: "Company Strengths",
    placeholder: "Key strengths to highlight",
    section: "company_narrative",
  },
  {
    name: "company_risks",
    label: "Company Risks",
    placeholder: "Major risks and caution points",
    section: "company_narrative",
  },
  {
    name: "promoter_holding_pre",
    label: "Promoter Holding Pre (%)",
    placeholder: "e.g. 74.20",
    section: "ownership_reservation",
  },
  {
    name: "promoter_holding_post",
    label: "Promoter Holding Post (%)",
    placeholder: "e.g. 61.45",
    section: "ownership_reservation",
  },
  { name: "reservation_qib", label: "Reservation QIB (%)", placeholder: "e.g. 50", section: "ownership_reservation" },
  { name: "reservation_nii", label: "Reservation NII (%)", placeholder: "e.g. 15", section: "ownership_reservation" },
  { name: "reservation_rii", label: "Reservation RII (%)", placeholder: "e.g. 35", section: "ownership_reservation" },
  {
    name: "reservation_employee",
    label: "Reservation Employee (%)",
    placeholder: "e.g. 0.50",
    section: "ownership_reservation",
  },
  { name: "face_value", label: "Face Value", placeholder: "e.g. Rs 10 per share", section: "issue_details" },
  { name: "issue_size", label: "Total Issue Size", placeholder: "e.g. Rs 800 Cr", section: "issue_details" },
  { name: "fresh_issue", label: "Fresh Issue", placeholder: "e.g. Rs 500 Cr", section: "issue_details" },
  {
    name: "anchor_investors",
    label: "Anchor Investors",
    placeholder: "Enter anchor investors (comma separated or paragraph)",
    section: "issue_details",
  },
  {
    name: "market_maker_shares_offered",
    label: "Market Maker Shares Offered",
    placeholder: "e.g. 280000",
    section: "issue_details",
  },
  {
    name: "reserved_market_maker",
    label: "Reserved for Market Maker (%)",
    placeholder: "e.g. 5",
    section: "issue_details",
  },
  { name: "retail_min_lots", label: "Retail Min Lots", placeholder: "e.g. 1", section: "lot_details" },
  { name: "retail_min_shares", label: "Retail Min Shares", placeholder: "Auto or manual", section: "lot_details" },
  {
    name: "retail_min_amount",
    label: "Retail Min Amount",
    placeholder: "Auto calculated",
    section: "lot_details",
    readOnly: true,
  },
  { name: "retail_max_lots", label: "Retail Max Lots", placeholder: "e.g. 13", section: "lot_details" },
  { name: "retail_max_shares", label: "Retail Max Shares", placeholder: "Auto or manual", section: "lot_details" },
  {
    name: "retail_max_amount",
    label: "Retail Max Amount",
    placeholder: "Auto calculated",
    section: "lot_details",
    readOnly: true,
  },
  { name: "shni_min_lots", label: "SHNI Min Lots", placeholder: "e.g. 14", section: "lot_details" },
  { name: "shni_min_shares", label: "SHNI Min Shares", placeholder: "Auto or manual", section: "lot_details" },
  {
    name: "shni_min_amount",
    label: "SHNI Min Amount",
    placeholder: "Auto calculated",
    section: "lot_details",
    readOnly: true,
  },
  { name: "shni_max_lots", label: "SHNI Max Lots", placeholder: "e.g. 66", section: "lot_details" },
  { name: "shni_max_shares", label: "SHNI Max Shares", placeholder: "Auto or manual", section: "lot_details" },
  {
    name: "shni_max_amount",
    label: "SHNI Max Amount",
    placeholder: "Auto calculated",
    section: "lot_details",
    readOnly: true,
  },
  { name: "bhni_min_lots", label: "BHNI Min Lots", placeholder: "e.g. 67", section: "lot_details" },
  { name: "bhni_min_shares", label: "BHNI Min Shares", placeholder: "Auto or manual", section: "lot_details" },
  {
    name: "bhni_min_amount",
    label: "BHNI Min Amount",
    placeholder: "Auto calculated",
    section: "lot_details",
    readOnly: true,
  },
  { name: "bhni_max_lots", label: "BHNI Max Lots", placeholder: "e.g. 300", section: "lot_details" },
  { name: "bhni_max_shares", label: "BHNI Max Shares", placeholder: "Auto or manual", section: "lot_details" },
  {
    name: "bhni_max_amount",
    label: "BHNI Max Amount",
    placeholder: "Auto calculated",
    section: "lot_details",
    readOnly: true,
  },
  {
    name: "lead_managers",
    label: "Lead Managers",
    placeholder: "e.g. ICICI Securities, Axis Capital",
    section: "listing_allotment",
  },
  { name: "registrar", label: "Registrar", placeholder: "e.g. Link Intime India Pvt Ltd", section: "listing_allotment" },
  { name: "drhp_link", label: "DRHP Link", placeholder: "https://...", section: "listing_allotment" },
  { name: "rhp_link", label: "RHP Link", placeholder: "https://...", section: "listing_allotment" },
  {
    name: "allotment_link",
    label: "Allotment Status Link",
    placeholder: "https://...",
    section: "listing_allotment",
  },
  {
    name: "listing_exchange",
    label: "Listing Exchange",
    placeholder: "e.g. NSE, BSE",
    section: "listing_allotment",
  },
  { name: "listing_price", label: "Listing Price", placeholder: "e.g. 112", section: "listing_allotment" },
  {
    name: "listing_gain_percent",
    label: "Listing Gain (%)",
    placeholder: "e.g. 18.34",
    section: "listing_allotment",
  },
  { name: "allotment_date", label: "Allotment Date", placeholder: "Select allotment date", section: "listing_allotment" },
  { name: "refund_date", label: "Refund Date", placeholder: "Select refund date", section: "listing_allotment" },
  { name: "allotment_status", label: "Allotment Status", placeholder: "Select status", section: "listing_allotment" },
  { name: "eps_pre", label: "EPS Pre IPO", placeholder: "e.g. 6.8", section: "valuation" },
  { name: "eps_post", label: "EPS Post IPO", placeholder: "e.g. 5.2", section: "valuation" },
  { name: "pe_pre", label: "PE Pre IPO", placeholder: "e.g. 13.1", section: "valuation" },
  { name: "pe_post", label: "PE Post IPO", placeholder: "e.g. 17.2", section: "valuation" },
  { name: "roce", label: "ROCE (%)", placeholder: "e.g. 19.6", section: "valuation" },
  { name: "debt_equity", label: "Debt / Equity", placeholder: "e.g. 0.42", section: "valuation" },
  { name: "pat_margin", label: "PAT Margin (%)", placeholder: "e.g. 12.8", section: "valuation" },
  { name: "market_cap", label: "Market Cap (Cr)", placeholder: "e.g. 4200", section: "valuation" },
  {
    name: "company_address",
    label: "Company Address",
    placeholder: "Registered office address",
    section: "contacts",
  },
  { name: "company_phone", label: "Company Phone", placeholder: "+91-22-1234-5678", section: "contacts" },
  { name: "company_email", label: "Company Email", placeholder: "investor@company.com", section: "contacts" },
  { name: "company_website", label: "Company Website", placeholder: "https://company.com", section: "contacts" },
  { name: "registrar_phone", label: "Registrar Phone", placeholder: "+91-22-8765-4321", section: "contacts" },
  {
    name: "registrar_email",
    label: "Registrar Email",
    placeholder: "support@registrar.com",
    section: "contacts",
  },
  {
    name: "registrar_website",
    label: "Registrar Website",
    placeholder: "https://registrar.com",
    section: "contacts",
  },
];

const FIELD_CONFIG_BY_NAME = FIELD_CONFIGS.reduce((acc, field) => {
  acc[field.name] = field;
  return acc;
}, {} as Record<FieldName, FieldConfig>);

const FIELD_NAME_SET = new Set<string>(FIELD_ORDER);

function isFieldName(value: string | null | undefined): value is FieldName {
  return Boolean(value && FIELD_NAME_SET.has(value));
}

function toNullableText(value: unknown) {
  if (value === null || value === undefined) return null;

  const str = String(value);
  const trimmed = str.trim();

  return trimmed ? trimmed : null;
}

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function formatINR(value: unknown) {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function readText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function normalizeIpoType(value: unknown): IpoType {
  return String(value).toLowerCase() === "sme" ? "sme" : "mainboard";
}

function normalizeStatus(value: unknown): IpoStatus | "" {
  const normalized = String(value || "").trim();
  if (normalized === "Open") return "Open";
  if (normalized === "Upcoming") return "Upcoming";
  if (normalized === "Listed") return "Listed";
  if (normalized === "Closed") return "Closed";
  return "";
}

function normalizeAllotmentStatus(value: unknown): AllotmentStatus | "" {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "out") return "out";
  if (normalized === "pending") return "pending";
  return "";
}

function buildInitialForm(ipo?: IpoSource | null): IpoFormState {
  const source = (ipo ?? {}) as Partial<Record<FieldName, unknown>>;

  return {
    name: readText(source.name),
    exchange: readText(source.exchange),
    sector: readText(source.sector),
    ipo_type: normalizeIpoType(source.ipo_type),
    listing_date: readText(source.listing_date),
    price_min: readText(source.price_min),
    price_max: readText(source.price_max),
    open_date: readText(source.open_date),
    close_date: readText(source.close_date),
    gmp: readText(source.gmp),
    sub_total: readText(source.sub_total),
    sub_qib: readText(source.sub_qib),
    sub_nii: readText(source.sub_nii),
    sub_rii: readText(source.sub_rii),
    sub_bhni: readText(source.sub_bhni),
    sub_shni: readText(source.sub_shni),
    subscription_updated_at: readText(source.subscription_updated_at),
    lot_size: readText(source.lot_size),
    status: normalizeStatus(source.status),
    about_company: readText(source.about_company),
    objectives: readText(source.objectives),
    company_strengths: readText(source.company_strengths),
    company_risks: readText(source.company_risks),
    promoter_holding_pre: readText(source.promoter_holding_pre),
    promoter_holding_post: readText(source.promoter_holding_post),
    reservation_qib: readText(source.reservation_qib),
    reservation_nii: readText(source.reservation_nii),
    reservation_rii: readText(source.reservation_rii),
    reservation_employee: readText(source.reservation_employee),
    lead_managers: readText(source.lead_managers),
    registrar: readText(source.registrar),
    drhp_link: readText(source.drhp_link),
    rhp_link: readText(source.rhp_link),
    allotment_link: readText(source.allotment_link),
    listing_exchange: readText(source.listing_exchange),
    listing_price: readText(source.listing_price),
    listing_gain_percent: readText(source.listing_gain_percent),
    allotment_date: readText(source.allotment_date),
    refund_date: readText(source.refund_date),
    allotment_status: normalizeAllotmentStatus(source.allotment_status),

    face_value: readText(source.face_value),
    issue_size: readText(source.issue_size),
    fresh_issue: readText(source.fresh_issue),
    anchor_investors: readText(source.anchor_investors),
    market_maker_shares_offered: readText(source.market_maker_shares_offered),
    reserved_market_maker: readText(source.reserved_market_maker),

    retail_min_lots: readText(source.retail_min_lots),
    retail_min_shares: readText(source.retail_min_shares),
    retail_min_amount: readText(source.retail_min_amount),
    retail_max_lots: readText(source.retail_max_lots),
    retail_max_shares: readText(source.retail_max_shares),
    retail_max_amount: readText(source.retail_max_amount),
    shni_min_lots: readText(source.shni_min_lots),
    shni_min_shares: readText(source.shni_min_shares),
    shni_min_amount: readText(source.shni_min_amount),
    shni_max_lots: readText(source.shni_max_lots),
    shni_max_shares: readText(source.shni_max_shares),
    shni_max_amount: readText(source.shni_max_amount),

    bhni_min_lots: readText(source.bhni_min_lots),
    bhni_min_shares: readText(source.bhni_min_shares),
    bhni_min_amount: readText(source.bhni_min_amount),
    bhni_max_lots: readText(source.bhni_max_lots),
    bhni_max_shares: readText(source.bhni_max_shares),
    bhni_max_amount: readText(source.bhni_max_amount),

    eps_pre: readText(source.eps_pre),
    eps_post: readText(source.eps_post),
    pe_pre: readText(source.pe_pre),
    pe_post: readText(source.pe_post),
    roce: readText(source.roce),
    debt_equity: readText(source.debt_equity),
    pat_margin: readText(source.pat_margin),
    market_cap: readText(source.market_cap),

    company_address: readText(source.company_address),
    company_phone: readText(source.company_phone),
    company_email: readText(source.company_email),
    company_website: readText(source.company_website),
    registrar_phone: readText(source.registrar_phone),
    registrar_email: readText(source.registrar_email),
    registrar_website: readText(source.registrar_website),
  };
}

const INPUT_CLASS =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/15";
const LABEL_CLASS = "text-xs font-semibold uppercase tracking-wide text-slate-600";
const HINT_CLASS = "text-xs text-slate-500";

function isEditableElement(element: HTMLElement | null) {
  if (!element) return false;
  const tagName = element.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }
  return element.isContentEditable;
}

function SectionCard({
  section,
  expanded,
  onToggle,
  children,
}: {
  section: SectionConfig;
  expanded: boolean;
  onToggle: (id: SectionId) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(section.id)}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left"
        aria-expanded={expanded}
        aria-controls={`${section.id}-panel`}
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
          <p className="text-xs text-slate-500">{section.description}</p>
        </div>
        <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {expanded ? "Hide" : "Show"}
        </span>
      </button>

      {expanded && (
        <div id={`${section.id}-panel`} className="border-t border-slate-200 p-4">
          {children}
        </div>
      )}
    </section>
  );
}

function FieldLabel({
  name,
  helper,
  children,
}: {
  name: FieldName;
  helper?: string;
  children: React.ReactNode;
}) {
  const config = FIELD_CONFIG_BY_NAME[name];

  return (
    <label htmlFor={name} className="flex flex-col gap-1.5">
      <span className={LABEL_CLASS}>{config.label}</span>
      {children}
      {helper && <span className={HINT_CLASS}>{helper}</span>}
    </label>
  );
}

export default function AdminForm({ ipo, onClose }: AdminFormProps) {
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [jumpQuery, setJumpQuery] = useState("");
  const [jumpOpen, setJumpOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>(
    () =>
      SECTION_CONFIG.reduce(
        (acc, section) => {
          acc[section.id] = section.defaultExpanded;
          return acc;
        },
        {} as Record<SectionId, boolean>
      )
  );

  const [form, setForm] = useState<IpoFormState>(() => buildInitialForm(ipo));

  const formRef = useRef<HTMLFormElement | null>(null);
  const jumpInputRef = useRef<HTMLInputElement | null>(null);
  const fieldRefs = useRef<Partial<Record<FieldName, FocusableField | null>>>({});

  const registerFieldRef = useCallback(
    (name: FieldName) => (element: FocusableField | null) => {
      fieldRefs.current[name] = element;
    },
    []
  );

  const visibleTraversalFields = useMemo(
    () =>
      FIELD_ORDER.filter((name) => {
        if (
          (name === "market_maker_shares_offered" ||
            name === "reserved_market_maker") &&
          form.ipo_type !== "sme"
        ) {
          return false;
        }

        return !FIELD_CONFIG_BY_NAME[name].readOnly;
      }),
    [form.ipo_type]
  );

  const jumpOptions = useMemo(() => {
    const q = jumpQuery.trim().toLowerCase();

    const all = visibleTraversalFields.map((name) => {
      const config = FIELD_CONFIG_BY_NAME[name];
      return {
        name,
        label: config.label,
        placeholder: config.placeholder,
      };
    });

    if (!q) return all.slice(0, 8);

    return all
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.placeholder.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [jumpQuery, visibleTraversalFields]);

  const focusField = useCallback((name: FieldName) => {
    const fieldConfig = FIELD_CONFIG_BY_NAME[name];

    setExpandedSections((prev) => {
      if (prev[fieldConfig.section]) return prev;
      return { ...prev, [fieldConfig.section]: true };
    });

    window.setTimeout(() => {
      const element = fieldRefs.current[name];
      if (!element) return;

      element.focus();
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 40);
  }, []);

  const moveFocusByDirection = useCallback(
    (direction: 1 | -1, currentName: FieldName | null) => {
      if (visibleTraversalFields.length === 0) return;

      const currentIndex = currentName
        ? visibleTraversalFields.indexOf(currentName)
        : -1;

      let nextIndex = 0;
      if (currentIndex === -1) {
        nextIndex = direction > 0 ? 0 : visibleTraversalFields.length - 1;
      } else {
        nextIndex = Math.min(
          visibleTraversalFields.length - 1,
          Math.max(0, currentIndex + direction)
        );
      }

      const nextField = visibleTraversalFields[nextIndex];
      if (nextField) focusField(nextField);
    },
    [focusField, visibleTraversalFields]
  );

  const jumpToField = useCallback(
    (query: string) => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return;

      const exactMatch = visibleTraversalFields.find((fieldName) => {
        const label = FIELD_CONFIG_BY_NAME[fieldName].label.toLowerCase();
        return label === normalized;
      });

      const partialMatch =
        exactMatch ||
        visibleTraversalFields.find((fieldName) => {
          const config = FIELD_CONFIG_BY_NAME[fieldName];
          return (
            config.label.toLowerCase().includes(normalized) ||
            config.placeholder.toLowerCase().includes(normalized)
          );
        });

      if (partialMatch) {
        focusField(partialMatch);
        setJumpQuery("");
        setJumpOpen(false);
      }
    },
    [focusField, visibleTraversalFields]
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!isFieldName(name)) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const lotSize = Number(form.lot_size);
    const priceMax = Number(form.price_max);

    if (!lotSize || !priceMax) return;

    const calc = (lots: string) => {
      const l = Number(lots);
      if (!l) return { shares: "", amount: "" };
      const shares = l * lotSize;
      const amount = shares * priceMax;
      return { shares: String(shares), amount: String(amount) };
    };

    setForm((prev) => ({
      ...prev,
      retail_min_shares: calc(prev.retail_min_lots).shares,
      retail_min_amount: calc(prev.retail_min_lots).amount,
      retail_max_shares: calc(prev.retail_max_lots).shares,
      retail_max_amount: calc(prev.retail_max_lots).amount,
      shni_min_shares: calc(prev.shni_min_lots).shares,
      shni_min_amount: calc(prev.shni_min_lots).amount,
      shni_max_shares: calc(prev.shni_max_lots).shares,
      shni_max_amount: calc(prev.shni_max_lots).amount,
      bhni_min_shares: calc(prev.bhni_min_lots).shares,
      bhni_min_amount: calc(prev.bhni_min_lots).amount,
      bhni_max_shares: calc(prev.bhni_max_lots).shares,
      bhni_max_amount: calc(prev.bhni_max_lots).amount,
    }));
  }, [
    form.lot_size,
    form.price_max,
    form.retail_min_lots,
    form.retail_max_lots,
    form.shni_min_lots,
    form.shni_max_lots,
    form.bhni_min_lots,
    form.bhni_max_lots,
  ]);

  const generateSlug = (name: string) => {
    return (
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") + "-ipo"
    );
  };

  const fetchDetails = async () => {
    if (!form.name.trim()) {
      alert("Enter company name first");
      return;
    }

    try {
      setAutoLoading(true);

      const res = await fetch("/api/fetch-ipo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: form.name }),
      });

      const data = (await res.json()) as {
        logo?: string;
        industry?: string;
        description?: string;
        gmp?: number | string | null;
      };

      if (data.logo) setLogo(data.logo);
      if (data.industry) {
        setForm((prev) => ({ ...prev, sector: data.industry ?? "" }));
      }
      if (data.description) {
        setDescription(data.description);
        setForm((prev) => ({
          ...prev,
          about_company: prev.about_company || data.description || "",
        }));
      }
      if (data.gmp !== undefined && data.gmp !== null) {
        setForm((prev) => ({ ...prev, gmp: String(data.gmp) }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch IPO details");
    } finally {
      setAutoLoading(false);
    }
  };

  const fetchGMP = async () => {
    if (!form.name.trim()) {
      alert("Enter company name first");
      return;
    }

    try {
      setAutoLoading(true);

      const res = await fetch("/api/fetch-gmp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: form.name }),
      });

      const data = (await res.json()) as { gmp?: number | string | null };

      if (data?.gmp !== undefined && data.gmp !== null) {
        setForm((prev) => ({ ...prev, gmp: String(data.gmp) }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch GMP");
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Company name is required");
      return;
    }

    setLoading(true);

    try {
      const gmpValue = toNullableNumber(form.gmp);

      let data: { id?: string | number } | null = null;
      let error: { message?: string } | null = null;

      const payload = {
        name: form.name.trim(),
        slug:
          typeof ipo?.slug === "string" && ipo.slug.trim()
            ? ipo.slug
            : generateSlug(form.name),
        exchange: toNullableText(form.exchange),
        sector: toNullableText(form.sector),
        ipo_type: form.ipo_type || "mainboard",
        listing_date: toNullableText(form.listing_date),
        price_min: toNullableNumber(form.price_min),
        price_max: toNullableNumber(form.price_max),
        open_date: toNullableText(form.open_date),
        close_date: toNullableText(form.close_date),
        gmp: gmpValue,
        sub_total: toNullableNumber(form.sub_total),
        sub_qib: toNullableNumber(form.sub_qib),
        sub_nii: toNullableNumber(form.sub_nii),
        sub_rii: toNullableNumber(form.sub_rii),
        lot_size: toNullableNumber(form.lot_size),
        status: toNullableText(form.status),
        about_company: toNullableText(form.about_company),
        objectives: toNullableText(form.objectives),
        company_strengths: toNullableText(form.company_strengths),
        company_risks: toNullableText(form.company_risks),
        promoter_holding_pre: toNullableNumber(form.promoter_holding_pre),
        promoter_holding_post: toNullableNumber(form.promoter_holding_post),
        reservation_qib: toNullableNumber(form.reservation_qib),
        reservation_nii: toNullableNumber(form.reservation_nii),
        reservation_rii: toNullableNumber(form.reservation_rii),
        reservation_employee: toNullableNumber(form.reservation_employee),
        lead_managers: toNullableText(form.lead_managers),
        registrar: toNullableText(form.registrar),
        drhp_link: toNullableText(form.drhp_link),
        rhp_link: toNullableText(form.rhp_link),
        allotment_link: toNullableText(form.allotment_link),
        listing_exchange: toNullableText(form.listing_exchange),
        listing_price: toNullableNumber(form.listing_price),
        listing_gain_percent: toNullableNumber(form.listing_gain_percent),
        allotment_date: toNullableText(form.allotment_date),
        refund_date: toNullableText(form.refund_date),
        allotment_status: toNullableText(form.allotment_status),
        allotment_out: form.allotment_status === "out" ? true : false,

        face_value: toNullableText(form.face_value),
        issue_size: toNullableText(form.issue_size),
        fresh_issue: toNullableText(form.fresh_issue),
        anchor_investors: toNullableText(form.anchor_investors),
        market_maker_shares_offered:
          form.ipo_type === "sme"
            ? toNullableNumber(form.market_maker_shares_offered)
            : null,
        reserved_market_maker:
          form.ipo_type === "sme"
            ? toNullableNumber(form.reserved_market_maker)
            : null,

        retail_min_lots: toNullableNumber(form.retail_min_lots),
        retail_min_shares: toNullableNumber(form.retail_min_shares),
        retail_min_amount: toNullableNumber(form.retail_min_amount),
        retail_max_lots: toNullableNumber(form.retail_max_lots),
        retail_max_shares: toNullableNumber(form.retail_max_shares),
        retail_max_amount: toNullableNumber(form.retail_max_amount),
        shni_min_lots: toNullableNumber(form.shni_min_lots),
        shni_min_shares: toNullableNumber(form.shni_min_shares),
        shni_min_amount: toNullableNumber(form.shni_min_amount),
        shni_max_lots: toNullableNumber(form.shni_max_lots),
        shni_max_shares: toNullableNumber(form.shni_max_shares),
        shni_max_amount: toNullableNumber(form.shni_max_amount),

        bhni_min_lots: toNullableNumber(form.bhni_min_lots),
        bhni_min_shares: toNullableNumber(form.bhni_min_shares),
        bhni_min_amount: toNullableNumber(form.bhni_min_amount),
        bhni_max_lots: toNullableNumber(form.bhni_max_lots),
        bhni_max_shares: toNullableNumber(form.bhni_max_shares),
        bhni_max_amount: toNullableNumber(form.bhni_max_amount),

        eps_pre: toNullableNumber(form.eps_pre),
        eps_post: toNullableNumber(form.eps_post),
        pe_pre: toNullableNumber(form.pe_pre),
        pe_post: toNullableNumber(form.pe_post),
        roce: toNullableNumber(form.roce),
        debt_equity: toNullableNumber(form.debt_equity),
        pat_margin: toNullableNumber(form.pat_margin),
        market_cap: toNullableNumber(form.market_cap),

        company_address: toNullableText(form.company_address),
        company_phone: toNullableText(form.company_phone),
        company_email: toNullableText(form.company_email),
        company_website: toNullableText(form.company_website),
        registrar_phone: toNullableText(form.registrar_phone),
        registrar_email: toNullableText(form.registrar_email),
        registrar_website: toNullableText(form.registrar_website),

        sub_bhni: toNullableNumber(form.sub_bhni),
        sub_shni: toNullableNumber(form.sub_shni),
        subscription_updated_at: toNullableText(form.subscription_updated_at),
      };

      const ipoId = ipo?.id;

      if (ipoId !== null && ipoId !== undefined) {
        const res = await supabase
          .from("ipos")
          .update(payload)
          .eq("id", ipoId)
          .select()
          .single();
        data = (res.data ?? null) as { id?: string | number } | null;
        error = (res.error ?? null) as { message?: string } | null;
      } else {
        const res = await supabase.from("ipos").insert([payload]).select().single();
        data = (res.data ?? null) as { id?: string | number } | null;
        error = (res.error ?? null) as { message?: string } | null;
      }

      if (error) {
        console.error("SUPABASE ERROR:", error);
        alert(
          (ipoId !== null && ipoId !== undefined
            ? "Error updating IPO: "
            : "Error adding IPO: ") + (error.message || "Unknown error")
        );
        return;
      }

      try {
        const persistedIpoId = data?.id ?? ipoId;

        const newGmp = gmpValue;
        const oldGmp = ipo?.gmp ?? null;

        if (persistedIpoId && newGmp !== null && Number(newGmp) !== Number(oldGmp)) {
          const { error: historyError } = await supabase.from("gmp_history").insert({
            ipo_id: persistedIpoId,
            gmp: Number(newGmp),
          });

          if (historyError) {
            console.warn("GMP history insert failed:", historyError);
          }
        }
      } catch (err) {
        console.warn("GMP history exception:", err);
      }

      alert(ipoId !== null && ipoId !== undefined ? "IPO Updated ✅" : "IPO Added ✅");
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(ipo?.id ? "Error updating IPO" : "Error adding IPO");
    } finally {
      setLoading(false);
    }
  };

  const handleFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    const modifierPressed = e.ctrlKey || e.metaKey;

    if (modifierPressed && e.key.toLowerCase() === "s") {
      e.preventDefault();
      formRef.current?.requestSubmit();
      return;
    }

    if (
      modifierPressed &&
      (e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp")
    ) {
      e.preventDefault();

      const target = e.target as HTMLElement | null;
      const currentName = isFieldName(target?.getAttribute("name"))
        ? (target?.getAttribute("name") as FieldName)
        : null;

      const direction = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
      moveFocusByDirection(direction, currentName);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
      return;
    }

    if (
      e.key === "/" &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !isEditableElement(e.target as HTMLElement | null)
    ) {
      e.preventDefault();
      jumpInputRef.current?.focus();
      jumpInputRef.current?.select();
    }
  };

  const toggleSection = (id: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const amountInputClass = `${INPUT_CLASS} bg-slate-100 text-slate-500`;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleFormKeyDown}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <label htmlFor="field-jump" className={`${LABEL_CLASS} mb-1 block`}>
              Field Jump
            </label>
            <input
              id="field-jump"
              ref={jumpInputRef}
              value={jumpQuery}
              onFocus={() => setJumpOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setJumpOpen(false), 120);
              }}
              onChange={(e) => {
                setJumpQuery(e.target.value);
                setJumpOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  jumpToField(jumpQuery);
                }
              }}
              placeholder="Press / then type field name"
              className={INPUT_CLASS}
              autoComplete="off"
            />
            {jumpOpen && jumpOptions.length > 0 && (
              <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                {jumpOptions.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      focusField(item.name);
                      setJumpOpen(false);
                      setJumpQuery("");
                    }}
                    className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.placeholder}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Shortcuts: Ctrl/Cmd + Arrows to move fields, Ctrl/Cmd + S to save, Esc to close, / to jump.
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 px-5 py-4">
        <SectionCard
          section={SECTION_CONFIG[0]}
          expanded={expandedSections.essentials}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldLabel name="name" helper="Required. Used for slug generation on new IPOs.">
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  ref={registerFieldRef("name")}
                  autoFocus
                  placeholder={FIELD_CONFIG_BY_NAME.name.placeholder}
                  className={INPUT_CLASS}
                  required
                />
              </FieldLabel>

              <FieldLabel name="sector">
                <input
                  id="sector"
                  name="sector"
                  value={form.sector}
                  onChange={handleChange}
                  ref={registerFieldRef("sector")}
                  placeholder={FIELD_CONFIG_BY_NAME.sector.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="exchange">
                <input
                  id="exchange"
                  name="exchange"
                  value={form.exchange}
                  onChange={handleChange}
                  ref={registerFieldRef("exchange")}
                  placeholder={FIELD_CONFIG_BY_NAME.exchange.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="ipo_type">
                <select
                  id="ipo_type"
                  name="ipo_type"
                  value={form.ipo_type}
                  onChange={handleChange}
                  ref={registerFieldRef("ipo_type")}
                  className={INPUT_CLASS}
                >
                  <option value="mainboard">Mainboard</option>
                  <option value="sme">SME</option>
                </select>
              </FieldLabel>

              <FieldLabel name="status">
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  ref={registerFieldRef("status")}
                  className={INPUT_CLASS}
                >
                  <option value="">Select status</option>
                  <option value="Open">Open</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Listed">Listed</option>
                  <option value="Closed">Closed</option>
                </select>
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="open_date">
                <input
                  id="open_date"
                  name="open_date"
                  type="date"
                  value={form.open_date}
                  onChange={handleChange}
                  ref={registerFieldRef("open_date")}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="close_date">
                <input
                  id="close_date"
                  name="close_date"
                  type="date"
                  value={form.close_date}
                  onChange={handleChange}
                  ref={registerFieldRef("close_date")}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="listing_date">
                <input
                  id="listing_date"
                  name="listing_date"
                  type="date"
                  value={form.listing_date}
                  onChange={handleChange}
                  ref={registerFieldRef("listing_date")}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="price_min">
                <input
                  id="price_min"
                  name="price_min"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.price_min}
                  onChange={handleChange}
                  ref={registerFieldRef("price_min")}
                  placeholder={FIELD_CONFIG_BY_NAME.price_min.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="price_max">
                <input
                  id="price_max"
                  name="price_max"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.price_max}
                  onChange={handleChange}
                  ref={registerFieldRef("price_max")}
                  placeholder={FIELD_CONFIG_BY_NAME.price_max.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="lot_size" helper="Used in lot amount auto-calculation.">
                <input
                  id="lot_size"
                  name="lot_size"
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={form.lot_size}
                  onChange={handleChange}
                  ref={registerFieldRef("lot_size")}
                  placeholder={FIELD_CONFIG_BY_NAME.lot_size.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <FieldLabel name="gmp">
                <input
                  id="gmp"
                  name="gmp"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.gmp}
                  onChange={handleChange}
                  ref={registerFieldRef("gmp")}
                  placeholder={FIELD_CONFIG_BY_NAME.gmp.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="sub_total">
                <input
                  id="sub_total"
                  name="sub_total"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.sub_total}
                  onChange={handleChange}
                  ref={registerFieldRef("sub_total")}
                  placeholder={FIELD_CONFIG_BY_NAME.sub_total.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="sub_qib">
                <input
                  id="sub_qib"
                  name="sub_qib"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.sub_qib}
                  onChange={handleChange}
                  ref={registerFieldRef("sub_qib")}
                  placeholder={FIELD_CONFIG_BY_NAME.sub_qib.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="sub_nii">
                <input
                  id="sub_nii"
                  name="sub_nii"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.sub_nii}
                  onChange={handleChange}
                  ref={registerFieldRef("sub_nii")}
                  placeholder={FIELD_CONFIG_BY_NAME.sub_nii.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <FieldLabel name="sub_rii">
                <input
                  id="sub_rii"
                  name="sub_rii"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.sub_rii}
                  onChange={handleChange}
                  ref={registerFieldRef("sub_rii")}
                  placeholder={FIELD_CONFIG_BY_NAME.sub_rii.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="sub_bhni">
                <input
                  id="sub_bhni"
                  name="sub_bhni"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.sub_bhni}
                  onChange={handleChange}
                  ref={registerFieldRef("sub_bhni")}
                  placeholder={FIELD_CONFIG_BY_NAME.sub_bhni.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="sub_shni">
                <input
                  id="sub_shni"
                  name="sub_shni"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.sub_shni}
                  onChange={handleChange}
                  ref={registerFieldRef("sub_shni")}
                  placeholder={FIELD_CONFIG_BY_NAME.sub_shni.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel
                name="subscription_updated_at"
                helper="Use your preferred timestamp format."
              >
                <input
                  id="subscription_updated_at"
                  name="subscription_updated_at"
                  value={form.subscription_updated_at}
                  onChange={handleChange}
                  ref={registerFieldRef("subscription_updated_at")}
                  placeholder={FIELD_CONFIG_BY_NAME.subscription_updated_at.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            {(logo || description) && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Auto Fetch Preview
                </p>
                <div className="flex items-start gap-3">
                  {logo && (
                    <img
                      src={logo}
                      alt="Company logo"
                      className="h-12 w-12 rounded border border-slate-200 object-contain bg-white"
                    />
                  )}
                  {description && <p className="text-sm text-slate-700">{description}</p>}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[1]}
          expanded={expandedSections.company_narrative}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <FieldLabel name="about_company">
              <textarea
                id="about_company"
                name="about_company"
                value={form.about_company}
                onChange={handleChange}
                ref={registerFieldRef("about_company")}
                placeholder={FIELD_CONFIG_BY_NAME.about_company.placeholder}
                className={`${INPUT_CLASS} min-h-28`}
              />
            </FieldLabel>

            <FieldLabel name="objectives">
              <textarea
                id="objectives"
                name="objectives"
                value={form.objectives}
                onChange={handleChange}
                ref={registerFieldRef("objectives")}
                placeholder={FIELD_CONFIG_BY_NAME.objectives.placeholder}
                className={`${INPUT_CLASS} min-h-28`}
              />
            </FieldLabel>

            <FieldLabel name="company_strengths">
              <textarea
                id="company_strengths"
                name="company_strengths"
                value={form.company_strengths}
                onChange={handleChange}
                ref={registerFieldRef("company_strengths")}
                placeholder={FIELD_CONFIG_BY_NAME.company_strengths.placeholder}
                className={`${INPUT_CLASS} min-h-24`}
              />
            </FieldLabel>

            <FieldLabel name="company_risks">
              <textarea
                id="company_risks"
                name="company_risks"
                value={form.company_risks}
                onChange={handleChange}
                ref={registerFieldRef("company_risks")}
                placeholder={FIELD_CONFIG_BY_NAME.company_risks.placeholder}
                className={`${INPUT_CLASS} min-h-24`}
              />
            </FieldLabel>
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[2]}
          expanded={expandedSections.ownership_reservation}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <FieldLabel name="promoter_holding_pre">
              <input
                id="promoter_holding_pre"
                name="promoter_holding_pre"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.promoter_holding_pre}
                onChange={handleChange}
                ref={registerFieldRef("promoter_holding_pre")}
                placeholder={FIELD_CONFIG_BY_NAME.promoter_holding_pre.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="promoter_holding_post">
              <input
                id="promoter_holding_post"
                name="promoter_holding_post"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.promoter_holding_post}
                onChange={handleChange}
                ref={registerFieldRef("promoter_holding_post")}
                placeholder={FIELD_CONFIG_BY_NAME.promoter_holding_post.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="reservation_qib">
              <input
                id="reservation_qib"
                name="reservation_qib"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.reservation_qib}
                onChange={handleChange}
                ref={registerFieldRef("reservation_qib")}
                placeholder={FIELD_CONFIG_BY_NAME.reservation_qib.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="reservation_nii">
              <input
                id="reservation_nii"
                name="reservation_nii"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.reservation_nii}
                onChange={handleChange}
                ref={registerFieldRef("reservation_nii")}
                placeholder={FIELD_CONFIG_BY_NAME.reservation_nii.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="reservation_rii">
              <input
                id="reservation_rii"
                name="reservation_rii"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.reservation_rii}
                onChange={handleChange}
                ref={registerFieldRef("reservation_rii")}
                placeholder={FIELD_CONFIG_BY_NAME.reservation_rii.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="reservation_employee">
              <input
                id="reservation_employee"
                name="reservation_employee"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.reservation_employee}
                onChange={handleChange}
                ref={registerFieldRef("reservation_employee")}
                placeholder={FIELD_CONFIG_BY_NAME.reservation_employee.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[3]}
          expanded={expandedSections.issue_details}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="face_value">
                <input
                  id="face_value"
                  name="face_value"
                  value={form.face_value}
                  onChange={handleChange}
                  ref={registerFieldRef("face_value")}
                  placeholder={FIELD_CONFIG_BY_NAME.face_value.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="issue_size">
                <input
                  id="issue_size"
                  name="issue_size"
                  value={form.issue_size}
                  onChange={handleChange}
                  ref={registerFieldRef("issue_size")}
                  placeholder={FIELD_CONFIG_BY_NAME.issue_size.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="fresh_issue">
                <input
                  id="fresh_issue"
                  name="fresh_issue"
                  value={form.fresh_issue}
                  onChange={handleChange}
                  ref={registerFieldRef("fresh_issue")}
                  placeholder={FIELD_CONFIG_BY_NAME.fresh_issue.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <FieldLabel name="anchor_investors">
              <textarea
                id="anchor_investors"
                name="anchor_investors"
                value={form.anchor_investors}
                onChange={handleChange}
                ref={registerFieldRef("anchor_investors")}
                placeholder={FIELD_CONFIG_BY_NAME.anchor_investors.placeholder}
                className={`${INPUT_CLASS} min-h-24`}
              />
            </FieldLabel>

            {form.ipo_type === "sme" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FieldLabel
                  name="market_maker_shares_offered"
                  helper="Shown only for SME IPOs."
                >
                  <input
                    id="market_maker_shares_offered"
                    name="market_maker_shares_offered"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.market_maker_shares_offered}
                    onChange={handleChange}
                    ref={registerFieldRef("market_maker_shares_offered")}
                    placeholder={FIELD_CONFIG_BY_NAME.market_maker_shares_offered.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="reserved_market_maker">
                  <input
                    id="reserved_market_maker"
                    name="reserved_market_maker"
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={form.reserved_market_maker}
                    onChange={handleChange}
                    ref={registerFieldRef("reserved_market_maker")}
                    placeholder={FIELD_CONFIG_BY_NAME.reserved_market_maker.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[4]}
          expanded={expandedSections.lot_details}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <p className={HINT_CLASS}>
              Amount fields are computed automatically from lots, lot size, and price max.
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">Retail</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FieldLabel name="retail_min_lots">
                  <input
                    id="retail_min_lots"
                    name="retail_min_lots"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.retail_min_lots}
                    onChange={handleChange}
                    ref={registerFieldRef("retail_min_lots")}
                    placeholder={FIELD_CONFIG_BY_NAME.retail_min_lots.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="retail_min_shares">
                  <input
                    id="retail_min_shares"
                    name="retail_min_shares"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.retail_min_shares}
                    onChange={handleChange}
                    ref={registerFieldRef("retail_min_shares")}
                    placeholder={FIELD_CONFIG_BY_NAME.retail_min_shares.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="retail_min_amount" helper={formatINR(form.retail_min_amount)}>
                  <input
                    id="retail_min_amount"
                    name="retail_min_amount"
                    value={form.retail_min_amount}
                    readOnly
                    tabIndex={-1}
                    ref={registerFieldRef("retail_min_amount")}
                    placeholder={FIELD_CONFIG_BY_NAME.retail_min_amount.placeholder}
                    className={amountInputClass}
                  />
                </FieldLabel>

                <FieldLabel name="retail_max_lots">
                  <input
                    id="retail_max_lots"
                    name="retail_max_lots"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.retail_max_lots}
                    onChange={handleChange}
                    ref={registerFieldRef("retail_max_lots")}
                    placeholder={FIELD_CONFIG_BY_NAME.retail_max_lots.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="retail_max_shares">
                  <input
                    id="retail_max_shares"
                    name="retail_max_shares"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.retail_max_shares}
                    onChange={handleChange}
                    ref={registerFieldRef("retail_max_shares")}
                    placeholder={FIELD_CONFIG_BY_NAME.retail_max_shares.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="retail_max_amount" helper={formatINR(form.retail_max_amount)}>
                  <input
                    id="retail_max_amount"
                    name="retail_max_amount"
                    value={form.retail_max_amount}
                    readOnly
                    tabIndex={-1}
                    ref={registerFieldRef("retail_max_amount")}
                    placeholder={FIELD_CONFIG_BY_NAME.retail_max_amount.placeholder}
                    className={amountInputClass}
                  />
                </FieldLabel>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">SHNI</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FieldLabel name="shni_min_lots">
                  <input
                    id="shni_min_lots"
                    name="shni_min_lots"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.shni_min_lots}
                    onChange={handleChange}
                    ref={registerFieldRef("shni_min_lots")}
                    placeholder={FIELD_CONFIG_BY_NAME.shni_min_lots.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="shni_min_shares">
                  <input
                    id="shni_min_shares"
                    name="shni_min_shares"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.shni_min_shares}
                    onChange={handleChange}
                    ref={registerFieldRef("shni_min_shares")}
                    placeholder={FIELD_CONFIG_BY_NAME.shni_min_shares.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="shni_min_amount" helper={formatINR(form.shni_min_amount)}>
                  <input
                    id="shni_min_amount"
                    name="shni_min_amount"
                    value={form.shni_min_amount}
                    readOnly
                    tabIndex={-1}
                    ref={registerFieldRef("shni_min_amount")}
                    placeholder={FIELD_CONFIG_BY_NAME.shni_min_amount.placeholder}
                    className={amountInputClass}
                  />
                </FieldLabel>

                <FieldLabel name="shni_max_lots">
                  <input
                    id="shni_max_lots"
                    name="shni_max_lots"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.shni_max_lots}
                    onChange={handleChange}
                    ref={registerFieldRef("shni_max_lots")}
                    placeholder={FIELD_CONFIG_BY_NAME.shni_max_lots.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="shni_max_shares">
                  <input
                    id="shni_max_shares"
                    name="shni_max_shares"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.shni_max_shares}
                    onChange={handleChange}
                    ref={registerFieldRef("shni_max_shares")}
                    placeholder={FIELD_CONFIG_BY_NAME.shni_max_shares.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="shni_max_amount" helper={formatINR(form.shni_max_amount)}>
                  <input
                    id="shni_max_amount"
                    name="shni_max_amount"
                    value={form.shni_max_amount}
                    readOnly
                    tabIndex={-1}
                    ref={registerFieldRef("shni_max_amount")}
                    placeholder={FIELD_CONFIG_BY_NAME.shni_max_amount.placeholder}
                    className={amountInputClass}
                  />
                </FieldLabel>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">BHNI</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FieldLabel name="bhni_min_lots">
                  <input
                    id="bhni_min_lots"
                    name="bhni_min_lots"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.bhni_min_lots}
                    onChange={handleChange}
                    ref={registerFieldRef("bhni_min_lots")}
                    placeholder={FIELD_CONFIG_BY_NAME.bhni_min_lots.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="bhni_min_shares">
                  <input
                    id="bhni_min_shares"
                    name="bhni_min_shares"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.bhni_min_shares}
                    onChange={handleChange}
                    ref={registerFieldRef("bhni_min_shares")}
                    placeholder={FIELD_CONFIG_BY_NAME.bhni_min_shares.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="bhni_min_amount" helper={formatINR(form.bhni_min_amount)}>
                  <input
                    id="bhni_min_amount"
                    name="bhni_min_amount"
                    value={form.bhni_min_amount}
                    readOnly
                    tabIndex={-1}
                    ref={registerFieldRef("bhni_min_amount")}
                    placeholder={FIELD_CONFIG_BY_NAME.bhni_min_amount.placeholder}
                    className={amountInputClass}
                  />
                </FieldLabel>

                <FieldLabel name="bhni_max_lots">
                  <input
                    id="bhni_max_lots"
                    name="bhni_max_lots"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.bhni_max_lots}
                    onChange={handleChange}
                    ref={registerFieldRef("bhni_max_lots")}
                    placeholder={FIELD_CONFIG_BY_NAME.bhni_max_lots.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="bhni_max_shares">
                  <input
                    id="bhni_max_shares"
                    name="bhni_max_shares"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={form.bhni_max_shares}
                    onChange={handleChange}
                    ref={registerFieldRef("bhni_max_shares")}
                    placeholder={FIELD_CONFIG_BY_NAME.bhni_max_shares.placeholder}
                    className={INPUT_CLASS}
                  />
                </FieldLabel>

                <FieldLabel name="bhni_max_amount" helper={formatINR(form.bhni_max_amount)}>
                  <input
                    id="bhni_max_amount"
                    name="bhni_max_amount"
                    value={form.bhni_max_amount}
                    readOnly
                    tabIndex={-1}
                    ref={registerFieldRef("bhni_max_amount")}
                    placeholder={FIELD_CONFIG_BY_NAME.bhni_max_amount.placeholder}
                    className={amountInputClass}
                  />
                </FieldLabel>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[5]}
          expanded={expandedSections.listing_allotment}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldLabel name="lead_managers">
                <input
                  id="lead_managers"
                  name="lead_managers"
                  value={form.lead_managers}
                  onChange={handleChange}
                  ref={registerFieldRef("lead_managers")}
                  placeholder={FIELD_CONFIG_BY_NAME.lead_managers.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="registrar">
                <input
                  id="registrar"
                  name="registrar"
                  value={form.registrar}
                  onChange={handleChange}
                  ref={registerFieldRef("registrar")}
                  placeholder={FIELD_CONFIG_BY_NAME.registrar.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="drhp_link">
                <input
                  id="drhp_link"
                  name="drhp_link"
                  type="url"
                  value={form.drhp_link}
                  onChange={handleChange}
                  ref={registerFieldRef("drhp_link")}
                  placeholder={FIELD_CONFIG_BY_NAME.drhp_link.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="rhp_link">
                <input
                  id="rhp_link"
                  name="rhp_link"
                  type="url"
                  value={form.rhp_link}
                  onChange={handleChange}
                  ref={registerFieldRef("rhp_link")}
                  placeholder={FIELD_CONFIG_BY_NAME.rhp_link.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel
                name="allotment_link"
                helper='Used for "Check Allotment" button when status is Out.'
              >
                <input
                  id="allotment_link"
                  name="allotment_link"
                  type="url"
                  value={form.allotment_link}
                  onChange={handleChange}
                  ref={registerFieldRef("allotment_link")}
                  placeholder={FIELD_CONFIG_BY_NAME.allotment_link.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="listing_exchange">
                <input
                  id="listing_exchange"
                  name="listing_exchange"
                  value={form.listing_exchange}
                  onChange={handleChange}
                  ref={registerFieldRef("listing_exchange")}
                  placeholder={FIELD_CONFIG_BY_NAME.listing_exchange.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="listing_price">
                <input
                  id="listing_price"
                  name="listing_price"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.listing_price}
                  onChange={handleChange}
                  ref={registerFieldRef("listing_price")}
                  placeholder={FIELD_CONFIG_BY_NAME.listing_price.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="listing_gain_percent">
                <input
                  id="listing_gain_percent"
                  name="listing_gain_percent"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form.listing_gain_percent}
                  onChange={handleChange}
                  ref={registerFieldRef("listing_gain_percent")}
                  placeholder={FIELD_CONFIG_BY_NAME.listing_gain_percent.placeholder}
                  className={INPUT_CLASS}
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldLabel name="allotment_date">
                <input
                  id="allotment_date"
                  name="allotment_date"
                  type="date"
                  value={form.allotment_date}
                  onChange={handleChange}
                  ref={registerFieldRef("allotment_date")}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="refund_date">
                <input
                  id="refund_date"
                  name="refund_date"
                  type="date"
                  value={form.refund_date}
                  onChange={handleChange}
                  ref={registerFieldRef("refund_date")}
                  className={INPUT_CLASS}
                />
              </FieldLabel>

              <FieldLabel name="allotment_status" helper='Set "Out" once registrar publishes results.'>
                <select
                  id="allotment_status"
                  name="allotment_status"
                  value={form.allotment_status || ""}
                  onChange={handleChange}
                  ref={registerFieldRef("allotment_status")}
                  className={INPUT_CLASS}
                >
                  <option value="">Select allotment status</option>
                  <option value="pending">Allotment Awaited</option>
                  <option value="out">Allotment Out</option>
                </select>
              </FieldLabel>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[6]}
          expanded={expandedSections.valuation}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <FieldLabel name="eps_pre">
              <input
                id="eps_pre"
                name="eps_pre"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.eps_pre}
                onChange={handleChange}
                ref={registerFieldRef("eps_pre")}
                placeholder={FIELD_CONFIG_BY_NAME.eps_pre.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="eps_post">
              <input
                id="eps_post"
                name="eps_post"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.eps_post}
                onChange={handleChange}
                ref={registerFieldRef("eps_post")}
                placeholder={FIELD_CONFIG_BY_NAME.eps_post.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="pe_pre">
              <input
                id="pe_pre"
                name="pe_pre"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.pe_pre}
                onChange={handleChange}
                ref={registerFieldRef("pe_pre")}
                placeholder={FIELD_CONFIG_BY_NAME.pe_pre.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="pe_post">
              <input
                id="pe_post"
                name="pe_post"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.pe_post}
                onChange={handleChange}
                ref={registerFieldRef("pe_post")}
                placeholder={FIELD_CONFIG_BY_NAME.pe_post.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="roce">
              <input
                id="roce"
                name="roce"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.roce}
                onChange={handleChange}
                ref={registerFieldRef("roce")}
                placeholder={FIELD_CONFIG_BY_NAME.roce.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="debt_equity">
              <input
                id="debt_equity"
                name="debt_equity"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.debt_equity}
                onChange={handleChange}
                ref={registerFieldRef("debt_equity")}
                placeholder={FIELD_CONFIG_BY_NAME.debt_equity.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="pat_margin">
              <input
                id="pat_margin"
                name="pat_margin"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.pat_margin}
                onChange={handleChange}
                ref={registerFieldRef("pat_margin")}
                placeholder={FIELD_CONFIG_BY_NAME.pat_margin.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="market_cap">
              <input
                id="market_cap"
                name="market_cap"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.market_cap}
                onChange={handleChange}
                ref={registerFieldRef("market_cap")}
                placeholder={FIELD_CONFIG_BY_NAME.market_cap.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>
          </div>
        </SectionCard>

        <SectionCard
          section={SECTION_CONFIG[7]}
          expanded={expandedSections.contacts}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FieldLabel name="company_address">
              <input
                id="company_address"
                name="company_address"
                value={form.company_address}
                onChange={handleChange}
                ref={registerFieldRef("company_address")}
                placeholder={FIELD_CONFIG_BY_NAME.company_address.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="company_phone">
              <input
                id="company_phone"
                name="company_phone"
                type="tel"
                value={form.company_phone}
                onChange={handleChange}
                ref={registerFieldRef("company_phone")}
                placeholder={FIELD_CONFIG_BY_NAME.company_phone.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="company_email">
              <input
                id="company_email"
                name="company_email"
                type="email"
                value={form.company_email}
                onChange={handleChange}
                ref={registerFieldRef("company_email")}
                placeholder={FIELD_CONFIG_BY_NAME.company_email.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="company_website">
              <input
                id="company_website"
                name="company_website"
                type="url"
                value={form.company_website}
                onChange={handleChange}
                ref={registerFieldRef("company_website")}
                placeholder={FIELD_CONFIG_BY_NAME.company_website.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="registrar_phone">
              <input
                id="registrar_phone"
                name="registrar_phone"
                type="tel"
                value={form.registrar_phone}
                onChange={handleChange}
                ref={registerFieldRef("registrar_phone")}
                placeholder={FIELD_CONFIG_BY_NAME.registrar_phone.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="registrar_email">
              <input
                id="registrar_email"
                name="registrar_email"
                type="email"
                value={form.registrar_email}
                onChange={handleChange}
                ref={registerFieldRef("registrar_email")}
                placeholder={FIELD_CONFIG_BY_NAME.registrar_email.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>

            <FieldLabel name="registrar_website">
              <input
                id="registrar_website"
                name="registrar_website"
                type="url"
                value={form.registrar_website}
                onChange={handleChange}
                ref={registerFieldRef("registrar_website")}
                placeholder={FIELD_CONFIG_BY_NAME.registrar_website.placeholder}
                className={INPUT_CLASS}
              />
            </FieldLabel>
          </div>
        </SectionCard>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            Save with Ctrl/Cmd + S. Cancel closes this modal without persisting.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchDetails}
              disabled={autoLoading}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {autoLoading ? "Fetching..." : "Auto Fetch"}
            </button>

            <button
              type="button"
              onClick={fetchGMP}
              disabled={autoLoading}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {autoLoading ? "Fetching..." : "Fetch GMP"}
            </button>

            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {loading
                ? ipo?.id
                  ? "Updating..."
                  : "Adding..."
                : ipo?.id
                ? "Update IPO"
                : "Add IPO"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
