export interface RawFinApiGmpTrend {
  date: string;
  gmp?: string | number | null;
  gain?: string | null;
}

export interface RawFinApiSchedule {
  startDate?: string | null;
  endDate?: string | null;
  listingDate?: string | null;
  upiMandateDeadline?: string | null;
  allotmentFinalization?: string | null;
  refundInitiation?: string | null;
  shareCredit?: string | null;
  mandateEndDate?: string | null;
  lockInEndDateAnchor50?: string | null;
  lockInEndDateAnchorRemaining?: string | null;
}

export interface RawFinApiIssueSize {
  totalIssueSize?: string | number | null;
  freshIssue?: string | number | null;
  offerForSale?: string | number | null;
}

export interface RawFinApiSubscriptionCategory {
  reserved?: string | number | null;
  applied?: string | number | null;
  subscription?: string | number | null;
}

export interface RawFinApiSubscriptionNumbers {
  institutional?: RawFinApiSubscriptionCategory | null;
  nii?: RawFinApiSubscriptionCategory | null;
  retail?: RawFinApiSubscriptionCategory | null;
  total?: RawFinApiSubscriptionCategory | null;
}

export interface RawFinApiUtilization {
  capitalExpenditure?: string | null;
  repaymentOfBorrowings?: string | null;
  workingCapital?: string | null;
  generalCorporatePurpose?: string | null;
  [key: string]: string | null | undefined;
}

export interface RawFinApiIpo {
  symbol?: string | null;
  type?: string | null;
  name: string;
  detailsUrl?: string | null;
  logoUrl?: string | null;
  priceRange?: string | null;
  lotSize?: string | number | null;
  status?: string | null;
  schedule?: RawFinApiSchedule | null;
  issueSize?: RawFinApiIssueSize | null;
  aboutCompany?: string | null;
  drhpLink?: string | null;
  rhpLink?: string | null;
  strengths?: string[] | null;
  risks?: string[] | null;
  utilizationOfProceeds?: RawFinApiUtilization | null;
  greyMarketPremium?: {
    gmpSource?: string | null;
    gmpTrends?: RawFinApiGmpTrend[] | null;
  } | null;
  subscriptionNumbers?: RawFinApiSubscriptionNumbers | null;
  exchanges?: string | null;
}

export interface RawFinApiResponse {
  status: string;
  statusCode: number;
  message?: string;
  data: RawFinApiIpo[];
}

export interface RateLimitInfo {
  remainingEndpoint: number | null;
  remainingGlobal: number | null;
  retryAfterSeconds: number | null;
  lastCheckedAt: string | null;
}

export interface NormalizedIpoData {
  symbol: string | null;
  name: string;
  slug: string;
  ipo_type: "Mainboard" | "SME";
  exchange: string | null;
  listing_exchange: string | null;
  status: "Open" | "Upcoming" | "Listed" | "Closed";
  price_min: number | null;
  price_max: number | null;
  lot_size: number | null;
  issue_size: string | null;
  fresh_issue: string | null;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  allotment_date: string | null;
  refund_date: string | null;
  gmp: number | null;
  sub_total: number | null;
  sub_qib: number | null;
  sub_nii: number | null;
  sub_rii: number | null;
  about_company: string | null;
  company_strengths: string | null;
  company_risks: string | null;
  objectives: string | null;
  logo_url: string | null;
  drhp_link: string | null;
  rhp_link: string | null;
  // Deterministic Lot sizes
  retail_min_lots: number | null;
  retail_min_shares: number | null;
  retail_min_amount: number | null;
  retail_max_lots: number | null;
  retail_max_shares: number | null;
  retail_max_amount: number | null;
  shni_min_lots: number | null;
  shni_min_shares: number | null;
  shni_min_amount: number | null;
  shni_max_lots: number | null;
  shni_max_shares: number | null;
  shni_max_amount: number | null;
  bhni_min_lots: number | null;
  bhni_min_shares: number | null;
  bhni_min_amount: number | null;
  // Raw trends for history syncing
  gmpTrends: { gmp: number; dateIso: string }[];
}

export interface SyncOptions {
  syncType?: "all" | "subs" | "gmp" | "quick";
  bypassCache?: boolean;
  status?: string;
  type?: string;
}

export interface SyncTelemetry {
  success: boolean;
  syncType: string;
  totalFetched: number;
  insertedCount: number;
  updatedCount: number;
  gmpPointsCount: number;
  errors: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
  rateLimitRemaining: number | null;
}
