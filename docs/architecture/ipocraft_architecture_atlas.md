# IPOCraft Architecture Atlas

> **Purpose:** A complete architectural understanding of how IPOCraft works internally. Written for a new senior engineer joining the project.  
> **Standard:** Every statement is directly supported by repository code. "Cannot be verified from the current repository" is stated explicitly where evidence is insufficient.

---

## Table of Contents

1. [High-Level System Overview](#1-high-level-system-overview)
2. [Runtime Request Lifecycle](#2-runtime-request-lifecycle)
3. [Rendering Architecture](#3-rendering-architecture)
4. [Component Relationship Graph](#4-component-relationship-graph)
5. [Dependency Graph](#5-dependency-graph)
6. [Business Logic Flow](#6-business-logic-flow)
7. [Data Flow](#7-data-flow)
8. [Database Relationship Analysis](#8-database-relationship-analysis)
9. [API Interaction Flow](#9-api-interaction-flow)
10. [Authentication Flow](#10-authentication-flow)
11. [State Flow](#11-state-flow)
12. [Error Flow](#12-error-flow)
13. [Configuration Flow](#13-configuration-flow)
14. [External Dependency Analysis](#14-external-dependency-analysis)
15. [Internal Module Analysis](#15-internal-module-analysis)
16. [System Dependency Map](#16-system-dependency-map)
17. [Repository Knowledge Map](#17-repository-knowledge-map)

---

## 1. High-Level System Overview

IPOCraft is a **single Next.js application** with no separate backend service. It consists of three logical subsystems that run inside the same deployment unit:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Application                         │
│                                                                 │
│  ┌────────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │  Public Website    │  │   Admin Panel    │  │  API Layer │  │
│  │  (Server Rendered) │  │  (Client-Only)   │  │(Route Hand.)│ │
│  └────────────────────┘  └──────────────────┘  └────────────┘  │
│              │                    │                   │         │
└──────────────┼────────────────────┼───────────────────┼─────────┘
               │                    │                   │
               ▼                    ▼                   ▼
         ┌──────────────────────────────────────────────────┐
         │             Supabase (External)                  │
         │   PostgreSQL Database  ·  Supabase Auth          │
         └──────────────────────────────────────────────────┘
```

### The Three Subsystems

**1. Public Website**  
All public-facing pages (`/`, `/ipo`, `/ipo/[slug]`, `/gmp`, `/ipo-calendar`, `/brokers`, and all educational pages) are **async Server Components** that query Supabase directly on the server during request handling. The HTML arrives at the browser mostly complete. Only interactive islands (GMP table, load-more pagination) hydrate as Client Components.

**2. Admin Panel** (`/admin`)  
The admin panel is a single-page experience rendered as a Client Component (`AdminDashboard`). The browser loads the component, which then queries Supabase directly via the public anon key using `@supabase/ssr`'s `createBrowserClient`. This means the admin panel operates entirely in the browser after initial navigation to `/admin`.

**3. API Layer** (`/api/*`)  
Four Route Handlers act as server-side intermediaries:
- `/api/ipos` — Serves paginated IPO data to `IpoLoadMoreClient`
- `/api/fetch-ipo` — Returns a placeholder Clearbit logo URL for a given company name (used by AdminForm autofill)
- `/api/fetch-gmp` — Returns a random GMP value (stub, marked "temporary demo" in code)
- `/api/gmp-histpry/[id]` — Returns GMP history records for a given IPO ID

### Runtime Boundaries

| Boundary | What Runs There |
|----------|----------------|
| **Next.js Server** (Node.js process) | Async Server Components, Route Handlers, `lib/supabaseServer.ts`, `lib/ipo.server.ts`, `lib/ipoFeed.ts` |
| **Browser** | `"use client"` components: `Navbar`, `IpoCard`, `IpoLoadMoreClient`, `GmpTableClient`, `GmpChart`, all Admin components, Auth page |
| **Supabase** | PostgreSQL tables (`ipos`, `brokers`, `gmp_history`, `subscription_history`), Supabase Auth, stored procedure `get_ipos_page` |
| **Google Analytics** | External analytics, loaded lazily in browser via `strategy="lazyOnload"` |

**Evidence:** `app/layout.tsx`, `lib/supabaseServer.ts`, `lib/ipo.server.ts`, `components/AdminDashboard.tsx` (line 10-13).

---

## 2. Runtime Request Lifecycle

### 2.1 Homepage (`/`)

```
Browser requests GET /
         │
         ▼
Next.js matches app/page.tsx (async Server Component)
         │
         ▼
Server creates Supabase server client (createSupabaseServerClient)
— reads cookies() from Next.js headers for auth state
         │
         ▼
Server queries Supabase: getIpoFeedPage({ limit: 6, supabase })
— calls RPC get_ipos_page with p_limit=7 (limit+1 for hasMore detection)
— snapshot is set to current ISO timestamp
         │
         ▼
Server queries Supabase: brokers table (inside BrokerList Server Component)
— WHERE is_active = true ORDER BY sort_order, name LIMIT 4
         │
         ▼
React renders Server Component tree to HTML:
  Navbar (Client Component island, shell rendered)
  → Hero section (static HTML)
  → IPO section: IpoList → IpoCard × 6 (Client Component shells)
  → BrokerList → BrokerCard × 4 (Server Component, fully rendered)
  → Footer (static HTML)
         │
         ▼
HTML + RSC payload streamed to browser
         │
         ▼
Browser displays full page
         │
         ▼
React hydration:
— Navbar hydrates (scroll handlers, active indicator, mobile menu)
— IpoCard hydrates (minimal, for status badge animations)
— IpoLoadMoreClient does NOT mount on homepage (only on /ipo page)
```

**Evidence:** `app/page.tsx`, `lib/ipoFeed.ts`, `components/BrokerList.tsx`, `components/IpoCard.tsx`.

---

### 2.2 IPO Listing Page (`/ipo`)

```
Browser requests GET /ipo[?status=X&type=Y&q=Z]
         │
         ▼
Next.js matches app/ipo/page.tsx (async Server Component)
— unstable_noStore() called: Next.js cache bypassed unconditionally
         │
         ▼
searchParams parsed: status (Open/Upcoming/Listed/Closed/All), type (mainboard/sme), q (search string)
         │
         ▼
Server calls getIpoFeedPage with filters applied
— All three filters passed to get_ipos_page RPC as p_status, p_type, p_q
— snapshot = current ISO timestamp (new for every request because noStore)
         │
         ▼
Server renders complete HTML:
— Hero section (static)
— Filter toolbar (static HTML links with active state computed server-side)
— IpoLoadMoreClient rendered with initialItems, initialHasMore, initialNextCursor, snapshot
         │
         ▼
HTML streamed to browser
         │
         ▼
IpoLoadMoreClient hydrates as Client Component:
— Sets local state: items=initialItems, hasMore, nextCursor, snapshot
— Renders IpoList (grid of IpoCard) from state
         │
         ▼
User clicks "Show More IPOs":
— IpoLoadMoreClient calls fetch("/api/ipos?limit=6&snapshot=...&cursor...")
— Response merges new items into existing list (deduplicating by ID)
— Button hidden when hasMore = false
```

**Key interaction:** The `snapshot` parameter is passed on every load-more call to ensure pagination cursor consistency (the Supabase RPC uses it to hold a stable result window across pages).

**Evidence:** `app/ipo/page.tsx` (line 102, 113-119), `components/IpoLoadMoreClient.tsx`, `lib/ipoFeed.ts`, `app/api/ipos/route.ts`.

---

### 2.3 IPO Detail Page (`/ipo/[slug]`)

```
Browser requests GET /ipo/example-company-ipo
         │
         ▼
Next.js matches app/ipo/[slug]/page.tsx
— Params extracted: rawSlug = "example-company-ipo"
— sanitizeIpoSlug() validates: trims, rejects "/" "?" "#" in slug
         │
         ▼
generateMetadata() runs first (for <head> tags):
— getCachedIpoBySlug(slug) called (React cache wraps supabase anon query)
         │
         ▼
Page function runs second:
— getCachedIpoBySlug(slug) called again → cache hit, same request (no second DB call)
— Two additional queries run:
  1. subscription_history WHERE ipo_id = X ORDER BY day ASC
  2. gmp_history WHERE ipo_id = X ORDER BY created_at ASC
         │
         ▼
Server computes all display values from returned data:
— priceBand, latestGmp, gmpSeries, gmpChangePercent, trendUp, highGmp, lowGmp
— gmpVsIssuePricePercent (latestGmp / issuePrice * 100)
— allotmentBadge (priority logic: adminMarkedOut > isListed > isAllotmentDayReached)
— timeAgo() for last GMP update
— renderPoints() for about_company, strengths, risks, objectives text
         │
         ▼
Server renders complete HTML:
— BreadcrumbList JSON-LD injected
— Hero: IPO name, type badge, status badge, allotment badge
— GMP panel: current GMP, trend arrow, change %, high/low, last updated
— GmpChart rendered as Client Component shell (receives gmpSeries as prop)
— Timeline: Open/Close/Allotment/Refund/Listing dates
— Subscription table: QIB, NII, RII, BHNI, SHNI, Total
— Lot table: Retail, SHNI, BHNI min/max
— About / Objectives / Strengths / Risks (admin-authored long-form text)
— Promoter holding, reservations table
— Issue details, lead managers, registrar, document links
— Valuation metrics table (EPS, PE, ROCE, D/E, PAT margin, Market Cap)
— Company and registrar contacts
         │
         ▼
HTML streamed to browser
         │
         ▼
GmpChart hydrates (Recharts LineChart rendered in browser):
— Draws gradient line chart from gmpSeries data prop passed from server
— No further network call — data already serialized from server render
```

**Note:** The GMP chart data comes from `gmp_history` fetched server-side. The `/api/gmp-histpry/[id]` route handler is a separate endpoint consumed by other contexts, but `app/ipo/[slug]/page.tsx` fetches `gmp_history` directly in the Server Component, not via that API endpoint.

**Evidence:** `app/ipo/[slug]/page.tsx` (lines 11-19, 127-211, 254-262), `lib/ipo.server.ts`, `components/GmpChart.tsx`.

---

### 2.4 GMP Page (`/gmp`)

```
Browser requests GET /gmp[?status=X&sort=Y&active=1&type=Z]
         │
         ▼
Next.js matches app/gmp/page.tsx (async Server Component)
         │
         ▼
searchParams parsed: filterStatus, sort, activeOnly (active===1), typeFilter
         │
         ▼
Query 1 (unbounded): supabase.from("ipos").select(10 specific columns)
— No WHERE clause, no LIMIT — returns all IPO rows
— Returns: id, name, slug, gmp, sub_total, price bands, dates, ipo_type
         │
         ▼
sortIposByNewestOpenDate() applied client-side on full dataset
         │
         ▼
Query 2 (unbounded): supabase.from("gmp_history")
  .select("ipo_id, gmp, created_at")
  .in("ipo_id", allIpoIds)
  .order("created_at", { ascending: false })
— Returns full GMP history for all IPOs
— gmpMap built: { [ipo_id]: { latest: lastGmp, prev: secondLastGmp } }
         │
         ▼
Server renders:
— GmpTableClient (Client Component) receives:
  data=sortedIpos, gmpMap, filterStatus, sort, activeOnly, typeFilter
  (All data serialized as props — no further fetch from GmpTableClient)
         │
         ▼
GmpTableClient hydrates:
— All filtering (status, type, active, search) happens in-memory in browser
— Virtual scroll: VISIBLE_COUNT=18 rows rendered at a time from filtered list
— Sort toggling (GMP / Subscription) happens in-memory
— GMP trend arrows computed from gmpMap[ipo.id].latest - .prev
```

**Evidence:** `app/gmp/page.tsx` (lines 78-128), `components/GmpTableClient.tsx`.

---

### 2.5 Broker Page (`/brokers`)

```
Browser requests GET /brokers
         │
         ▼
Next.js matches app/brokers/page.tsx (async Server Component)
         │
         ▼
BrokerList Server Component executes:
— supabase.from("brokers")
    .select(all fields)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    (no limit — returns all active brokers)
         │
         ▼
normalizeBrokerRows() casts every field to string | null (type safety)
         │
         ▼
Server renders BrokerCard per broker (no hydration needed — no interactivity)
— Each card: name, charges, notes, "Open Account" CTA link (external)
         │
         ▼
Static HTML sent to browser. No client hydration for broker cards.
```

**Evidence:** `components/BrokerList.tsx`, `components/BrokerCard.tsx`.

---

### 2.6 Admin Login (`/auth`)

```
Browser requests GET /auth
         │
         ▼
Next.js matches app/auth/page.tsx (Client Component)
         │
         ▼
Browser renders login form (email + password inputs)
         │
         ▼
User submits form:
— handleLogin() called
— setLoading(true)
— supabase.auth.signInWithPassword({ email, password })
  (supabase here = createBrowserClient from @supabase/ssr)
         │
         ▼
Supabase Auth returns: { data: { user, session }, error }
         │
         ▼
On error:
— setError(error.message)
— alert() displayed (hardcoded in code)
         │
         ▼
On success:
— Supabase auth session cookies set in browser
— window.location.href = "/admin" (hard navigation, not Next.js router)
         │
         ▼
Browser navigates to /admin (full page reload)
```

**Evidence:** `app/auth/page.tsx`.

---

### 2.7 Admin Dashboard (`/admin`)

```
Browser navigates to /admin (hard navigation from /auth)
         │
         ▼
Next.js matches app/admin/page.tsx (Server Component wrapper)
— page.tsx contains only: return <AdminDashboard />
         │
         ▼
AdminDashboard Client Component mounts in browser
         │
         ▼
On mount (useEffect with [] dependency):
— fetchIpos(): supabase.from("ipos").select("*") (no limit, no WHERE)
  → sortIposByNewestOpenDate() applied → setIpos(list) → setFiltered(list)
— fetchBrokers(): supabase.from("brokers").select("*").order("sort_order")
  (Supabase here = createBrowserClient at module level, lines 10-13)
         │
         ▼
Browser renders admin UI:
— Tab bar: IPOs / Brokers / Settings
— IPO tab (default): table of all fetched IPOs, search, status filter
— Brokers tab: table of all fetched brokers
— Settings tab: placeholder text
         │
         ▼
User interactions (all in-browser, direct Supabase calls):
— Search: filters local `ipos` state (no server round-trip)
— Status filter: filters local `ipos` state (no server round-trip)
— Edit IPO: setEditingIpo(ipo), setShowForm(true) → AdminForm modal opens
— Delete IPO: setDeleteId, setDeleteType → DeleteConfirmModal → confirmDelete()
  → supabase.from("ipos").delete().eq("id", deleteId) → fetchIpos() refresh
— Inline GMP: updateGmp() → update ipos + insert gmp_history → fetchIpos()
— Duplicate: duplicateIpo() → insert new row with " (Copy)" suffix + timestamp slug
```

**Evidence:** `app/admin/page.tsx`, `components/AdminDashboard.tsx`.

---

### 2.8 API Endpoints

**`GET /api/ipos`** (called by `IpoLoadMoreClient`):
```
IpoLoadMoreClient calls fetch("/api/ipos?limit=6&snapshot=...&cursor...")
         │
         ▼
Route Handler: GET app/api/ipos/route.ts
— dynamic = "force-dynamic" (no caching)
— createSupabaseServerClient() (reads cookies, server-only)
— calls getIpoFeedPage(supabase, parsed params)
         │
         ▼
getIpoFeedPage calls: supabase.rpc("get_ipos_page", { p_limit: 7, p_status, p_type, p_q, p_snapshot, cursor fields })
         │
         ▼
Results normalized by normalizeIpoEntry() → typed IPOListItem objects
hasMore detected: if results.length > pageLimit
nextCursor: last visible item's { open_date, created_at, slug }
         │
         ▼
NextResponse.json({ items, hasMore, nextCursor, snapshot })
```

**`GET /api/gmp-histpry/[id]`** (called by GmpChart in some contexts):
```
fetch("/api/gmp-histpry/42")
         │
         ▼
Route Handler creates new createClient() per request (anon key)
— supabase.from("gmp_history")
    .select("*")
    .eq("ipo_id", id)
    .order("created_at", { ascending: true })
         │
         ▼
Returns JSON array of history records
```

Note: In the IPO detail page, `gmp_history` is fetched directly in the Server Component — not via this API route.

**Evidence:** `app/api/ipos/route.ts`, `app/api/gmp-histpry/[id]/route.ts`, `components/IpoLoadMoreClient.tsx`.

---

## 3. Rendering Architecture

### Server Components (No `"use client"` directive)

These execute entirely on the server, have direct access to Node.js environment, and can call `createSupabaseServerClient()`:

| Component / Page | Rendering Mode | Notes |
|------------------|---------------|-------|
| `app/layout.tsx` | Server Component | Wraps all pages; loads Navbar, Google Analytics scripts |
| `app/page.tsx` | Async Server Component | Fetches IPO feed + triggers BrokerList fetch |
| `app/ipo/page.tsx` | Async Server Component | `unstable_noStore()` prevents any cache |
| `app/ipo/[slug]/page.tsx` | Async Server Component | Three parallel-ish Supabase queries |
| `app/gmp/page.tsx` | Async Server Component | Unbounded IPO + gmp_history queries |
| `app/ipo-calendar/page.tsx` | Async Server Component | Unbounded `select("*")` on ipos |
| `app/brokers/page.tsx` | Async Server Component | Delegates fetch to BrokerList |
| `components/BrokerList.tsx` | Async Server Component | Fetches brokers; renders BrokerCard |
| `components/IpoList.tsx` | Server Component | Pure renderer; no data fetch |
| Educational pages | Server Component | No database access |
| `app/sitemap.ts` | Server route | Calls `getSanitizedIpoSlugs()` from ipo.server.ts |
| `app/robots.ts` | Server route | Static configuration |

### Client Components (`"use client"` directive)

These ship JavaScript to the browser and hydrate:

| Component | Why It's a Client Component |
|-----------|---------------------------|
| `components/Navbar.tsx` | Uses `usePathname`, scroll events, `useLayoutEffect`, `useRef` |
| `components/IpoCard.tsx` | Has `"use client"` directive (for `animate-pulse` status badges) |
| `components/IpoLoadMoreClient.tsx` | Manages pagination state, calls fetch() on user action |
| `components/GmpTableClient.tsx` | Manages in-memory filter/sort/search/virtual-scroll state |
| `components/GmpChart.tsx` | Recharts requires DOM/canvas access |
| `components/GmpSearch.tsx` | Manages input state, manipulates DOM |
| `app/auth/page.tsx` | Manages form state, calls Supabase Auth |
| `app/admin/page.tsx` + `AdminDashboard` | All admin state and Supabase writes happen in browser |
| `components/AdminForm.tsx` | 94-field form state, keyboard nav, derived calculations |
| `components/AdminSessionGuard.tsx` | Listens to window events for inactivity timeout |

### Hydration Boundaries

A hydration boundary is the point where server-rendered HTML transitions to browser-managed React state.

```
app/layout.tsx (Server)
    │
    ├─ <Navbar /> ← HYDRATION BOUNDARY
    │              Browser takes over: scroll, pathname, indicator animation
    │
    ├─ <main>
    │    │
    │    └─ (page content, depends on route)
    │         │
    │         └─ For /ipo:  <IpoLoadMoreClient /> ← HYDRATION BOUNDARY
    │                        Browser: items state, fetch on click
    │                            │
    │                            └─ <IpoList> → <IpoCard /> ← HYDRATION BOUNDARY
    │                                           Each card has minimal hydration
    │         │
    │         └─ For /gmp: <GmpTableClient /> ← HYDRATION BOUNDARY
    │                       Browser: filter/sort/search/virtual scroll
    │         │
    │         └─ For /ipo/[slug]: <GmpChart /> ← HYDRATION BOUNDARY
    │                              Browser: Recharts line chart rendering
    │
    └─ <footer /> (Server, no hydration)
```

### Caching Behavior

- **`app/ipo/page.tsx`:** `unstable_noStore()` — every request hits Supabase, no Next.js caching.
- **`app/api/ipos/route.ts`:** `export const dynamic = "force-dynamic"` — same effect for this route.
- **`app/ipo/[slug]/page.tsx`:** No cache control set explicitly on the page. `getCachedIpoBySlug()` uses `React.cache()` for in-request deduplication between `generateMetadata` and the page function.
- **`lib/ipo.server.ts`:** `getIpoBySlug` wrapped with `React.cache()` — deduplicates within a single server render, does not persist across requests.
- **Other pages:** No explicit `noStore` or `revalidate` — Next.js default applies. Cannot be verified exactly without build output.

**Evidence:** `app/ipo/page.tsx` (line 7, 102), `app/api/ipos/route.ts` (line 5), `app/ipo/[slug]/page.tsx` (lines 11-19), `lib/ipo.server.ts` (lines 51-75).

---

## 4. Component Relationship Graph

```
app/layout.tsx (Server Component — root of every page)
├── <Navbar /> (Client Component)
│     └── <NavLink> rendered per LINKS entry (5 items: /, /ipo, /gmp, /ipo-calendar, /brokers)
│
├── <main> {children} — page content injected here
│     │
│     ├── [/] app/page.tsx
│     │     ├── <IpoLoadMoreClient /> (Client Component)
│     │     │     └── <IpoList /> → <IpoCard /> × N
│     │     └── <BrokerList /> (Server Component)
│     │           └── <BrokerCard /> × N
│     │
│     ├── [/ipo] app/ipo/page.tsx
│     │     └── <IpoLoadMoreClient /> (Client Component)
│     │           └── <IpoList /> → <IpoCard /> × N
│     │
│     ├── [/ipo/:slug] app/ipo/[slug]/page.tsx (no sub-components except GmpChart)
│     │     └── <GMPChart /> (Client Component — Recharts)
│     │
│     ├── [/gmp] app/gmp/page.tsx
│     │     └── <GmpTableClient /> (Client Component)
│     │           └── <MemoRow /> × VISIBLE_COUNT (virtualized)
│     │
│     ├── [/ipo-calendar] app/ipo-calendar/page.tsx
│     │     └── <Section /> × 3 (Upcoming, Open, Closed) — inline component
│     │
│     ├── [/brokers] app/brokers/page.tsx
│     │     └── <BrokerList /> (Server Component)
│     │           └── <BrokerCard /> × N
│     │
│     ├── [/admin] app/admin/page.tsx
│     │     └── <AdminDashboard /> (Client Component — entire admin)
│     │           ├── <AdminForm /> (Client Component — IPO edit/create modal)
│     │           ├── <BrokerForm /> (Client Component — broker edit modal)
│     │           └── <DeleteConfirmModal /> (Client Component)
│     │
│     └── [/auth] app/auth/page.tsx (Client Component)
│
└── <footer /> (inline in layout.tsx, Server Component)
```

### Reusable Component Relationships

- `IpoCard` is consumed by `IpoList`, which is consumed by both `IpoLoadMoreClient` (on `/ipo`) and directly from `app/page.tsx` (on homepage via `IpoLoadMoreClient`).
- `BrokerList` is consumed by both `app/page.tsx` (with `limit=4`) and `app/brokers/page.tsx` (without limit). Same component, different parameterization.
- `BrokerCard` is consumed only by `BrokerList`.
- `GmpChart` is consumed only by `app/ipo/[slug]/page.tsx`.
- `GmpTableClient` is consumed only by `app/gmp/page.tsx`.
- `AdminForm` is consumed only by `AdminDashboard`.
- `DeleteConfirmModal` is consumed only by `AdminDashboard`.
- `BrokerForm` is consumed only by `AdminDashboard`.

**Evidence:** All page and component import statements.

---

## 5. Dependency Graph

This section explains what depends on what and what would break if a module were removed.

### Core Infrastructure Modules

**`lib/supabaseServer.ts`** (`createSupabaseServerClient`)
- **Imported by:** `app/page.tsx`, `app/ipo/page.tsx`, `app/gmp/page.tsx`, `app/ipo-calendar/page.tsx`, `app/brokers/page.tsx` (via `BrokerList`), `app/api/ipos/route.ts`, `lib/ipoFeed.ts`
- **What it does:** Creates a Supabase client that reads auth cookies from Next.js headers for session awareness. Cookie `set` and `remove` are no-ops (read-only in Server Components).
- **If removed:** All public page data fetching stops. Every Server Component that calls Supabase would fail to instantiate a client.

**`lib/ipoFeed.ts`** (`getIpoFeedPage`, `IpoCursor`, `IpoFeedResult`)
- **Imported by:** `app/page.tsx`, `app/ipo/page.tsx`, `app/api/ipos/route.ts`
- **What it does:** The only function that calls the `get_ipos_page` RPC. Handles cursor construction, normalization of raw rows, hasMore detection (limit+1 trick), snapshot management.
- **If removed:** Homepage feed, `/ipo` page feed, and the load-more API endpoint all stop working.

**`lib/ipo.server.ts`** (`sanitizeIpoSlug`, `getSanitizedIpoSlugs`, `getIpoBySlug`)
- **Imported by:** `app/ipo/[slug]/page.tsx`, `app/sitemap.ts`
- **Marked:** `import "server-only"` — cannot be imported in Client Components.
- **Uses:** Service role key (falls back to anon key). Direct `createClient` (not `createSupabaseServerClient`).
- **If removed:** IPO detail pages can't look up IPOs by slug. Sitemap can't enumerate IPO URLs.

**`lib/ipoSort.ts`** (`sortIposByNewestOpenDate`, `compareByNewestOpenDate`)
- **Imported by:** `app/gmp/page.tsx`, `app/ipo-calendar/page.tsx`, `components/AdminDashboard.tsx`, `components/GmpTableClient.tsx`
- **What it does:** Pure sort function. No dependencies. Sorts by `open_date` descending (newest first).
- **If removed:** GMP page, calendar, admin IPO list, and GMP table all lose their sort order.

**`lib/ipoStatus.ts`** (`getIPOStatus`)
- **Imported by:** `components/IpoCard.tsx`
- **What it does:** Computes IPO main status (Upcoming/Open/Closed/Listed) and allotment badge from date fields. Central authority for this logic (with duplicates elsewhere).

**`lib/allotmentStatus.ts`** (`getAllotmentBadge`)
- **Imported by:** Cannot confirm active import from observable page files. Same logic also exists inline in `IpoCard.tsx` and `app/ipo/[slug]/page.tsx`.

**`lib/site-url.ts`** (`CANONICAL_ORIGIN`, `canonicalUrl`)
- **Imported by:** `app/layout.tsx`, all page files for canonical URLs and JSON-LD, `app/sitemap.ts`, `app/robots.ts`
- **What it does:** Returns `https://ipocraft.com` as `CANONICAL_ORIGIN`. `canonicalUrl(path)` concatenates origin + path.
- **If removed:** All canonical tags, OG URLs, sitemap URLs, and robots host would break.

**`lib/supabase.ts`** (`supabase` singleton)
- **Imported by:** `app/ipo/[slug]/page.tsx` (for `subscription_history` and `gmp_history` queries), `components/AdminForm.tsx`
- **What it does:** Module-level singleton using `createClient` with anon key. Not SSR-aware (no cookie reading).
- **If removed:** IPO detail page can't fetch subscription/GMP history. AdminForm can't save data.

**`components/IpoCard.tsx`** (exports `IPOListItem` type)
- **Type imported by:** `components/IpoList.tsx`, `components/IpoLoadMoreClient.tsx`, `lib/ipoFeed.ts`
- **What it does:** Defines the `IPOListItem` interface that flows through the entire IPO listing pipeline.
- **If removed or type moved:** All downstream consumers of `IPOListItem` break.

**Evidence:** All import statements across the codebase.

---

## 6. Business Logic Flow

### 6.1 IPO Status Computation

Two separate code paths compute status. They produce the same result via the same priority logic.

**Path A — `lib/ipoStatus.ts` → `IpoCard.tsx`:**
```
ipo object (from feed)
        │
        ▼
getIPOStatus(ipo)
  — parse open_date, close_date, listing_date, allotment_date as Date objects
  — compare to new Date() (today)
  
  Main status priority:
  1. listing_date <= today → "Listed"
  2. open_date <= today <= close_date → "Open"  
  3. today < open_date → "Upcoming"
  4. close_date < today → "Closed"
  
  Allotment priority:
  1. adminMarkedOut (allotment_out=true/1/"true"/"1" OR allotment_status="out") → "Allotment Out"
  2. status = "Listed" → "Allotment Out"
  3. allotment_date <= today → "Allotment Awaited"
  4. else → null
        │
        ▼
{ status, allotmentStatus } used by IpoCard for badge rendering
```

**Path B — `app/ipo/[slug]/page.tsx` (inline):**
Same priority logic re-implemented inline starting at line 213. The admin override detection is slightly more defensive (checks `ipo.allotment_out === "1"` explicitly).

**Path C — `lib/allotmentStatus.ts`:**
Same priority logic for allotment badge only. Used independently.

**Evidence:** `lib/ipoStatus.ts`, `lib/allotmentStatus.ts`, `app/ipo/[slug]/page.tsx` (lines 213-262), `components/IpoCard.tsx`.

---

### 6.2 Cursor-Based Pagination

```
Initial load (Server Component):
  snapshot = new Date().toISOString()  ← stable timestamp for this session
  getIpoFeedPage({ limit: 6, snapshot })
    → calls get_ipos_page with p_limit=7 (one extra)
    → rows[0..6] returned
    → hasMore = (rows.length > 6) = true if 7 rows came back
    → visibleEntries = rows[0..5]
    → nextCursor = { open_date, created_at, slug } of rows[5]
  
  Returns: { items: 6 IPOs, hasMore: true, nextCursor: {...}, snapshot }

User clicks "Show More":
  IpoLoadMoreClient calls GET /api/ipos?limit=6&snapshot=SAME&cursorOpenDate=...&cursorCreatedAt=...&cursorSlug=...
    → same get_ipos_page RPC, now with cursor fields
    → RPC returns next page starting after the cursor
    → nextCursor advances to the last item of the new page
  
  IpoLoadMoreClient merges new items: deduplicates by ID using Set
```

The `snapshot` is the critical consistency mechanism. By passing the same timestamp from the initial server render through every subsequent load-more call, the RPC can produce stable ordered results even if new IPOs are inserted between pages.

**Evidence:** `lib/ipoFeed.ts` (lines 140-184), `components/IpoLoadMoreClient.tsx` (lines 61-95).

---

### 6.3 GMP History Recording

Two separate triggers write to `gmp_history`. Both are in-browser operations via the anon key browser client.

**Trigger 1 — AdminDashboard inline GMP update:**
```
Admin enters a number in the inline GMP field for a row
→ updateGmp(ipo) called
→ supabase.from("ipos").update({ gmp: value }).eq("id", ipo.id)
→ if no error: supabase.from("gmp_history").insert({ ipo_id: ipo.id, gmp: value })
→ setToast("GMP updated successfully") or "GMP updated (history not saved)" on history failure
→ fetchIpos() refreshes the full table
```

**Trigger 2 — AdminForm full IPO save:**
```
Admin saves full IPO record via AdminForm
→ handleSubmit() assembles payload from all 94 form fields
→ if ipo.id exists: supabase.from("ipos").update(payload).eq("id", ipoId)
  else: supabase.from("ipos").insert([payload])
→ After successful save: if newGmp !== oldGmp (value changed)
  → supabase.from("gmp_history").insert({ ipo_id: persistedIpoId, gmp: newGmp })
→ GMP history insert failure is caught separately (console.warn, not blocking)
```

**Evidence:** `components/AdminDashboard.tsx` (lines 203-242), `components/AdminForm.tsx` (lines 1034-1052).

---

### 6.4 Subscription Display Logic

Subscription data is stored as five numeric columns: `sub_total`, `sub_qib`, `sub_nii`, `sub_rii` + `sub_bhni`, `sub_shni` (the latter two added via the migration). These are passed through the feed as part of `IPOListItem` and displayed directly on cards and detail pages.

`sub_total` has special handling in `lib/ipoFeed.ts` (line 124-129): if the value is already a number it's kept as-is; if it's any other type it's converted to string. This is because `sub_total` is rendered either as a number or as a text string depending on the context.

On `IpoCard`, subscription is displayed with an "x" suffix (e.g., "23.45x"). On the detail page, each investor category is shown in a table row.

**Evidence:** `lib/ipoFeed.ts` (lines 124-129), `components/IpoCard.tsx`, `app/ipo/[slug]/page.tsx`.

---

### 6.5 Search Flow

Two different search implementations exist, one server-side and one client-side:

**Server-side search (`/ipo` page):**
```
User submits search form (type and press Enter or native submit)
→ GET /ipo?q=searchterm (full page navigation)
→ Server passes q to getIpoFeedPage({ q: "searchterm" })
→ RPC handles search: p_q parameter sent to get_ipos_page
→ Server returns filtered results
```

**Client-side inline filtering (also on `/ipo` page):**
A `<script>` tag injected via `dangerouslySetInnerHTML` intercepts the `input` event on the search field. It queries all `a[href^="/ipo/"]` elements and toggles `display:none` based on text match. This operates independently of the server-side search and does not trigger a network request.

**Client-side GMP table search:**
```
GmpTableClient: user types in search input
→ 250ms debounce via useEffect
→ debounced state updates
→ useMemo recomputes filtered array: ipo.name.toLowerCase().includes(debounced)
→ Virtual scroll re-renders from new filtered array
→ Matched text highlighted via highlight() function (React JSX, not innerHTML)
```

**Evidence:** `app/ipo/page.tsx` (lines 258-281), `components/GmpTableClient.tsx` (lines 83-116).

---

### 6.6 Admin Form Auto-Calculate (Lot Amounts)

`AdminForm` has a reactive `useEffect` that fires whenever `lot_size`, `price_max`, or any lot count field changes:

```
useEffect dependency: [form.lot_size, form.price_max, retail_min_lots, retail_max_lots, shni_min_lots, shni_max_lots, bhni_min_lots, bhni_max_lots]
        │
        ▼
calc(lots) = { shares: lots * lot_size, amount: lots * lot_size * price_max }
        │
        ▼
setForm() updates all *_shares and *_amount fields automatically
— retail_min_amount, retail_max_amount
— shni_min_amount, shni_max_amount
— bhni_min_amount, bhni_max_amount
        │
        ▼
These fields are marked readOnly in FIELD_CONFIGS (user cannot edit them directly)
```

**Evidence:** `components/AdminForm.tsx` (lines 766-804).

---

### 6.7 GMP Page Filtering and Sorting

All filtering and sorting on the GMP page happens entirely in-memory after the initial server render. The server passes the full dataset to `GmpTableClient` as a prop.

```
GmpTableClient receives: data (all IPOs), gmpMap (latest/prev per IPO)
        │
        ▼
useMemo [activeOnly, data, debounced, filterStatus, sort, sortDir, sortKey, typeFilter]:
  1. sortIposByNewestOpenDate(data)  ← baseline sort by open_date desc
  2. if filterStatus: filter by getLifecycleStatus() (computed from open/close dates)
  3. if activeOnly: keep only open + upcoming
  4. if typeFilter: filter by ipo_type === "mainboard" | "sme"
  5. if debounced search: filter by name.includes(debounced)
  6. if sortKey (user column click): sort by gmp or sub_total asc/desc
     OR if URL sort param: sort by gmp, sub, or closing-soon
        │
        ▼
Virtual scroll: totalHeight = filtered.length * 48
startIndex = Math.floor(scrollTop / 48)
visibleRows = filtered.slice(startIndex, startIndex + 18)
Spacer rows: top = startIndex * 48, bottom = totalHeight - endIndex * 48
```

The filter links on the GMP page (`/gmp?status=open`, `/gmp?sort=gmp`, etc.) are Next.js `<Link>` components that trigger full page navigations. These cause a new server render with the new `searchParams`, which passes new `filterStatus`/`sort` props into `GmpTableClient`.

**Evidence:** `components/GmpTableClient.tsx` (lines 88-145, 172-180), `app/gmp/page.tsx` (lines 199-263).

---

## 7. Data Flow

### 7.1 Public IPO Feed Data Flow

```
Supabase Database
  → ipos table (PostgreSQL)
  → get_ipos_page() stored procedure (definition not in repository)
        │
        ▼
Supabase JS client (server-side, anon key + cookies)
        │
        ▼
lib/ipoFeed.ts: getIpoFeedPage()
— Calls RPC with limit+1 (hasMore detection)
— normalizeIpoEntry() casts every field to typed values
— Strips non-IPOListItem fields from raw rows
        │
        ▼
app/ipo/page.tsx (Server Component)
— Receives IpoFeedResult: { items: IPOListItem[], hasMore, nextCursor, snapshot }
— Passes all four as props to IpoLoadMoreClient
        │
        ▼
React Server-to-Client serialization (RSC payload)
— Props serialized and sent over the wire to browser
        │
        ▼
IpoLoadMoreClient (Client Component hydrates)
— Initializes state: setItems(initialItems), setHasMore, setNextCursor, setSnapshot
        │
        ▼
IpoList renders IPOListItem[] as IpoCard grid
        │
        ▼
User sees 6 IPO cards
        │
        ▼
User clicks "Show More":
        │
        ▼
fetch("/api/ipos?limit=6&snapshot=...&cursor...")
        │
        ▼
/api/ipos Route Handler → getIpoFeedPage (same path as above, server-side again)
        │
        ▼
Response JSON parsed → items deduplicated → appended to state → new IpoCard grid renders
```

---

### 7.2 GMP History Data Flow (Detail Page)

```
Supabase Database
  → gmp_history table (ipo_id, gmp, created_at)
        │
        ▼
app/ipo/[slug]/page.tsx (Server Component)
— supabase.from("gmp_history").select("gmp, created_at").eq("ipo_id", X).order("created_at", asc)
        │
        ▼
Server computes: gmpSeries (filtered nulls), latestGmp, previousGmp, trend, high, low
        │
        ▼
Server renders: <GMPChart data={gmpSeries} /> (Client Component shell)
— gmpSeries serialized into RSC payload
        │
        ▼
GmpChart hydrates:
— chartData mapped: each point → { gmp, shortDate, fullDate }
— trend detection: latest >= previous → green gradient; else red
— Recharts LineChart renders in browser DOM
```

---

### 7.3 Admin Write Data Flow

```
Admin user edits IPO in AdminForm
        │
        ▼
handleSubmit() assembles payload (94 fields → toNullableText/toNullableNumber)
        │
        ▼
createBrowserClient (anon key) — already instantiated at module level
        │
        ▼
if ipo.id exists: supabase.from("ipos").update(payload).eq("id", id).select().single()
else: supabase.from("ipos").insert([payload]).select().single()
        │
        ▼
Supabase Auth session in browser cookies determines if write is permitted
(dependent on Supabase RLS — cannot be verified from repository)
        │
        ▼
If GMP changed: supabase.from("gmp_history").insert({ ipo_id, gmp })
        │
        ▼
alert("IPO Updated ✅") or alert("IPO Added ✅")
onClose() called → modal closes
AdminDashboard.fetchIpos() refreshes the full IPO table
```

---

### 7.4 Broker Data Flow (Public)

```
Supabase Database → brokers table
        │
        ▼
BrokerList (Async Server Component)
— createSupabaseServerClient()
— .from("brokers").select(all fields).eq("is_active", true).order("sort_order").order("name")
— normalizeBrokerRows() validates and casts to BrokerListItem[]
        │
        ▼
BrokerCard rendered per item — pure HTML output, no JS
        │
        ▼
Fully rendered HTML sent to browser — no hydration
```

---

## 8. Database Relationship Analysis

### Observable Tables

| Table | Confirmed Source |
|-------|----------------|
| `ipos` | Migration file uses `ALTER TABLE IF EXISTS public.ipos` — table predates repository |
| `brokers` | Migration file contains full `CREATE TABLE IF NOT EXISTS public.brokers` |
| `gmp_history` | Referenced in code — no DDL in repository |
| `subscription_history` | Referenced in `app/ipo/[slug]/page.tsx` (line 142-146) — no DDL in repository |

### Relationships Observable from Code

**`gmp_history` → `ipos`:**
- `gmp_history.ipo_id` is compared to `ipos.id` in queries
- In `AdminDashboard.tsx` (line 225): `insert({ ipo_id: ipo.id, gmp })`
- In `app/gmp/page.tsx` (line 113): `.in("ipo_id", ids)` where `ids = ipos.map(i => Number(i.id))`
- The `Number(i.id)` cast suggests `gmp_history.ipo_id` expects a numeric type, while `ipos.id` may be bigint

**`subscription_history` → `ipos`:**
- In `app/ipo/[slug]/page.tsx` (line 142-146): `.from("subscription_history").select("*").eq("ipo_id", ipo.id)`
- Relationship direction: `subscription_history.ipo_id` → `ipos.id`

> **Cannot be verified from the current repository:** Foreign key constraint definitions, indexes on `gmp_history` and `subscription_history`, full column lists for `gmp_history` and `subscription_history`, whether cascade delete is configured.

### Database Read Paths

| Data | Where Read | Client Type |
|------|-----------|------------|
| IPO feed (paginated) | `lib/ipoFeed.ts` → RPC | Server (anon key + cookies) |
| IPO by slug | `lib/ipo.server.ts` | Server (service role key or anon) |
| IPO all fields (detail page) | `app/ipo/[slug]/page.tsx` | Server (anon key singleton) |
| GMP history | `app/ipo/[slug]/page.tsx`, `app/gmp/page.tsx`, `/api/gmp-histpry/[id]` | Server (anon key) |
| Subscription history | `app/ipo/[slug]/page.tsx` | Server (anon key singleton) |
| All IPOs (unbounded) | `app/gmp/page.tsx`, `app/ipo-calendar/page.tsx`, `AdminDashboard.tsx` | Server (anon) or Browser (anon) |
| Brokers | `BrokerList.tsx`, `AdminDashboard.tsx` | Server (anon) or Browser (anon) |
| IPO slugs | `lib/ipo.server.ts` → `app/sitemap.ts` | Server (service role or anon) |

### Database Write Paths

| Operation | Where Written | Client Type |
|-----------|--------------|------------|
| IPO insert | `AdminForm.tsx` handleSubmit | Browser (anon key) |
| IPO update | `AdminForm.tsx` handleSubmit, `AdminDashboard.tsx` updateGmp | Browser (anon key) |
| IPO delete | `AdminDashboard.tsx` confirmDelete | Browser (anon key) |
| Broker insert | `AdminDashboard.tsx` saveBroker | Browser (anon key) |
| Broker update | `AdminDashboard.tsx` saveBroker | Browser (anon key) |
| Broker delete | `AdminDashboard.tsx` confirmDelete | Browser (anon key) |
| GMP history insert | `AdminDashboard.tsx` updateGmp, `AdminForm.tsx` handleSubmit | Browser (anon key) |

**All writes go through the browser Supabase client using the public anon key. Supabase RLS policies, which cannot be verified from this repository, are the sole server-side authorization layer.**

---

## 9. API Interaction Flow

### 9.1 `GET /api/ipos`

**Caller:** `components/IpoLoadMoreClient.tsx`  
**Trigger:** User clicks "Show More IPOs"

```
IpoLoadMoreClient builds URLSearchParams:
  limit, snapshot, status (if set), type (if set), q (if set),
  cursorOpenDate, cursorCreatedAt, cursorSlug (from nextCursor state)
  → fetch("/api/ipos?{params}", { cache: "no-store" })

Route Handler (server-side):
  → createSupabaseServerClient() (reads request cookies for auth context)
  → parseLimit() → validates number, bounds via normalizeLimit()
  → getIpoFeedPage({ supabase, limit, status, type, q, snapshot, cursor })
     → supabase.rpc("get_ipos_page", {...}) (9 parameters)
     → normalizeIpoEntry() per row
     → hasMore = entries.length > pageLimit
     → nextCursor = last visible entry's cursor
  → NextResponse.json({ items, hasMore, nextCursor, snapshot })

Consumer processes response:
  → deduplicates items by ID against prev state
  → setItems(merged), setHasMore, setNextCursor
  → Re-renders IpoList with new items
  → If !hasMore: "Show More" button disappears

Error path:
  → Route Handler: NextResponse.json({ error: "..." }, { status: 500 })
  → IpoLoadMoreClient: setError("Unable to load more IPOs. Please try again.")
  → Error message shown below button
```

---

### 9.2 `POST /api/fetch-ipo`

**Caller:** `components/AdminForm.tsx` — "Auto-fill" button  
**Trigger:** Admin clicks autofill after entering company name

```
AdminForm.fetchDetails():
  → fetch("/api/fetch-ipo", { method: "POST", body: { companyName: form.name } })

Route Handler:
  → Parses companyName from body
  → Generates a domain guess: companyName.toLowerCase().replace(non-alphanumeric, "").replace spaces with "" + ".com"
  → Constructs Clearbit logo URL: "https://logo.clearbit.com/{domain}"
  → Returns: { logo: url, industry: "To be updated", description: "To be updated", website: null, gmp: null }
  (No external fetch is made inside the handler — only the URL is constructed)

Consumer processes response:
  → if data.logo: setLogo(url) (stored in component state, displayed as preview)
  → if data.industry: setForm(prev => { sector: industry })
  → if data.description: setForm(prev => { about_company: description || prev })
  → if data.gmp != null: setForm(prev => { gmp: String(gmp) })
```

---

### 9.3 `POST /api/fetch-gmp`

**Caller:** `components/AdminForm.tsx` — "Fetch GMP" button  
**Trigger:** Admin clicks "Fetch GMP" button in admin form

```
AdminForm.fetchGMP():
  → fetch("/api/fetch-gmp", { method: "POST", body: { companyName: form.name } })

Route Handler:
  → Returns: { gmp: Math.floor(Math.random() * 200), source: "estimated" }
  (Code comment states this is "temporary demo")

Consumer processes response:
  → setForm(prev => { gmp: String(randomValue) })
```

**Note:** This endpoint generates a random number and is a stub. The code comment in the file states it is a "temporary demo."

**Evidence:** `app/api/fetch-gmp/route.ts`.

---

### 9.4 `GET /api/gmp-histpry/[id]`

**Caller:** GmpChart is used in some contexts that may call this. In `app/ipo/[slug]/page.tsx`, GMP history is fetched server-side and passed as a prop — not via this endpoint.

**Route Handler execution:**
```
GET /api/gmp-histpry/42
  → id = params.id (string from URL)
  → createClient(SUPABASE_URL, SUPABASE_ANON_KEY) — new instance per request
  → supabase.from("gmp_history")
      .select("*")
      .eq("ipo_id", id)
      .order("created_at", { ascending: true })
  → Returns JSON array of all history records for that IPO

Error path:
  → Returns { error: error.message } with status 500
```

**Note:** Folder is named `gmp-histpry` (typo — missing "o" in "history"). This is the live URL path.

---

## 10. Authentication Flow

### Login

```
1. User visits /auth
   → app/auth/page.tsx renders (Client Component)
   → Email + Password form displayed

2. User submits credentials
   → handleLogin() called
   → supabase.auth.signInWithPassword({ email, password })
   → supabase = createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

3. Supabase Auth responds with { user, session } or { error }

4. On success:
   → Supabase sets auth cookies in browser (managed by @supabase/ssr internally)
   → window.location.href = "/admin" (hard navigation)

5. On error:
   → setError(error.message) → displayed in form
   → No retry limit observable
```

### Session Presence

```
User at /admin — AdminDashboard mounts:
  → supabase = createBrowserClient (module-level, already has cookies)
  → Supabase client reads auth cookies automatically
  → If session exists: data operations succeed (subject to RLS)
  → If session expired or invalid: data operations return Supabase errors
```

### Server-Side Route Protection

```
proxy.ts defines a proxy() function:
  → Reads auth cookies via createServerClient
  → If !user && pathname.startsWith("/admin"): redirect to /auth
  → config.matcher: ["/admin/:path*"]

However: middleware.ts does NOT exist in the repository.
proxy.ts is not imported by any Next.js middleware file.

Therefore: Server-side admin route protection cannot be confirmed
from the current repository. The proxy function is defined but
its wiring as Next.js middleware is not observable.
```

### Session Expiration

```
AdminSessionGuard is defined (components/AdminSessionGuard.tsx):
  → Listens to: mousemove, keydown, click, scroll window events
  → Resets 30-minute timer on each event
  → On timeout: supabase.auth.signOut() → router.push("/auth")

However: AdminSessionGuard is not imported or rendered in
app/admin/page.tsx or components/AdminDashboard.tsx.
Its mounting and execution cannot be confirmed from the repository.
```

### Logout

```
AdminLogoutButton component:
  → Calls supabase.auth.signOut()
  → router.push("/auth")

However: AdminLogoutButton mounting location is not confirmed
from observable files.
```

**Evidence:** `app/auth/page.tsx`, `proxy.ts`, `components/AdminSessionGuard.tsx`, `components/AdminLogoutButton.tsx`, `app/admin/page.tsx`, `components/AdminDashboard.tsx`.

---

## 11. State Flow

### Navbar State

```
Local state in Navbar.tsx (Client Component):
  scrolled: boolean  ← window.scrollY > 10
  menuOpen: boolean  ← hamburger toggle
  hoverIndicator: {left, width} | null  ← mouse hover position
  scrollProgress: number  ← scroll % for progress bar
  indicator: {left, width}  ← active link pill position
  initialPulse: boolean  ← one-shot glow on route change

scrolled → CSS shadow class on header
menuOpen → mobile menu rendered/hidden
hoverIndicator → underline indicator positioned via inline style
scrollProgress → progress bar width via inline style
indicator → sliding pill position via transform translate3d
```

### IpoLoadMoreClient State

```
items: IPOListItem[]  ← starts from initialItems prop
hasMore: boolean      ← starts from initialHasMore prop
nextCursor: IpoCursor | null  ← starts from initialNextCursor prop
loading: boolean      ← true during fetch
error: string | null  ← set on fetch failure

Items only grow (merge, never replace on load-more).
useEffect resets all state when any of: initialHasMore, initialItems, initialNextCursor, snapshot, status, type, q changes.
(These change when the parent re-renders with new server data, e.g., after a filter change.)
```

### GmpTableClient State

```
query: string        ← raw search input value
debounced: string    ← debounced search value (250ms delay)
sortKey: "gmp" | "sub" | null  ← which column is sorted by user click
sortDir: "asc" | "desc"        ← sort direction
scrollTop: number    ← current scroll position for virtual scroll
```

All filtering, sorting, and virtual scroll window is derived from these five state values plus the data/gmpMap/filterStatus/sort/activeOnly/typeFilter props (passed from server). No network calls happen after initial load on the GMP page.

### AdminDashboard State

```
tab: "ipos" | "brokers" | "settings"
ipos: IpoRecord[]          ← full list from Supabase
filtered: IpoRecord[]      ← derived from ipos + search + statusFilter
editingIpo: IpoRecord | null
showForm: boolean
brokers: BrokerRecord[]
brokerLoading: boolean
editingBroker: BrokerRecord | null
showBrokerForm: boolean
loading: boolean
search: string
statusFilter: string       ← "All" | "Open" | "Upcoming" | "Listed" | "Closed"
inlineGmp: Record<id, number | "">  ← per-row GMP input values
deleteId: string | null
deleteType: "ipo" | "broker" | null
deleteName: string | null
deleting: boolean
toast: string | null       ← 2.5 second auto-dismiss
```

`filtered` is a derived state: `useEffect` recomputes it whenever `search`, `ipos`, or `statusFilter` changes. It applies text match and status match against the in-memory `ipos` array.

### AdminForm State

```
form: IpoFormState  ← all 94 fields as strings
  → initialized by buildInitialForm(ipo) which reads from existing IPO or empty defaults
  → changes via handleChange() which sets form[name] = value
  → lot amount fields auto-updated by useEffect when lot_size, price_max, or lot counts change

expandedSections: Record<SectionId, boolean>  ← 8 sections, only "essentials" starts expanded
loading: boolean     ← true during Supabase save
autoLoading: boolean ← true during /api/fetch-ipo or /api/fetch-gmp call
logo: string         ← Clearbit logo URL from autofill
description: string  ← autofill description preview
jumpQuery: string    ← field-jump search input
jumpOpen: boolean    ← field-jump dropdown open
```

**Evidence:** All Client Component files.

---

## 12. Error Flow

### Database Errors in Server Components

```
BrokerList.tsx:
  const { data, error } = await query
  if (error) {
    console.error("Failed to fetch brokers:", error)
    return <div className="border-rose-200...">Unable to load broker information.</div>
  }
  → Renders an inline error card visible to users

app/gmp/page.tsx:
  if (iposError) { console.error("IPOS QUERY ERROR:", iposError) }
  → ipos defaults to [] → GmpTableClient renders with empty data
  → User sees "No IPOs found for selected filters"

app/ipo-calendar/page.tsx:
  const { data: ipos } = await supabase.from("ipos").select("*")
  → Destructures without error check → if error, ipos = undefined → sortedIpos = []
  → Page renders with empty sections (sections return null when ipos is empty)
```

### IPO Not Found (404)

```
app/ipo/[slug]/page.tsx:
  const slug = sanitizeIpoSlug(rawSlug)
  if (!slug) notFound()  ← invalid slug format
  
  const ipo = await getCachedIpoBySlug(slug)
  if (!ipo) notFound()   ← slug valid but no record in database
  
  notFound() → Next.js triggers not-found.tsx or default 404 page
```

### API Route Errors

```
app/api/ipos/route.ts:
  catch (error) {
    console.error("Failed to load IPO feed page:", error)
    return NextResponse.json({ error: "Unable to load IPO feed page" }, { status: 500 })
  }
  → IpoLoadMoreClient: catches non-ok response → setError("Unable to load more IPOs. Please try again.")
  → Error rendered below button

app/api/gmp-histpry/[id]/route.ts:
  return NextResponse.json({ error: error.message }, { status: 500 })
```

### Admin Write Errors

```
AdminForm.tsx handleSubmit:
  if (error) {
    alert("Error updating IPO: " + error.message)  ← browser alert dialog
    return  ← does not close modal
  }

  GMP history insert failure:
  if (historyError) { console.warn("GMP history insert failed:", historyError) }
  → Non-blocking: IPO save succeeds even if history insert fails

AdminDashboard.tsx:
  Inline GMP error: alert(error.message || "Failed to update GMP")
  Delete error: setToast(message) → visible for 2.5 seconds
```

### Authentication Errors

```
app/auth/page.tsx:
  if (error) { setError(error.message) }
  → Error displayed in form UI
  
  Additional: alert() called on error (separate from setError)
```

**Evidence:** `components/BrokerList.tsx`, `app/gmp/page.tsx`, `app/ipo/[slug]/page.tsx`, `app/api/ipos/route.ts`, `components/AdminForm.tsx`, `components/AdminDashboard.tsx`, `app/auth/page.tsx`.

---

## 13. Configuration Flow

### Environment Variables

```
Build/Runtime resolution:
  .env.local (local dev, git-ignored)
        │
        ▼
NEXT_PUBLIC_SUPABASE_URL       → public, available in browser + server
NEXT_PUBLIC_SUPABASE_ANON_KEY  → public, available in browser + server
NEXT_PUBLIC_SITE_URL           → public, used by lib/site-url.ts as fallback
SUPABASE_SERVICE_ROLE_KEY      → server-only, no NEXT_PUBLIC_ prefix
```

How each variable flows:

| Variable | Where Used | Code Path |
|----------|-----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Both client and server Supabase clients | `lib/supabaseServer.ts`, `lib/ipo.server.ts`, `lib/supabase.ts`, `components/AdminDashboard.tsx` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both client and server Supabase clients | Same as above + `app/auth/page.tsx` |
| `SUPABASE_SERVICE_ROLE_KEY` | Only `lib/ipo.server.ts` (server-only module) | Falls back to anon key if absent |
| `NEXT_PUBLIC_SITE_URL` | `lib/site-url.ts` → all canonical URLs | `app/layout.tsx`, all page metadata |

### Application Constants

Hardcoded application constants (not environment variables):

| Constant | Value | Location |
|---------|-------|---------|
| `CANONICAL_ORIGIN` | `"https://ipocraft.com"` | `lib/site-url.ts` |
| Google Analytics ID | `"G-V2DGFHC1DY"` | `app/layout.tsx` (lines 53, 61) |
| `DEFAULT_LIMIT` (feed) | `6` | `lib/ipoFeed.ts` (line 4) |
| `MAX_LIMIT` (feed) | `100` | `lib/ipoFeed.ts` (line 5) |
| `ROW_HEIGHT` (GMP table) | `48` | `components/GmpTableClient.tsx` (line 35) |
| `VISIBLE_COUNT` (GMP table) | `18` | `components/GmpTableClient.tsx` (line 36) |
| Session timeout (admin) | `30 minutes` | `components/AdminSessionGuard.tsx` |

### Next.js Configuration (`next.config.ts`)

- `trailingSlash: false` — URLs without trailing slashes
- `turbopack` config present (for dev server)
- No custom headers, rewrites, or redirects configured

### CSS Configuration

`app/globals.css`:
- `color-scheme: light` forced in both `:root` and `html, body`
- `--background: #f8fafc`, `--foreground: #0f172a` as CSS variables
- `scroll-padding-top: 120px` for anchor offset behind sticky headers
- `-webkit-tap-highlight-color: transparent` globally

**Evidence:** `.env.local`, `lib/site-url.ts`, `lib/ipoFeed.ts`, `components/GmpTableClient.tsx`, `app/globals.css`, `next.config.ts`.

---

## 14. External Dependency Analysis

### Next.js 16.1.6

- **Purpose:** Full-stack React framework. Provides App Router, Server Components, Route Handlers, Image optimization, Font loading, Metadata API, Sitemap/Robots generation.
- **Where used:** The entire application runs on Next.js. Every page, route, and component is a Next.js construct.
- **Criticality:** The application cannot run without it.
- **If unavailable:** Total application failure.

### React 19.2.3

- **Purpose:** UI rendering library. Server Components, Client Components, `cache()`, `useState`, `useEffect`, all hooks.
- **Criticality:** Core rendering runtime.
- **If unavailable:** Total application failure.

### Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

- **Purpose:** PostgreSQL database access, Supabase Auth for admin login.
- **Where used:** Every data-fetching page, every admin write operation, authentication flow.
- **`@supabase/ssr`:** Provides `createServerClient` (cookie-aware, server-side) and `createBrowserClient` (browser-side). Used in `lib/supabaseServer.ts` and `components/AdminDashboard.tsx`.
- **`@supabase/supabase-js`:** Provides `createClient` (plain, no cookie awareness). Used in `lib/ipo.server.ts`, `lib/supabase.ts`, `app/api/gmp-histpry/[id]/route.ts`.
- **Criticality:** Every page with data, all admin operations, and authentication depend on Supabase being reachable.
- **If unavailable:** All public pages render empty or error states. Admin panel shows no data and writes fail. Authentication fails.

### Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`)

- **Purpose:** Utility-first CSS framework. All styling in the application is done via Tailwind utility classes.
- **Where used:** Every component and page. No separate CSS modules or styled-components.
- **If unavailable:** All styling breaks. Application is unstyled.

### Recharts v3.1.0

- **Purpose:** React charting library for the GMP history line chart.
- **Where used:** Only `components/GmpChart.tsx`.
- **Criticality:** Only GMP history chart breaks if unavailable. Rest of application functions.
- **If unavailable:** GmpChart renders a fallback "No GMP data yet" message.

### Google Analytics (gtag.js)

- **Purpose:** Page view and event tracking.
- **Where used:** `app/layout.tsx` — loaded via `<Script strategy="lazyOnload">` for every page.
- **Loaded from:** `https://www.googletagmanager.com/gtag/js?id=G-V2DGFHC1DY`
- **Criticality:** Analytics only. Application functions fully without it.
- **If unavailable:** Analytics data not collected. No functional impact.

### Google Fonts (`next/font/google`)

- **Purpose:** `Playfair_Display` and `Inter` typefaces.
- **Where used:** `Inter` in `app/layout.tsx` (body font), both fonts in most page files for hero sections.
- **Loaded via:** `next/font/google` which downloads fonts at build time and serves them from the same origin (no external request at runtime).
- **If unavailable at build:** Falls back to system fonts. No runtime failure.

### `server-only` (npm package)

- **Purpose:** Compile-time guard that throws an error if a module is imported in a Client Component.
- **Where used:** `lib/ipo.server.ts` (line 1: `import "server-only"`)
- **Criticality:** Safety guard only. If removed, `lib/ipo.server.ts` could accidentally be bundled client-side (exposing the service role key path).

**Evidence:** `package.json`, all component import statements, `app/layout.tsx`, `components/GmpChart.tsx`.

---

## 15. Internal Module Analysis

### `lib/` — Business Logic and Infrastructure

The `lib/` directory contains pure utility functions and shared infrastructure. No UI code lives here.

```
lib/
├── supabase.ts        — Module-level singleton Supabase client (anon key, no cookies)
│                        Used where SSR cookie-awareness is not needed: ipo/[slug]/page.tsx, AdminForm
├── supabaseServer.ts  — Factory: createSupabaseServerClient()
│                        Creates cookie-aware server client per request
│                        Used by all public Server Components and API routes
├── ipo.server.ts      — Server-only IPO lookup utilities
│                        sanitizeIpoSlug, getIpoBySlug (cached), getSanitizedIpoSlugs
│                        Uses service role key if available
│                        Imported by detail page and sitemap
├── ipoFeed.ts         — Pagination engine
│                        getIpoFeedPage → calls get_ipos_page RPC
│                        Types: IpoCursor, IpoFeedResult
│                        Used by homepage, /ipo page, /api/ipos route handler
├── ipoSort.ts         — Pure sort utilities
│                        sortIposByNewestOpenDate, compareByNewestOpenDate
│                        Used by GMP page, calendar, admin, GmpTableClient
├── ipoStatus.ts       — IPO status computation
│                        getIPOStatus → { status, allotmentStatus }
│                        Used by IpoCard
├── allotmentStatus.ts — Allotment badge computation
│                        getAllotmentBadge → "Allotment Out" | "Allotment Awaited" | null
│                        Same priority logic as ipoStatus.ts and inline in [slug]/page.tsx
└── site-url.ts        — URL utilities
                         CANONICAL_ORIGIN = "https://ipocraft.com"
                         canonicalUrl(path) → full URL
                         Used by all pages for metadata and JSON-LD
```

### `components/` — UI Components

A flat directory of 18 TypeScript/TSX files. No subdirectory organization.

```
Shared Public Components:
  IpoCard.tsx         — IPO list card (Client, with IPOListItem type export)
  IpoList.tsx         — Grid wrapper for IpoCard (Server)
  IpoLoadMoreClient.tsx — Pagination controller (Client)
  BrokerCard.tsx      — Broker display card (Server, with BrokerListItem type export)
  BrokerList.tsx      — Broker grid fetcher (Async Server)
  GmpChart.tsx        — Recharts line chart (Client)
  GmpTableClient.tsx  — Full GMP interactive table with virtual scroll (Client)
  GmpTable.tsx        — Alternative GMP table without virtual scroll (Client)
  GmpSearch.tsx       — DOM-manipulation search input (Client)
  Navbar.tsx          — Application navigation (Client)

Admin Components:
  AdminDashboard.tsx  — Full admin panel (Client, 664 lines)
  AdminForm.tsx       — 94-field IPO form (Client, 2468 lines)
  AdminBrokerForm.tsx — Broker form (Client)
  BrokerForm.tsx      — Broker form used by AdminDashboard (Client)
  AdminStats.tsx      — Stats display (Client/Server, 974 bytes)
  AdminLogoutButton.tsx — Logout action (Client)
  AdminSessionGuard.tsx — Inactivity timeout (Client)
  DeleteConfirmModal.tsx — Confirm dialog (Client)
```

### `app/` — Pages and Routes

The Next.js App Router directory. Contains all pages, layouts, and API routes.

```
Public Pages (Server Components):
  layout.tsx            — Root layout (Navbar + Footer + GA scripts)
  page.tsx              — Homepage
  ipo/page.tsx          — IPO listing with filters
  ipo/[slug]/page.tsx   — IPO detail (largest file: 1529 lines)
  gmp/page.tsx          — GMP tracker
  ipo-calendar/page.tsx — Calendar view
  brokers/page.tsx      — Broker comparison
  about/, contact/, privacy/, terms/ — Static info pages
  what-is-ipo-gmp/, how-ipo-allotment-works/,
  ipo-subscription-meaning/, qib-hni-retail-explained/,
  ipo-grey-market-guide/ — Educational guides

Admin:
  admin/page.tsx        — Renders <AdminDashboard />
  auth/page.tsx         — Login form (Client Component)
  auth/callback/route.ts — OAuth code exchange handler

API Routes:
  api/ipos/route.ts          — GET: paginated IPO feed
  api/fetch-ipo/route.ts     — POST: logo/industry autofill (stub)
  api/fetch-gmp/route.ts     — POST: GMP fetch (random stub)
  api/gmp-histpry/[id]/route.ts — GET: GMP history records

SEO:
  sitemap.ts   — Dynamic sitemap
  robots.ts    — Robots.txt
```

### `supabase/` — Database Migrations

```
supabase/migrations/
  20260228143000_content_depth_and_brokers.sql
  — Enables pgcrypto extension
  — Adds ~20 columns to ipos table (idempotent via ADD COLUMN IF NOT EXISTS)
  — Creates brokers table with full DDL
  — Creates set_updated_at() trigger function
  — Applies trigger on brokers table
```

### `scripts/` — Developer Tools

```
scripts/
  check-redirects.mjs
  — CLI tool: accepts URLs via --base and --file or positional args
  — Follows redirect chains (max 10 hops)
  — Extracts canonical URL from HTML response
  — Reports: final URL, status, redirect count, canonical match, pass/fail
  — Exits with code 1 if any URL fails
  — Invoked by: npm run seo:check-redirects
```

### How Modules Interact

```
app/[page].tsx (Server)
  ↓ imports
lib/supabaseServer.ts
  ↓ creates Supabase client with cookies
lib/ipoFeed.ts (for feed pages)
  ↓ calls
Supabase RPC "get_ipos_page"
  ↓ returns
Normalized IPOListItem[]
  ↓ passed as prop to
components/IpoLoadMoreClient (Client)
  ↓ on user action: fetch()
app/api/ipos (Route Handler)
  ↓ reuses
lib/ipoFeed.ts (same module, same path)
```

```
components/AdminDashboard (Client, module-level supabase)
  ↓ opens modal with
components/AdminForm (Client)
  ↓ on submit: uses
lib/supabase.ts (singleton)
  ↓ writes to
Supabase Database
  ↓ triggers
AdminDashboard.fetchIpos() (refresh)
```

**Evidence:** All import statements in all module files.

---

## 16. System Dependency Map

### Critical Path: Public IPO Feed

```
User → GET / or /ipo
  ↓
app/page.tsx or app/ipo/page.tsx (Server Component)
  ↓
lib/ipoFeed.ts (getIpoFeedPage)
  ↓
lib/supabaseServer.ts (createSupabaseServerClient)
  ↓
Supabase RPC: get_ipos_page
  ↓
PostgreSQL: ipos table
  ↓
Normalized IPOListItem[] returned
  ↓
components/IpoLoadMoreClient (renders IpoList → IpoCard × N)
  ↓
User sees IPO cards
```

Failure at any step: Database unreachable → `getIpoFeedPage` throws → page renders error state or empty list.

---

### Critical Path: IPO Detail Page

```
User → GET /ipo/example-company-ipo
  ↓
app/ipo/[slug]/page.tsx
  ↓ (1) sanitizeIpoSlug
lib/ipo.server.ts
  ↓ (2) slug query
Supabase: ipos table (service role or anon key)
  ↓ (3) gmp_history query
Supabase: gmp_history table (anon singleton from lib/supabase.ts)
  ↓ (4) subscription_history query
Supabase: subscription_history table
  ↓
Server computes all display values
  ↓
GmpChart rendered as Client Component shell (receives gmpSeries prop)
  ↓
HTML streamed to browser
  ↓
GmpChart hydrates → Recharts renders chart
```

If `subscription_history` table doesn't exist: query errors but page may still render (no explicit error guard for this query in the observable code at line 142-146 — the destructuring `{ data: subscriptionHistory }` discards errors silently).

---

### Critical Path: Admin Write

```
Admin user at /admin
  ↓
components/AdminDashboard (module-level createBrowserClient)
  ↓ Edit button → AdminForm modal opens
components/AdminForm
  ↓ Admin fills fields, clicks Save
handleSubmit() assembles 94-field payload
  ↓
supabase (anon key singleton from lib/supabase.ts)
  → .from("ipos").update(payload).eq("id", id)
  ↓
Supabase Auth validates session + RLS policies
  ↓
On success: gmp_history insert (if GMP changed)
  ↓
alert("IPO Updated ✅") → onClose() → AdminDashboard.fetchIpos()
```

---

### Critical Path: Sitemap Generation

```
GET /sitemap.xml
  ↓
app/sitemap.ts (Server Route)
  ↓
lib/ipo.server.ts: getSanitizedIpoSlugs()
  ↓
Supabase: ipos table .select("slug")
  ↓
All slugs sanitized, deduplicated
  ↓
Static page routes + dynamic IPO URLs combined
  ↓
MetadataRoute.Sitemap[] returned → XML generated by Next.js
```

---

## 17. Repository Knowledge Map

A new senior engineer joining IPOCraft should understand the following mental model:

---

### "How is data organized?"

There are three tables that matter: `ipos` (core data, 60+ columns), `brokers` (broker comparison data), and `gmp_history` (time series of GMP values per IPO). A fourth table `subscription_history` is referenced in the IPO detail page but its DDL is not in the repository.

---

### "How does a page get its data?"

Almost every public page is a Server Component that imports `createSupabaseServerClient()` and runs a Supabase query. The result flows down as props. No client-side fetching happens on initial page load for any public page — everything is done server-side.

The exception is the GMP table: all IPO data is loaded server-side and passed to `GmpTableClient`, which then manages filtering and virtual scrolling entirely in-memory in the browser.

---

### "Where does pagination happen?"

Pagination only happens on the IPO listing feed. It uses a cursor pattern. The server loads the first 6 items. The browser renders them. When the user clicks "Show More," `IpoLoadMoreClient` calls `/api/ipos` with the cursor from the previous page. The server calls the same `get_ipos_page` RPC. Results are appended to the existing list.

The `snapshot` timestamp ensures that even as new IPOs are added to the database, the user's paginated view stays stable across all load-more calls.

---

### "Where does admin data modification happen?"

All admin writes happen directly from the browser. `AdminDashboard` is a Client Component that creates a Supabase browser client at module level. There is no server-side admin API. When an admin saves an IPO, the browser calls Supabase directly using the anon key. Supabase Row Level Security policies are the authorization boundary — but their definitions are not in this repository.

---

### "What is the rendering split?"

Think of it as: anything that needs interactivity is a Client Component; everything else is a Server Component. The boundary is well-placed — the data fetching is all server-side, and only the interactive islands (search, pagination, GMP table, charts, admin) are client-side.

---

### "Where is business logic?"

The `lib/` directory is the home of all business logic:
- `ipoFeed.ts` — how IPOs are paginated and fetched
- `ipoStatus.ts` — how an IPO's status and allotment badge are computed
- `allotmentStatus.ts` — allotment badge logic (duplicated in ipoStatus.ts and [slug]/page.tsx)
- `ipoSort.ts` — how IPOs are ordered
- `ipo.server.ts` — how individual IPOs are looked up by slug

The same allotment badge priority logic appears in three places: `lib/allotmentStatus.ts`, `lib/ipoStatus.ts`, and inline in `app/ipo/[slug]/page.tsx`.

---

### "What are the largest and most complex files?"

1. `components/AdminForm.tsx` (2468 lines, 88 KB) — the 94-field IPO edit/create form
2. `app/ipo/[slug]/page.tsx` (1529 lines, 65 KB) — the IPO detail page (all layout inline)
3. `components/AdminDashboard.tsx` (664 lines) — the admin panel
4. `components/GmpTableClient.tsx` (371 lines) — the GMP table with virtual scroll

---

### "What routes exist?"

**Public:** `/`, `/ipo`, `/ipo/[slug]`, `/gmp`, `/ipo-calendar`, `/brokers`, plus 9 static content pages  
**Admin:** `/admin`, `/auth`, `/auth/callback`  
**API:** `/api/ipos`, `/api/fetch-ipo`, `/api/fetch-gmp`, `/api/gmp-histpry/[id]`  
**SEO:** `/sitemap.xml`, `/robots.txt`

---

### "How does search work?"

There are two completely independent search mechanisms on the same `/ipo` page:
1. Server-side search: submitting the form sends `?q=term` → new server render with Supabase RPC filtering
2. Client-side inline filter: a `<script>` tag intercepts the `input` event and shows/hides card DOM elements immediately

On the GMP page, search is entirely client-side: a debounced state value that feeds into `useMemo` to filter the in-memory IPO array.

---

### "What external services does the application contact?"

1. **Supabase** (database + auth) — all data
2. **Google Analytics** (`googletagmanager.com`) — loaded lazily in browser
3. **Google Fonts** (`fonts.googleapis.com`) — downloaded at build time by `next/font/google`
4. **Clearbit** (`logo.clearbit.com`) — logo URL only constructed, not fetched server-side, exposed in `/api/fetch-ipo` response for browser to use

---

*Every statement in this document is directly supported by repository source files. Where repository evidence is insufficient, "Cannot be verified from the current repository" is explicitly stated.*
