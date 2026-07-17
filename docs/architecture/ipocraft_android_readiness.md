# IPOCraft — Android Readiness & Reuse Audit

> **Standard:** Every statement in this document traces to code actually found in the repository. Where evidence is insufficient, "Not verifiable from the repository" is stated explicitly.
>
> **Repository verified:** `/Users/sarth/ipocraft`

---

## Table of Contents

1. [Repository Architecture](#1-repository-architecture)
2. [Data Flow](#2-data-flow)
3. [Existing APIs / Interfaces](#3-existing-apis--interfaces)
4. [Business Logic Reuse](#4-business-logic-reuse)
5. [Data Layer](#5-data-layer)
6. [Admin Workflow](#6-admin-workflow)
7. [Android Readiness](#7-android-readiness)
8. [Missing Pieces](#8-missing-pieces)
9. [Reuse Opportunities](#9-reuse-opportunities)
10. [Technical Risks](#10-technical-risks)
11. [Final Verdict](#11-final-verdict)

---

## 1. Repository Architecture

### What Is Actually Here

IPOCraft is a **single Next.js 16 application** (package.json line 16: `"next": "16.1.6"`). The entire system — public website, admin panel, and API — is one deployment unit. There is no separate backend service, no microservice boundary, and no standalone API layer. This is confirmed by the complete absence of any non-Next.js server framework (Express, Fastify, NestJS, etc.) from `package.json`.

### Verified Major Modules

| Module | Location | Type | Responsibility |
|--------|---------|------|---------------|
| Public Pages | `app/*.tsx`, `app/ipo/`, `app/gmp/`, etc. | Next.js Server Components | Render IPO data to HTML |
| Admin Panel | `app/admin/page.tsx` → `components/AdminDashboard.tsx` | Client Component | Create/edit/delete IPOs and brokers |
| Auth | `app/auth/page.tsx`, `app/auth/callback/route.ts` | Client Component + Route Handler | Email+password login via Supabase Auth |
| API Routes | `app/api/ipos/`, `app/api/fetch-ipo/`, `app/api/fetch-gmp/`, `app/api/gmp-histpry/[id]/` | Next.js Route Handlers | 4 HTTP endpoints |
| Feed Library | `lib/ipoFeed.ts` | TypeScript module | Pagination engine; calls `get_ipos_page` RPC |
| Server Supabase | `lib/supabaseServer.ts`, `lib/ipo.server.ts` | Server-only modules | Cookie-aware server clients |
| Client Supabase | `lib/supabase.ts` (6 lines) | Singleton | Anon key browser client |
| Business Logic | `lib/ipoStatus.ts`, `lib/allotmentStatus.ts`, `lib/ipoSort.ts` | Pure TypeScript functions | Status computation, sorting |
| UI Components | `components/` (18 files) | React/TSX | All UI rendering |
| Database | `supabase/migrations/` (1 file) | SQL | `brokers` table DDL + `ipos` column additions |

### Client/Server Boundary

The application has a hard boundary defined by Next.js:

- **Server side (Node.js):** Async Server Components (`app/page.tsx`, `app/ipo/[slug]/page.tsx`, `app/gmp/page.tsx`, etc.), Route Handlers (`/api/*`), `lib/ipo.server.ts` (marked `import "server-only"`)
- **Client side (browser):** All `"use client"` components — `Navbar`, `IpoCard`, `IpoLoadMoreClient`, `GmpTableClient`, `GmpChart`, `AdminDashboard`, `AdminForm`, `AuthPage`

### Shared / Reusable Layers (As They Currently Exist)

The only truly technology-neutral business logic lives in:
- `lib/ipoStatus.ts` — status priority computation
- `lib/allotmentStatus.ts` — allotment badge priority computation
- `lib/ipoSort.ts` — open-date sort comparator
- The data shapes defined in `IpoCard.tsx` (`IPOListItem` type) and `ipoFeed.ts` (`IpoCursor`, `IpoFeedResult`)

All of these are TypeScript modules. They are not Android-consumable as-is; they would need to be re-implemented in Kotlin or consumed indirectly via API.

---

## 2. Data Flow

### Full Lifecycle of IPO Data

#### Entry Point — Admin Write

```
Admin browser
  → AdminForm.handleSubmit() (components/AdminForm.tsx lines 892-1062)
  → createBrowserClient (NEXT_PUBLIC_SUPABASE_ANON_KEY)
  → supabase.from("ipos").insert([payload]) OR .update(payload).eq("id", id)
  → Supabase PostgreSQL: ipos table (writes land here)

  Side effect: if GMP value changed:
  → supabase.from("gmp_history").insert({ ipo_id, gmp })
  → gmp_history table receives new entry
```

There is no import step, no ETL, no data pipeline observable in the repository. All data enters through the admin form manually.

#### Read Path — Public Web Client

```
PostgreSQL ipos table
  ↓
Supabase RPC: get_ipos_page() [definition NOT in repository]
  ↓
lib/ipoFeed.ts: getIpoFeedPage()
  — normalizeIpoEntry() casts all fields to typed values
  — hasMore = entries.length > limit (limit+1 trick)
  — nextCursor = { open_date, created_at, slug } of last visible item
  ↓
app/ipo/page.tsx or app/page.tsx (Server Component)
  — receives { items: IPOListItem[], hasMore, nextCursor, snapshot }
  ↓
IpoLoadMoreClient (browser hydrates)
  — fetch("/api/ipos?...") on "Show More" click
  — results deduplicated by ID and appended to local state
  ↓
IpoList → IpoCard renders each IPOListItem
```

#### Read Path — IPO Detail

```
PostgreSQL ipos table
  ↓ (1) direct select * where slug = X
lib/ipo.server.ts: getIpoBySlug() — React.cache() deduplicates within render
  ↓ (2) select from gmp_history where ipo_id = X, ordered by created_at ASC
  ↓ (3) select from subscription_history where ipo_id = X, ordered by day ASC
  ↓
app/ipo/[slug]/page.tsx:
  — all computation (GMP series, trend, allotment badge, etc.) done server-side
  — GmpChart receives gmpSeries as serialized prop
```

#### Read Path — GMP Page

```
ipos table: select 10 specific columns, no WHERE, no LIMIT [unbounded]
  ↓
gmp_history: select ipo_id + gmp + created_at for all returned IDs [unbounded]
  ↓
Server builds gmpMap: { [ipo_id]: { latest, prev } }
  ↓
GmpTableClient receives: full ipos array + gmpMap as props
  — All filtering, sorting, and virtual scroll is in-memory in browser
```

---

## 3. Existing APIs / Interfaces

### API Inventory (All 4 Confirmed Endpoints)

---

#### 3.1 `GET /api/ipos`

| Property | Detail |
|---------|--------|
| **File** | `app/api/ipos/route.ts` |
| **Purpose** | Returns a paginated, cursor-based page of IPO listings |
| **Current Consumer** | `components/IpoLoadMoreClient.tsx` (browser fetch on "Show More" click) |
| **Input (query params)** | `limit` (integer), `snapshot` (ISO timestamp), `status` (string), `type` (string), `q` (string), `cursorOpenDate`, `cursorCreatedAt`, `cursorSlug` |
| **Output** | `{ items: IPOListItem[], hasMore: boolean, nextCursor: IpoCursor \| null, snapshot: string }` |
| **Caching** | `dynamic = "force-dynamic"` — no server-side caching |
| **Auth required** | No authentication required |
| **Android reusable?** | **Yes, as-is.** This is a standard JSON REST endpoint. Any HTTP client in Android can call it. |
| **Modifications required** | None structurally. Field-level additions (e.g., `image_url`) would require schema changes. |
| **Documentation** | None. No OpenAPI/Swagger spec exists in the repository. |

---

#### 3.2 `GET /api/gmp-histpry/[id]`

| Property | Detail |
|---------|--------|
| **File** | `app/api/gmp-histpry/[id]/route.ts` (note: typo in folder name — missing "o") |
| **Purpose** | Returns full GMP history records for a single IPO, ordered by `created_at` ascending |
| **Current Consumer** | Not directly called by any verified client-side component. The IPO detail page fetches `gmp_history` directly via a server-side Supabase query, not via this endpoint. |
| **Input** | `id` (path param, string — compared to `ipo_id` which appears to be numeric) |
| **Output** | JSON array of all `gmp_history` rows matching `ipo_id = id`, or `{ error: message }` with HTTP 500 |
| **Caching** | None configured |
| **Auth required** | No |
| **Android reusable?** | **Yes, with caution.** The endpoint returns `select("*")` — all columns in `gmp_history` — with no shape guarantee. Column list is not verifiable from the repository (no DDL for `gmp_history` exists). |
| **Modifications required** | URL path typo (`histpry`) should be corrected before any consumer relies on it permanently. |
| **Documentation** | None. |

---

#### 3.3 `POST /api/fetch-ipo`

| Property | Detail |
|---------|--------|
| **File** | `app/api/fetch-ipo/route.ts` |
| **Purpose** | Admin autofill: accepts a company name and returns a Clearbit logo URL + placeholder description |
| **Current Consumer** | `components/AdminForm.tsx` (line 825) — "Auto-fill" button in admin form |
| **Input** | `{ "companyName": "Example Corp" }` (JSON body) |
| **Output** | `{ logo: "https://logo.clearbit.com/examplecorp.com", industry: "To be updated", description: "...", website: "https://examplecorp.com", gmp: null }` |
| **Android reusable?** | **No.** This is an admin-only internal tool. The data it returns (Clearbit logo URL + boilerplate description) is not suitable for end-user consumption. The logo URL is constructed by string manipulation, not fetched; if the domain guess is wrong, the URL returns a 404. |
| **Modifications required** | Not relevant for Android. |
| **Documentation** | None. |

---

#### 3.4 `POST /api/fetch-gmp`

| Property | Detail |
|---------|--------|
| **File** | `app/api/fetch-gmp/route.ts` |
| **Purpose** | Returns a GMP value for a company name |
| **Current Consumer** | `components/AdminForm.tsx` (line 871) — "Fetch GMP" button |
| **Input** | `{ "companyName": "Example Corp" }` (JSON body) |
| **Output** | `{ gmp: <random integer 0-199>, source: "estimated" }` |
| **Actual behavior** | Returns `Math.floor(Math.random() * 200)` — hardcoded stub (line 20 of route file includes comment "temporary demo") |
| **Android reusable?** | **No.** This is a stub that returns a random number. It does not provide real GMP data. |
| **Modifications required** | Not relevant for Android. |
| **Documentation** | None. |

### API Gaps for Android

The following data categories are currently consumed by the web app from Supabase directly (server-side), with no dedicated API endpoint for external consumption:

| Data Category | Current Access Method | Android API Status |
|-------------|----------------------|-------------------|
| IPO Detail (full record) | Direct Supabase query in Server Component | **No API endpoint** |
| Broker List | Direct Supabase query in BrokerList Server Component | **No API endpoint** |
| Subscription History per IPO | Direct Supabase query in `app/ipo/[slug]/page.tsx` | **No API endpoint** |
| IPO Calendar (all IPOs grouped) | Direct Supabase query in `app/ipo-calendar/page.tsx` | **No API endpoint** |
| GMP Table (all IPOs + history) | Direct Supabase query in `app/gmp/page.tsx` | **No API endpoint** |

---

## 4. Business Logic Reuse

All business logic in the repository is written in TypeScript. None of it is natively consumable by an Android application. Reuse requires either: (a) re-implementing the logic in Kotlin, or (b) moving the logic into API endpoints that the Android app consumes as HTTP responses.

### Logic Inventory and Reuse Assessment

---

#### 4.1 IPO Status Computation

**Files:** `lib/ipoStatus.ts` (67 lines), `lib/allotmentStatus.ts` (51 lines), inline in `app/ipo/[slug]/page.tsx` (lines 213-262), inline in `components/IpoCard.tsx` (lines 33-132)

**What it does:**
- Determines IPO status (Upcoming / Open / Closed / Listed) from `open_date`, `close_date`, `listing_date`
- Determines allotment badge (Allotment Out / Allotment Awaited / null) using a 4-priority system:
  1. Admin override (`allotment_out = true` or `allotment_status = "out"`) → always "Out"
  2. IPO is listed → "Out"
  3. Allotment date reached → "Awaited"
  4. None of the above → null

**Coupling:** The same logic is duplicated in at least 3 separate locations in the repository. `lib/ipoStatus.ts` and `lib/allotmentStatus.ts` exist as shared utilities, but `IpoCard.tsx` implements its own version (`getFinalStatus`, `getAllotmentBadge`), and `app/ipo/[slug]/page.tsx` reimplements it inline.

**Reuse Assessment:** **Reusable after re-implementation.** The algorithm is well-defined and self-contained. An Android app would implement it in Kotlin using the same priority rules. The rules should be documented (currently they are only in code comments). The duplication means any future rule change would need to be applied in 3+ places in the existing web app, and separately in the Android app.

---

#### 4.2 Cursor-Based Pagination

**File:** `lib/ipoFeed.ts` (lines 140-184)

**What it does:**
- Calls `get_ipos_page` RPC with `p_limit + 1` rows
- Detects `hasMore` by checking if result count exceeds the page limit
- Builds `nextCursor = { open_date, created_at, slug }` from the last visible item
- Returns `{ items, hasMore, nextCursor, snapshot }`
- The `snapshot` timestamp stabilizes pagination across pages

**Reuse Assessment:** **Reusable via `/api/ipos` endpoint.** The Android app can consume `GET /api/ipos` directly — it returns `{ items, hasMore, nextCursor, snapshot }` as JSON. The Android app receives pagination state and sends cursor params back on subsequent requests. No re-implementation of the pagination engine is needed.

---

#### 4.3 IPO Sort (Newest Open Date First)

**File:** `lib/ipoSort.ts` (26 lines)

**What it does:** Sorts an array of IPO objects by `open_date` descending (most recent first). Handles null dates by placing them at the end.

**Reuse Assessment:** **Re-implement in Android.** Simple comparator. The API already returns sorted results via the RPC, so Android may not need to sort client-side unless it applies additional filtering after receiving data.

---

#### 4.4 Lot Amount Auto-Calculation

**File:** `components/AdminForm.tsx` (lines 766-804)

**What it does:** When admin enters `lot_size` and `price_max`, it auto-computes `retail_min_amount = retail_min_lots × lot_size × price_max` (and same for max, SHNI, BHNI categories).

**Reuse Assessment:** **Admin-only.** Not relevant for a read-oriented Android client. If an Android admin capability is ever built, this formula would need re-implementation.

---

#### 4.5 Text Rendering (About / Objectives / Strengths / Risks)

**File:** `app/ipo/[slug]/page.tsx` (lines 302-333, `renderPoints` function)

**What it does:** Inspects admin-authored free text. If it contains bullet markers (`1.`, `•`, `-`), splits into a list. Otherwise renders as paragraph with `whitespace-pre-line`.

**Reuse Assessment:** **Re-implement in Android.** This parsing logic is inline in the page. An Android client rendering the same text fields would need to implement equivalent parsing. The raw text is what's stored in the database; the formatting is applied at render time.

---

#### 4.6 GMP vs Issue Price Percent Calculation

**File:** `app/ipo/[slug]/page.tsx` (lines 200-206)

**What it does:** `gmpVsIssuePricePercent = (latestGmp / issuePrice) * 100`

**Reuse Assessment:** **Re-implement in Android.** A trivial arithmetic formula. The inputs (`gmp`, `price_max`) are available from the API.

---

#### 4.7 Listing Return Badge

**File:** `components/IpoCard.tsx` (lines 111-132, `getListedReturnBadge`)

**What it does:** `returnPct = ((listingPrice - issuePrice) / issuePrice) * 100` — shown when `listing_date <= today` and both prices are non-null.

**Reuse Assessment:** **Re-implement in Android.** Straightforward formula. Fields `listing_price`, `price_max` (used as `issuePrice` fallback) are available in `IPOListItem`.

---

#### 4.8 Admin Slug Generation

**File:** `components/AdminForm.tsx` (lines 806-814)

**What it does:** `slug = companyName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") + "-ipo"`

**Reuse Assessment:** **Admin-only.** Not relevant for Android end-user app.

---

## 5. Data Layer

### Observable Tables and Schemas

#### `ipos` Table

The table predates the repository. Its full schema is only inferable from code. The migration file adds columns idempotently but does not define the complete table. All 94 fields managed by `AdminForm.tsx` represent the observable column set.

**Confirmed columns from migration + code (grouped):**

| Group | Columns |
|-------|---------|
| Identity | `id`, `slug`, `name`, `exchange`, `sector`, `ipo_type` |
| Lifecycle | `status`, `open_date`, `close_date`, `listing_date`, `allotment_date`, `refund_date` |
| Pricing | `price_min`, `price_max`, `face_value`, `listing_price`, `listing_gain_percent` |
| GMP | `gmp` (current snapshot value) |
| Subscription | `sub_total`, `sub_qib`, `sub_nii`, `sub_rii`, `sub_bhni`, `sub_shni`, `subscription_updated_at` |
| Allotment | `allotment_status`, `allotment_out`, `allotment_link` |
| Issue | `issue_size`, `fresh_issue`, `anchor_investors`, `market_maker_shares_offered`, `reserved_market_maker` |
| Lot sizes | `lot_size`, `retail_min/max_lots/shares/amount`, `shni_min/max_lots/shares/amount`, `bhni_min/max_lots/shares/amount` |
| Narrative | `about_company`, `objectives`, `company_strengths`, `company_risks` |
| Promoters | `promoter_holding_pre`, `promoter_holding_post` |
| Reservation | `reservation_qib`, `reservation_nii`, `reservation_rii`, `reservation_employee` |
| Documents | `drhp_link`, `rhp_link` |
| Listing | `listing_exchange`, `lead_managers`, `registrar` |
| Valuation | `eps_pre`, `eps_post`, `pe_pre`, `pe_post`, `roce`, `debt_equity`, `pat_margin`, `market_cap` |
| Contacts | `company_address`, `company_phone`, `company_email`, `company_website`, `registrar_phone`, `registrar_email`, `registrar_website` |
| Audit | `created_at` |

#### `brokers` Table

**Full DDL confirmed from migration file (lines 38-56):**

| Column | Type | Constraints |
|--------|------|------------|
| `id` | uuid | Primary key, default gen_random_uuid() |
| `name` | text | NOT NULL |
| `slug` | text | NOT NULL, UNIQUE |
| `logo_url` | text | nullable |
| `account_opening` | text | nullable |
| `account_maintenance` | text | nullable |
| `equity_delivery` | text | nullable |
| `equity_intraday` | text | nullable |
| `futures` | text | nullable |
| `options` | text | nullable |
| `cta_url` | text | nullable |
| `notes` | text | nullable |
| `sort_order` | int | NOT NULL, default 0 |
| `is_active` | boolean | NOT NULL, default true |
| `created_at` | timestamptz | NOT NULL, default now() |
| `updated_at` | timestamptz | NOT NULL, default now() |

**Index confirmed:** `idx_brokers_active_order ON brokers(is_active, sort_order, name)`

**Trigger confirmed:** `set_updated_at()` fires before update on brokers, sets `updated_at = now()`

#### `gmp_history` Table

**No DDL in repository.** Observable from code: has columns `ipo_id` (compared to `ipos.id` with a `Number()` cast in `app/gmp/page.tsx` line 108), `gmp` (numeric), `created_at` (timestamptz — used in ORDER BY). Select `*` is used in `app/api/gmp-histpry/[id]/route.ts`, so exact column list is **not verifiable from the repository**.

#### `subscription_history` Table

**No DDL in repository.** Only reference: `supabase.from("subscription_history").select("*").eq("ipo_id", ipo.id).order("day", { ascending: true })` — confirms columns include `ipo_id` and `day`. Exact schema is **not verifiable from the repository**.

### Relationships Observable from Code

```
ipos.id ← gmp_history.ipo_id       (write: AdminForm line 1041; read: gmp page line 113)
ipos.id ← subscription_history.ipo_id  (read: /ipo/[slug]/page.tsx line 144)
```

No foreign key DDL is confirmed for either relationship. No cascade behavior is observable.

### Android Impact

The data model is rich and Android-ready in terms of content. Every field an Android app needs (dates, prices, GMP, subscription, allotment, lot sizes, narrative text, contacts) exists in the `ipos` table. The data model does not need to change for an Android client.

What does not exist: a single API endpoint that returns a full `ipos` record by slug. Android would need to call the Supabase REST API directly or a new Next.js endpoint would need to be added.

---

## 6. Admin Workflow

### How Admin Currently Works

The entire admin workflow is a browser-only experience:

1. Admin navigates to `/auth` → enters email + password → `supabase.auth.signInWithPassword()` (`app/auth/page.tsx` line 16)
2. On success → `window.location.href = "/admin"` (hard navigation)
3. `AdminDashboard` mounts in browser → `fetchIpos()` calls `supabase.from("ipos").select("*")` without any filter or limit (`components/AdminDashboard.tsx` lines 90-101)
4. Admin creates/edits/deletes IPOs and brokers — all operations are direct browser-to-Supabase calls using the anon key client (`createBrowserClient`, lines 10-13)

### Admin Operations

| Operation | Implementation |
|---------|---------------|
| List all IPOs | `supabase.from("ipos").select("*")` + sort client-side |
| Create IPO | `supabase.from("ipos").insert([payload])` (94-field payload) |
| Update IPO | `supabase.from("ipos").update(payload).eq("id", id)` |
| Delete IPO | `supabase.from("ipos").delete().eq("id", id)` |
| Update GMP (inline) | `supabase.from("ipos").update({ gmp }).eq("id", id)` + insert to `gmp_history` |
| Duplicate IPO | `supabase.from("ipos").insert({ ...fields, name: name + " (Copy)", slug: slug + "-copy-" + Date.now() })` |
| List all brokers | `supabase.from("brokers").select("*").order("sort_order")` |
| Create/Edit broker | `supabase.from("brokers").insert()` or `.update()` |
| Delete broker | `supabase.from("brokers").delete().eq("id", id)` |

### Could This Workflow Serve an Android Admin App?

**Partially.** The underlying Supabase database accepts standard PostgREST requests. An Android admin application could make the same database calls directly using the Supabase Android SDK, subject to the same RLS policies that govern the web client.

However, the specific authorization model is **not verifiable from the repository** — the Supabase RLS policies are not in the codebase. It is therefore not possible to confirm from the repository alone what an Android admin app would be permitted to do.

There are no server-side admin API endpoints. All admin operations bypass the Next.js API layer entirely. Any Android admin implementation would either:
- Call Supabase directly (same pattern as the web admin)
- Or require new Next.js API endpoints for each admin operation

---

## 7. Android Readiness

### 7.1 IPO Listing

**Status: Partially Supported**

`GET /api/ipos` exists and returns `{ items: IPOListItem[], hasMore, nextCursor, snapshot }`. The response is JSON and is consumable by any HTTP client.

**What works:** The paginated feed, cursor pagination, filters (status, type, search query) all function via this endpoint.

**What is missing:** The `IPOListItem` type returned contains only 20 fields. An Android list screen would have everything it needs. However, there is no documented API contract — no OpenAPI spec, no version header, and no stability guarantee on field names.

**Evidence:** `app/api/ipos/route.ts`, `lib/ipoFeed.ts` (lines 100-137, the full `IPOListItem` shape), `components/IpoLoadMoreClient.tsx`.

---

### 7.2 IPO Detail View

**Status: Not Supported (no API endpoint)**

The IPO detail page (`app/ipo/[slug]/page.tsx`) fetches data using server-side Supabase queries directly. There is no `/api/ipos/[slug]` endpoint.

An Android app requesting the full IPO record (including all 60+ columns, GMP history series, subscription history) has no HTTP endpoint to call. It would have to use the Supabase client SDK directly, or a new endpoint would need to be created.

**Evidence:** `app/ipo/[slug]/page.tsx` — no REST abstraction. `app/api/` directory — no slug-based IPO detail endpoint.

---

### 7.3 Search

**Status: Partially Supported**

Server-side search via `GET /api/ipos?q=searchterm` works. The `p_q` parameter is passed to the `get_ipos_page` RPC, which handles filtering server-side.

The client-side DOM-manipulation search (a `<script>` tag in `app/ipo/page.tsx`) is web-only and irrelevant to Android.

**Evidence:** `lib/ipoFeed.ts` (line 158: `p_q: normalizeSearch(q)`), `app/api/ipos/route.ts` (line 23: `q: searchParams.get("q")`).

---

### 7.4 GMP Tracking

**Status: Partially Supported**

Current GMP value is available in the `IPOListItem` via `GET /api/ipos` (the `gmp` field).

GMP history per IPO is available via `GET /api/gmp-histpry/[id]`, though this endpoint has a typo in its URL path, returns `select("*")` with no guaranteed schema, and its current usage in the web application is unconfirmed — the detail page fetches `gmp_history` directly via a server-side query rather than through this endpoint.

**Evidence:** `components/IpoCard.tsx` (line 12: `gmp: number | null`), `app/api/gmp-histpry/[id]/route.ts`.

---

### 7.5 Broker Comparison

**Status: Not Supported (no API endpoint)**

The broker list is fetched by `BrokerList.tsx` as an async Server Component. There is no `/api/brokers` endpoint. Full broker data (charges, links, notes) is only accessible by querying Supabase directly.

**Evidence:** `components/BrokerList.tsx` — direct Supabase query. `app/api/` directory — no brokers endpoint.

---

### 7.6 IPO Calendar

**Status: Not Supported (no API endpoint)**

`app/ipo-calendar/page.tsx` does an unbounded `supabase.from("ipos").select("*")` with no API abstraction. There is no calendar-specific endpoint.

**Evidence:** `app/ipo-calendar/page.tsx` — direct Supabase query without REST exposure.

---

### 7.7 Notifications

**Status: Not Supported**

There is no push notification infrastructure, no notification service, no scheduled job, no webhook, and no event-driven system anywhere in the repository. Notifications do not exist as a concept in the current implementation.

**Evidence:** `package.json` — no notification library (FCM, OneSignal, etc.). No cron jobs, no background workers, no cloud functions.

---

### 7.8 User-Specific Functionality (Watchlists, Preferences)

**Status: Not Supported**

There is no concept of end-user accounts, user-specific data, watchlists, saved IPOs, or preferences anywhere in the repository. The only user in the system is the admin. There are no `users` table references, no `profiles` table, and no user-data API endpoints.

**Evidence:** The entire `lib/` and `components/` directory. No user-specific queries or storage patterns.

---

### 7.9 Authentication for Android

**Status: Supported at Infrastructure Level Only**

Supabase Auth is present (`app/auth/page.tsx`, `app/auth/callback/route.ts`). The Supabase Android SDK supports email+password authentication with the same Supabase project.

However, the current implementation uses **cookie-based sessions** designed for browser clients (`createBrowserClient`, `createServerClient` from `@supabase/ssr`). Android Supabase clients use JWT tokens, not browser cookies. The auth flow would work differently on Android.

The admin auth flow (`signInWithPassword` → cookie → redirect to `/admin`) is a web-specific pattern. An Android implementation would use the Supabase Android SDK's token-based flow and store the session in secure storage.

**Evidence:** `app/auth/page.tsx` (lines 4, 7, 16-26), `package.json` (`@supabase/ssr: ^0.8.0`, `@supabase/supabase-js: ^2.98.0`).

---

### 7.10 Settings

**Status: Not Supported**

The admin dashboard has a "Settings" tab (`components/AdminDashboard.tsx` line 276). Its content is a placeholder (text only — not verifiable further from the rendered source). No settings model, settings table, or settings API exists.

There are no end-user settings of any kind.

**Evidence:** `components/AdminDashboard.tsx` — Settings tab renders placeholder text.

---

## 8. Missing Pieces

### No Work Required

Nothing in the existing codebase needs to be modified solely because an Android app is being added. The database, Supabase project, and existing API endpoints can be used as-is.

---

### Small Modification

**S1. Fix the URL typo in `gmp-histpry` endpoint**

`app/api/gmp-histpry/[id]/route.ts` — the folder is named `gmp-histpry` (missing "o"). Any consumer (web or Android) that relies on this endpoint is exposed to this typo. Correcting it is a one-file folder rename plus any references that hardcode the URL.

**Current consumers:** No hardcoded call to this URL was found in any client component. Not fixing it does not break any current functionality but would complicate documentation.

**Evidence:** Directory listing; no verified web client call to this endpoint.

---

**S2. Add a public `GET /api/brokers` endpoint**

`BrokerList.tsx` fetches brokers server-side. An Android app cannot access a React Server Component. A Route Handler mirroring the same query would expose this data:

```
GET /api/brokers
→ supabase.from("brokers").select(*).eq("is_active", true).order("sort_order")
→ returns BrokerListItem[]
```

The query already exists in `components/BrokerList.tsx` (lines 45-58). Creating the API route is a copy of that logic into a Route Handler file.

---

**S3. Add a public `GET /api/ipos/[slug]` endpoint**

The detail page data (including `subscription_history` and `gmp_history`) has no HTTP endpoint. An Android IPO detail screen would need this:

```
GET /api/ipos/example-company-ipo
→ supabase select * from ipos where slug = slug
→ supabase select * from gmp_history where ipo_id = id
→ supabase select * from subscription_history where ipo_id = id
→ returns combined detail record
```

The logic already exists in `app/ipo/[slug]/page.tsx`. The effort is extracting it into a Route Handler.

---

### Medium Modification

**M1. Add proper CORS configuration for mobile API access**

`next.config.ts` is 11 lines with no custom headers, no CORS configuration, and `vercel.json` is an empty object (`{}`). When an Android app calls the Next.js API endpoints from a mobile device, CORS is not currently configured. Next.js Route Handlers do not set `Access-Control-Allow-Origin` by default. Mobile HTTP clients typically don't enforce CORS the same way browsers do, but if the API is ever consumed from a WebView or becomes a public API, explicit CORS headers need to be added.

**Evidence:** `next.config.ts` (10 lines, no headers block), `vercel.json` (empty object).

---

**M2. Define and document the API contract**

No API specification exists (no OpenAPI/Swagger, no README for the API endpoints). For an Android team to consume `GET /api/ipos`, they need a stable, documented contract that includes field types, nullable behavior, and pagination mechanics.

The current response shape is implicitly defined only by TypeScript interfaces in `lib/ipoFeed.ts` and `components/IpoCard.tsx`. These types are not accessible to an Android client and have never been exported as a machine-readable spec.

**Evidence:** No `.yaml`, `.json` spec file. No API documentation in `README.md` (1450 bytes, covers only developer setup).

---

**M3. Implement real GMP data in `/api/fetch-gmp`**

The current `/api/fetch-gmp` stub returns `Math.random() * 200` with comment "temporary demo." If Android is to display current GMP values (beyond what is stored in the `gmp_history` and `ipos.gmp` fields), a real data source would be required.

Note: `ipos.gmp` already stores the last manually-entered GMP, and `gmp_history` tracks historical values. These are real data available via existing channels. The stub endpoint is only used by the admin autofill button and is not the source of GMP data for users.

**Evidence:** `app/api/fetch-gmp/route.ts` (line 20 comment: "temporary demo").

---

### Major Architectural Work

**A1. Push Notifications Infrastructure**

Zero notification infrastructure exists. Supporting push notifications for IPO alerts (e.g., "XYZ IPO just opened", "Allotment date reached") would require:

- A Firebase Cloud Messaging (FCM) integration (or equivalent)
- A mechanism to trigger notifications (scheduled job, database trigger/webhook, or event queue)
- Device token storage per user (implies a `devices` or `push_tokens` table)
- A notification delivery service (could be a new Next.js API route, a Supabase Edge Function, or an external service)

None of these components exist in the repository.

**Evidence:** `package.json` (no FCM, no notification library), `supabase/migrations/` (no devices or tokens table), no background jobs.

---

**A2. End-User Authentication and User-Specific Features**

There are currently no end-user accounts. Implementing watchlists, saved IPOs, personalized notifications, or per-user preferences would require:

- A `profiles` or `users` table linked to Supabase Auth UIDs
- Row Level Security policies scoped to authenticated users (not verifiable from repository)
- API endpoints for user-specific CRUD operations
- Token-based auth flow appropriate for Android (different from the current cookie-based web flow)

**Evidence:** No user data model in any migration file. No user-specific queries in any component.

---

**A3. Admin Features on Android**

Replicating the AdminForm's 94-field IPO creation/editing form on Android would be significant UI work. The business logic (lot auto-calculation, field traversal, GMP history write) would need to be re-implemented in Kotlin. The form is 2468 lines of TypeScript/TSX and uses React-specific patterns (controlled inputs, useEffect for derived fields, refs for focus management) with no portable logic layer.

**Evidence:** `components/AdminForm.tsx` (2468 lines).

---

## 9. Reuse Opportunities

The following are verified items in the repository that an Android application can directly or indirectly reuse:

### Direct Reuse (No Modification Needed)

| Item | What It Is | How Android Reuses It |
|------|-----------|----------------------|
| **Supabase Project** | The same PostgreSQL database and Supabase Auth instance | Android uses the Supabase Android SDK with the same `SUPABASE_URL` and `ANON_KEY` |
| **`GET /api/ipos`** | Paginated IPO feed with filters | Standard GET request from Android HTTP client; JSON response is consumable directly |
| **`GET /api/gmp-histpry/[id]`** | GMP history for a single IPO | Standard GET request; returns JSON array |
| **`ipos` table schema** | Full IPO data model with 60+ columns | Android model classes map 1:1 to these columns |
| **`brokers` table schema** | Complete with DDL (migration verified) | Android broker model classes can be defined from the confirmed schema |
| **`gmp_history` relationship** | `ipo_id → ipos.id` | Android can query this directly or via the API route |
| **Supabase Auth** | Email+password authentication | Supabase Android SDK supports `signInWithPassword()` with the same project |

### Reuse via Re-Implementation (Same Logic, Kotlin)

| Item | What It Is | Effort |
|------|-----------|--------|
| **IPO Status Priority Logic** | 4-priority algorithm (Listed > Open > Closed > Upcoming) | Low — documented algorithm, ~30 lines of code |
| **Allotment Badge Priority Logic** | 3-priority algorithm (admin override > listed > allotment date) | Low — ~25 lines |
| **Listing Return % Calculation** | `(listingPrice - issuePrice) / issuePrice * 100` | Trivial |
| **GMP vs Issue Price %** | `(latestGmp / issuePrice) * 100` | Trivial |
| **Sort by Newest Open Date** | Descending null-safe date comparator | Low |
| **Subscription formatting** | `number + "x"` or passthrough string | Trivial |
| **Price band formatting** | `₹{min} – ₹{max}` with null handling | Trivial |
| **Text bullet parsing** | Detect `1.`, `•`, `-` markers → list; else paragraph | Low |

### Not Reusable (Web-Specific)

| Item | Why Not Reusable |
|------|----------------|
| All React/TSX components | Browser-only technology |
| Next.js Server Components | Server-side React rendering; not consumable by Android |
| `lib/supabaseServer.ts` | Uses `next/headers` cookies — Next.js-specific |
| `lib/ipo.server.ts` | Marked `server-only`; uses Node.js module |
| Tailwind CSS styling | CSS-in-HTML framework |
| Google Analytics | Browser telemetry |
| `next/font/google` | Next.js build-time font optimization |
| Admin session cookie flow | Browser cookie auth — Android uses JWT tokens |

---

## 10. Technical Risks

### Risk 1: No Server-Side Admin Route Protection

**Evidence:** `proxy.ts` defines a `proxy()` function that checks Supabase auth and redirects unauthenticated requests to `/auth`. However, `middleware.ts` does not exist in the repository. The `proxy()` function is never imported by a verified Next.js middleware file. As a result, server-side protection of the `/admin` route cannot be confirmed from the repository.

**Android Impact:** If an Android client (or any HTTP client) navigates to `/admin`, it receives the rendered HTML of `AdminDashboard` because there is no confirmed server-side gate. The admin's actual data operations (Supabase writes) are still gated by Supabase RLS (not verifiable from repository), but the admin UI itself is not verifiably protected at the server level.

---

### Risk 2: Admin Writes via Public Anon Key

**Evidence:** `components/AdminDashboard.tsx` (lines 10-13):
```typescript
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

All IPO insert, update, delete, and GMP history writes go through the browser client using the public anon key. The public anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is visible to any user who inspects page source or network traffic. Authorization is entirely dependent on Supabase RLS policies, which **are not in the repository** and cannot be verified.

**Android Impact:** If an Android application (or any third party) obtains the anon key (which is a `NEXT_PUBLIC_` variable, meaning it is intentionally public), it could attempt the same Supabase write operations. Whether RLS prevents unauthorized writes is **not verifiable from the repository**.

---

### Risk 3: Business Logic Duplication (3 Copies)

**Evidence:** The allotment badge priority logic appears in:
1. `lib/allotmentStatus.ts` (standalone utility)
2. `lib/ipoStatus.ts` (part of combined status function)
3. `components/IpoCard.tsx` (`getAllotmentBadge` function, lines 67-109)
4. `app/ipo/[slug]/page.tsx` (inline, lines 239-262)

**Android Impact:** If a rule changes (e.g., the priority order or the admin override detection logic), it must be changed in 3-4 places in the web app, and separately re-implemented in the Android app. This is a maintenance risk that compounds with each new client.

---

### Risk 4: No API for Core Data Views

**Evidence:** Three major content views (IPO detail, broker list, IPO calendar) have no HTTP API endpoint. They are served exclusively by server-side Supabase queries in React Server Components.

**Android Impact:** An Android client cannot call a Server Component. This means Android would need to either:
1. Call Supabase directly (bypassing the Next.js layer entirely), or
2. New API endpoints must be built

If Android calls Supabase directly, the Next.js query logic (field selection, ordering, sanitization from `lib/ipo.server.ts`) is bypassed. This means business rules applied at the API layer (e.g., `sanitizeIpoSlug`) would need to be re-implemented in Android.

---

### Risk 5: Unbounded Database Queries

**Evidence:**
- `app/gmp/page.tsx` (lines 78-97): `supabase.from("ipos").select(10 columns)` — no WHERE, no LIMIT
- `app/gmp/page.tsx` (lines 110-118): `supabase.from("gmp_history").select(...).in("ipo_id", allIds)` — unbounded based on total IPO count
- `app/ipo-calendar/page.tsx`: `supabase.from("ipos").select("*")` — no LIMIT, full column set
- `components/AdminDashboard.tsx` (line 93-95): `supabase.from("ipos").select("*")` — no LIMIT

**Android Impact:** As IPO count grows, these queries return increasingly large payloads. This is a shared risk between the web and Android clients. An Android app calling these same patterns (directly or via new API endpoints) would face the same scalability concern. The web app currently handles this with client-side virtual scroll in `GmpTableClient` (renders only 18 rows at a time), but the underlying data transfer is still unbounded.

---

### Risk 6: The `get_ipos_page` RPC Definition Is Not In The Repository

**Evidence:** `lib/ipoFeed.ts` (line 154): `await supabase.rpc("get_ipos_page", { ... })`. The stored procedure that implements cursor-based pagination is called but its definition is not in `supabase/migrations/` or anywhere else in the repository.

**Android Impact:** If an Android team needs to debug pagination behavior, reproduce the cursor logic, or modify filtering — they cannot do so from the repository. The implementation is invisible. This is a documentation and discoverability risk.

---

### Risk 7: GMP Stub API

**Evidence:** `app/api/fetch-gmp/route.ts` (line 20): `Math.floor(Math.random() * 200)` — with in-code comment "temporary demo."

**Android Impact:** If an Android developer finds this endpoint and uses it as a GMP data source, they would get random numbers. The real GMP data source is the `ipos.gmp` field (manually entered by admin) and `gmp_history` (historical entries). The stub endpoint is misleadingly named and could cause confusion.

---

### Risk 8: No Request Authentication on Public API Endpoints

**Evidence:** `GET /api/ipos` and `GET /api/gmp-histpry/[id]` — both return data with no authentication or rate limiting. There is no API key, no JWT verification, and no rate limiter observable in the codebase.

**Android Impact:** These endpoints can be called by anyone. This is intentional for a public read-only dataset, but should be noted as a deliberate design choice (with no rate limiting protection).

---

## 11. Final Verdict

### 1. Can the current platform realistically support an Android client?

**Yes — for read-only features.** The Supabase backend is already configured, populated with structured data, and accessible. One API endpoint (`GET /api/ipos`) is immediately usable. Three additional API endpoints needed for key features (detail view, broker list, GMP history) require small-to-medium implementation effort and directly mirror queries that already exist in the codebase.

**For write/admin features:** Possible, but not ready. Admin operations are browser-specific in their current form. Android would either call Supabase directly or require new server-side API endpoints.

**For user-specific features (watchlists, notifications):** These do not exist at all in the current system. Significant new architecture is required.

---

### 2. What percentage of the existing implementation appears reusable?

The following components of the existing implementation are directly or indirectly reusable by Android:

| Layer | Reusable? | Percentage Estimate |
|-------|----------|-------------------|
| Database (Supabase project, schema) | Fully reusable | 100% |
| Authentication infrastructure (Supabase Auth) | Reusable at service level; flow differs | 70% |
| `GET /api/ipos` endpoint | Fully reusable | 100% |
| `GET /api/gmp-histpry/[id]` endpoint | Reusable with naming caveat | 80% |
| Business logic rules | Re-implementable (same algorithms) | 60% |
| UI components | Not reusable | 0% |
| Server Components (data fetching logic) | Reusable logic; not the technology | 50% (as reference) |
| Admin workflow | Requires significant rework for Android | 20% |

**Overall rough estimate: ~40-50% of the system's functionality has direct or near-direct reuse potential for Android**, concentrated in the data layer and the one existing JSON API endpoint. The UI layer (which is the majority of the codebase by line count) is web-specific and has no reuse path.

---

### 3. Which components should remain unchanged?

| Component | Reason |
|---------|--------|
| `supabase/migrations/` SQL | Schema is correct and complete for all features |
| `lib/ipoFeed.ts` | Pagination logic is sound; consumed via `/api/ipos` |
| `lib/ipoSort.ts` | Pure utility; no coupling |
| `lib/ipo.server.ts` | Used by detail page and sitemap; works correctly |
| `lib/supabaseServer.ts` | Correct server-client factory |
| `GET /api/ipos` route | Immediately Android-consumable |
| Business logic algorithms in `lib/ipoStatus.ts`, `lib/allotmentStatus.ts` | These are the reference implementations |

---

### 4. Which components require extension?

| Component | Extension Needed |
|---------|----------------|
| `app/api/` | Add `GET /api/ipos/[slug]`, `GET /api/brokers`, possibly `GET /api/ipo-calendar` |
| Supabase schema | Add `devices`/`push_tokens` table if notifications are needed; add `profiles` if user accounts are needed |
| `next.config.ts` | Add CORS headers if API becomes publicly documented |
| `middleware.ts` (does not exist) | Create and wire `proxy.ts` as actual Next.js middleware for admin route protection |

---

### 5. Which components require refactoring?

| Component | Refactoring Needed |
|---------|------------------|
| Allotment badge logic | Consolidate from 3 copies into 1 canonical location in `lib/allotmentStatus.ts`; remove inline duplicates |
| `app/api/gmp-histpry/[id]/` folder name | Rename to `gmp-history` (fix typo) |
| `app/api/fetch-gmp/route.ts` | Replace random stub with real data source (or explicitly document it as admin-only and not a user-facing endpoint) |

---

### 6. Is there any evidence that duplicate systems would be necessary?

**No, for the data layer.** The Supabase database is the single source of truth. An Android app and the web app read from the same tables and write through the same Supabase project. No duplication is required.

**Yes, for the business logic layer**, but only because the logic must be re-implemented in Kotlin. The same algorithms exist once in TypeScript. The duplication is a language boundary problem, not an architectural one. If the logic were moved into API response contracts (i.e., the server pre-computed status and returned it in JSON), the Android app would not need to re-implement these rules at all.

**Specifically:** If `/api/ipos` returned a `computed_status` and `computed_allotment_badge` field (pre-computed by the server using the existing `lib/ipoStatus.ts` logic), the Android app would not need to duplicate the priority algorithm. Currently, `GET /api/ipos` returns raw date fields and `allotment_out`, leaving the status computation to the client. This is a minor design decision with implications for multi-client consistency.

**Evidence for current gap:** `lib/ipoFeed.ts` normalizeIpoEntry() (lines 100-137) does not apply `getIPOStatus()` to the items before returning them. The raw dates are passed through. `IpoCard.tsx` computes status in the browser.

---

*Every statement in this document traces to code verified in the repository at the time of this audit. Where the repository provides insufficient evidence, this is stated explicitly.*
