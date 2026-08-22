// =============================================================================
// IPOAlerts API — TypeScript Interfaces
// Base URL: https://api.ipoalerts.in
// Auth: x-api-key header
// =============================================================================

export interface IpoAlertsScheduleItem {
  event: string;
  date: string;
}

export interface IpoAlertsGmpAggregations {
  min: number;
  max: number;
  mean: number;
  median: number;
  mode: number;
}

export interface IpoAlertsGmpSource {
  name: string;
  gmpPrice: number;
}

export interface IpoAlertsGmp {
  lastUpdatedAt?: string;
  aggregations: IpoAlertsGmpAggregations;
  sources: IpoAlertsGmpSource[];
}

export interface IpoAlertsIpo {
  id: string;
  name: string;
  symbol: string;
  slug: string;
  type?: string;           // "EQ" | "SME" | "DEBT"
  startDate?: string;      // YYYY-MM-DD
  endDate?: string;        // YYYY-MM-DD
  listingDate?: string;    // YYYY-MM-DD
  priceRange?: string;     // "95-100"
  listingGain?: string | null;  // "15.5" or "-2"
  minQty?: number;         // lot size
  minAmount?: number;      // minimum investment
  issueSize?: string;      // "192cr"
  status?: string;         // "open" | "closed" | "upcoming" | "listed" | "announced"
  logo?: string;
  prospectusUrl?: string;
  schedule?: IpoAlertsScheduleItem[];
  about?: string;
  strengths?: string[];
  risks?: string[];
  mediaCoverageLinks?: string[];
  nseInfoUrl?: string;
  infoUrl?: string;
  gmp?: IpoAlertsGmp;
}

export interface IpoAlertsMeta {
  count: number;
  countOnPage: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IpoAlertsListResponse {
  meta: IpoAlertsMeta;
  ipos: IpoAlertsIpo[];
}

export interface IpoAlertsDetailResponse {
  ipo: IpoAlertsIpo;
}

// GMP Trends endpoint
export interface IpoAlertsGmpPoint {
  timestamp: string;    // ISO 8601
  price: number | null;
}

export interface IpoAlertsGmpSeriesResponse {
  ipoId: string;
  symbol: string;
  interval: string;
  field: string;
  series: IpoAlertsGmpPoint[];
  meta: {
    from: string;
    to: string;
    count: number;
  };
}

// Enrichment output — only what we extract from IPOAlerts to write to DB
export interface IpoAlertsEnrichmentData {
  symbol: string;
  listing_gain: string | null;
  nse_info_url: string | null;
  media_links: string | null;  // JSON stringified array
  prospectus_url: string | null;
  // Date cross-verification from schedule[]
  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  refund_date: string | null;
  listing_date: string | null;
  lot_size: number | null;
}

export interface QuotaStatus {
  requestsUsedToday: number;
  remaining: number;
  date: string;
}
