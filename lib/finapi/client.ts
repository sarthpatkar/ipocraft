import type {
  RawFinApiIpo,
  RawFinApiResponse,
  RateLimitInfo,
} from "./types";

const DEFAULT_BASE_URL = "https://finapi.upvaly.com";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

interface CacheEntry {
  data: RawFinApiIpo[];
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

let latestRateLimit: RateLimitInfo = {
  remainingEndpoint: null,
  remainingGlobal: null,
  retryAfterSeconds: null,
  lastCheckedAt: null,
};

function getApiKey(): string {
  // Enforce server-side execution
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY ERROR: FinAPI client can only be called from server-side code. Never expose API key to frontend."
    );
  }

  const apiKey =
    process.env.FINAPI_API_KEY ||
    process.env.FINAPI_LIVE_API_KEY ||
    "fna_live_4567811ca39cdfe2-64abc2605a74414b3d62cdd58b75530a45629e8eff70a19a";

  if (!apiKey) {
    throw new Error(
      "Missing FINAPI_API_KEY environment variable. Please set it in .env.local"
    );
  }

  return apiKey.trim();
}

function getBaseUrl(): string {
  return (process.env.FINAPI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

export function getRateLimitStatus(): RateLimitInfo {
  return { ...latestRateLimit };
}

export async function fetchRawFinApiIpos(options?: {
  status?: string;
  type?: string;
  bypassCache?: boolean;
}): Promise<{ ipos: RawFinApiIpo[]; fromCache: boolean; rateLimit: RateLimitInfo }> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  const cacheKey = `${options?.status || "all"}_${options?.type || "all"}`;
  const now = Date.now();

  if (!options?.bypassCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return {
        ipos: cached.data,
        fromCache: true,
        rateLimit: getRateLimitStatus(),
      };
    }
  }

  const url = new URL(`${baseUrl}/api/ipo`);
  if (options?.status && options.status !== "all") {
    url.searchParams.set("status", options.status);
  }
  if (options?.type && options.type !== "all") {
    url.searchParams.set("type", options.type);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    // Read Rate Limit Headers
    const remainingEndpoint = response.headers.get("X-RateLimit-Remaining-Endpoint");
    const remainingGlobal = response.headers.get("X-RateLimit-Remaining-Global");
    const retryAfter = response.headers.get("Retry-After");

    latestRateLimit = {
      remainingEndpoint: remainingEndpoint ? parseInt(remainingEndpoint, 10) : null,
      remainingGlobal: remainingGlobal ? parseInt(remainingGlobal, 10) : null,
      retryAfterSeconds: retryAfter ? parseInt(retryAfter, 10) : null,
      lastCheckedAt: new Date().toISOString(),
    };

    if (response.status === 429) {
      const waitTime = latestRateLimit.retryAfterSeconds || 60;
      throw new Error(
        `FinAPI Rate Limit Exceeded (429). Retry after ${waitTime} seconds.`
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `FinAPI request failed with status ${response.status}: ${errorText || response.statusText}`
      );
    }

    const payload = (await response.json()) as RawFinApiResponse;

    if (!payload || !Array.isArray(payload.data)) {
      throw new Error("Invalid response format received from FinAPI /api/ipo");
    }

    // Update Cache
    memoryCache.set(cacheKey, {
      data: payload.data,
      timestamp: now,
    });

    return {
      ipos: payload.data,
      fromCache: false,
      rateLimit: getRateLimitStatus(),
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      throw new Error("FinAPI request timed out after 15 seconds.");
    }
    throw err;
  }
}

export async function searchFinApiIpo(
  query: string
): Promise<RawFinApiIpo | null> {
  const { ipos } = await fetchRawFinApiIpos();
  if (!query || !ipos.length) return null;

  const normalizedQuery = query.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  // 1. Exact symbol match
  const symbolMatch = ipos.find(
    (item) =>
      item.symbol &&
      item.symbol.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedQuery
  );
  if (symbolMatch) return symbolMatch;

  // 2. Exact or substring name match
  const nameMatch = ipos.find((item) => {
    const normName = item.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return (
      normName === normalizedQuery ||
      normName.includes(normalizedQuery) ||
      normalizedQuery.includes(normName)
    );
  });

  return nameMatch || null;
}
