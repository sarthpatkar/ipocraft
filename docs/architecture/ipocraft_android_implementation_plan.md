# IPOCraft — Android Implementation Plan

> **Classification:** Internal Engineering Design Document  
> **Audience:** Engineering team implementing Android for IPOCraft  
> **Prerequisite reading:** Engineering Audit, Architecture Atlas, Android Readiness Audit  
> **Standard:** Every recommendation traces to repository evidence. Where evidence is insufficient, this is stated explicitly.

---

## 1. Executive Summary

**Current state:** IPOCraft is a single Next.js 16 application deployed on Vercel. All business logic, data access, and rendering live inside this one repository. The database is PostgreSQL on Supabase. Admin operations happen entirely in the browser via the Supabase anon key. There is no standalone API layer — public pages render data via Server Components, and only one API endpoint (`GET /api/ipos`) returns structured JSON.

**Goal:** Introduce a native Android application that gives users access to IPO listings, detail views, GMP tracking, broker comparison, and the IPO calendar — reusing the existing database and extending the existing API surface.

**Strategy:** The Android application will consume HTTP JSON APIs served by the existing Next.js deployment. The current web repository will be extended with a small set of new Route Handler files (4 new endpoints) that expose data currently locked inside Server Components. The Android repository will be a separate Kotlin project. No database changes, no admin system duplication, and no backend rewrite are required.

**Expected outcome:** An Android app that shares the same Supabase database, reads from the same API layer, and renders equivalent features — without modifying any existing web page behaviour.

---

## 2. Current vs Target Architecture

### Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Next.js Application (Vercel)                   │
│                                                                 │
│  ┌─────────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │  Public Pages    │  │  Admin Panel   │  │  API Routes      │ │
│  │  (Server Comp.)  │  │  (Client Comp.)│  │  (4 endpoints)   │ │
│  └────────┬────────┘  └───────┬────────┘  └────────┬─────────┘ │
│           │                   │                     │           │
│           │    Direct Supabase queries              │           │
│           └───────────────────┼─────────────────────┘           │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Supabase (PgSQL)    │
                    │  ipos · brokers       │
                    │  gmp_history          │
                    │  subscription_history │
                    └───────────────────────┘
```

**Problem for Android:** Public pages fetch data inside Server Components (e.g., `app/ipo/[slug]/page.tsx` line 12: `supabase.from("ipos").select("*").eq("slug", slug)`). This data is rendered to HTML. There is no HTTP endpoint an Android client can call for IPO detail, brokers, calendar, or the GMP table.

### Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Next.js Application (Vercel)                   │
│                                                                 │
│  ┌─────────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │  Public Pages    │  │  Admin Panel   │  │  API Routes      │ │
│  │  (unchanged)     │  │  (unchanged)   │  │  (8 endpoints)   │ │
│  └─────────────────┘  └────────────────┘  └────────┬─────────┘ │
│                                                     │           │
└─────────────────────────────────────────────────────┼───────────┘
                                                      │
                         ┌────────────────────────────┤
                         │                            │
                         ▼                            ▼
              ┌──────────────────┐         ┌──────────────────┐
              │   Web Browser    │         │  Android App     │
              │  (existing)      │         │  (new repo)      │
              └──────────────────┘         └──────────────────┘
                         │                            │
                         └────────────┬───────────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │   Supabase (PgSQL)    │
                          │   (unchanged)         │
                          └───────────────────────┘
```

### What Changes

| Item | Change |
|------|--------|
| `app/api/` directory | 4 new Route Handler files added |
| Web pages | **Nothing changes** |
| Admin panel | **Nothing changes** |
| Database schema | **Nothing changes** |
| Business logic in `lib/` | Allotment badge logic consolidated (optional; reduces duplication risk) |
| New repository | `ipocraft-android/` — standalone Kotlin project |

### What Android Consumes

| Feature | Endpoint |
|---------|----------|
| IPO feed (paginated, filterable) | `GET /api/ipos` (exists) |
| IPO detail | `GET /api/ipos/[slug]` (**new**) |
| GMP history per IPO | `GET /api/gmp-history/[id]` (**new**, replaces typo'd `gmp-histpry`) |
| Broker list | `GET /api/brokers` (**new**) |
| IPO calendar | `GET /api/calendar` (**new**) |

### What Remains Web-Only

| Item | Reason |
|------|--------|
| Admin panel (`AdminDashboard`, `AdminForm`) | 94-field form with keyboard navigation — web-specific UX |
| `POST /api/fetch-ipo` | Admin autofill tool (returns Clearbit logo URL) |
| `POST /api/fetch-gmp` | Admin GMP stub (returns random number) |
| SEO metadata, JSON-LD, sitemap, robots | Web crawler features |
| Google Analytics | Browser-specific telemetry |

---

## 3. Repository Strategy

### Two Repositories

```
ipocraft/              ← existing repo (unchanged owner)
  app/
  components/
  lib/
  supabase/
  ...

ipocraft-android/      ← new repo
  app/
  data/
  domain/
  ...
```

### Responsibility Boundaries

| Concern | `ipocraft/` | `ipocraft-android/` |
|---------|-------------|---------------------|
| Database schema & migrations | ✅ Owns | ❌ Never touches |
| API surface (Route Handlers) | ✅ Owns | ❌ Consumes only |
| Admin UI | ✅ Owns | ❌ Not implemented |
| Web UI | ✅ Owns | ❌ N/A |
| Android UI | ❌ N/A | ✅ Owns |
| Android networking/caching | ❌ N/A | ✅ Owns |
| Business logic (status, allotment) | ✅ Reference implementation | ✅ Kotlin re-implementation |
| Supabase Auth integration | ✅ Web flow (cookies) | ✅ Mobile flow (JWT tokens) |

### Deployment Independence

- **Web:** Deployed to Vercel via `git push` to `ipocraft/`. Continues as before.
- **Android:** Deployed to Google Play via CI/CD from `ipocraft-android/`. Fully independent release cycle.
- **Coupling point:** The API contract. Changes to API response shapes must be coordinated. This is the only coupling between the two repositories.

### Versioning

No API versioning header is needed for the initial release. The APIs are new and have no existing external consumers. If breaking changes are ever required, the simplest approach is to add a new endpoint path (e.g., `/api/v2/ipos`) rather than versioning via headers. This avoids complexity for a small team.

---

## 4. Codepath Migration Plan

For each major feature, this section shows how the data currently reaches users and how it will reach Android.

---

### 4.1 IPO List

**Current (web):**
```
app/page.tsx or app/ipo/page.tsx
  → createSupabaseServerClient()
  → getIpoFeedPage({ supabase, limit, status, type, q })
  → supabase.rpc("get_ipos_page", {...})
  → IpoLoadMoreClient receives { items, hasMore, nextCursor, snapshot }

On "Show More":
  → IpoLoadMoreClient calls GET /api/ipos?limit=6&snapshot=...&cursor...
  → same getIpoFeedPage() on server
  → JSON response
```

**Target (Android):**
```
Android HomeScreen / IpoListScreen
  → Retrofit call: GET /api/ipos?limit=20&status=open&type=mainboard
  → receives { items, hasMore, nextCursor, snapshot }
  → Paging3 library uses nextCursor for infinite scroll
  → On scroll to bottom: GET /api/ipos?limit=20&snapshot=SAME&cursorOpenDate=...
```

**Web changes:** None. `GET /api/ipos` already exists and is Android-consumable.

**Android implementation:** Standard Paging3 `RemoteMediator` or `PagingSource` using the cursor fields.

---

### 4.2 IPO Detail

**Current (web):**
```
app/ipo/[slug]/page.tsx (Server Component)
  → supabase.from("ipos").select("*").eq("slug", slug).maybeSingle()
  → supabase.from("gmp_history").select("gmp, created_at").eq("ipo_id", id)
  → supabase.from("subscription_history").select("*").eq("ipo_id", id)
  → All rendering done server-side → HTML sent to browser
```

**Target (Android):**
```
Android IpoDetailScreen
  → Retrofit call: GET /api/ipos/example-company-ipo
  → receives JSON: {
      ipo: { ...all 60+ fields },
      gmpHistory: [{ gmp, created_at }],
      subscriptionHistory: [{ day, ... }],
      computed: { status, allotmentBadge, gmpTrend, ... }
    }
```

**Web changes:** New endpoint `app/api/ipos/[slug]/route.ts` created. This file mirrors the three Supabase queries from the Server Component and adds pre-computed fields.

---

### 4.3 GMP Tracking

**Current (web):**
```
app/gmp/page.tsx (Server Component)
  → supabase.from("ipos").select(10 columns) [unbounded]
  → supabase.from("gmp_history").select(...).in("ipo_id", allIds) [unbounded]
  → gmpMap built server-side
  → GmpTableClient receives all data as props → in-memory filter/sort/virtual scroll
```

**Target (Android):**

The GMP page's unbounded `select("*")` pattern is unsuitable for a mobile endpoint. Instead of replicating this pattern, Android should use two endpoints:

1. `GET /api/ipos?limit=50&sort=gmp` — paginated IPO feed sorted by GMP (the existing endpoint with an added `sort` parameter)
2. `GET /api/gmp-history/[id]` — GMP history for a specific IPO (viewed when user taps into detail)

This avoids transferring the entire `gmp_history` table to the Android device.

**Web changes:** Either (a) add `sort` parameter support to `GET /api/ipos` route handler (this means passing a sort param to `get_ipos_page` RPC), or (b) the GMP page continues using its current unbounded server-side pattern, and Android just uses the existing feed endpoint with its own in-app sort.

**Recommended approach:** (b) — don't modify the existing `GET /api/ipos` or the `get_ipos_page` RPC. Android can request all items via `GET /api/ipos?limit=100` and sort in-memory. This avoids touching the RPC whose definition is not in the repository.

---

### 4.4 Broker Comparison

**Current (web):**
```
components/BrokerList.tsx (async Server Component)
  → createSupabaseServerClient()
  → supabase.from("brokers").select(14 columns).eq("is_active", true).order("sort_order")
  → normalizeBrokerRows()
  → renders BrokerCard (no JS, pure HTML)
```

**Target (Android):**
```
Android BrokerScreen
  → Retrofit call: GET /api/brokers
  → receives JSON: [{ id, name, slug, logo_url, account_opening, ... }]
  → renders broker list natively
```

**Web changes:** New endpoint `app/api/brokers/route.ts` created. The query is copied from `BrokerList.tsx` lines 50-57.

---

### 4.5 IPO Calendar

**Current (web):**
```
app/ipo-calendar/page.tsx (Server Component)
  → supabase.from("ipos").select("*") [unbounded]
  → groups by getStatus() → Upcoming / Open / Closed
  → renders 3 sections
```

**Target (Android):**
```
Android CalendarScreen
  → Retrofit call: GET /api/calendar
  → receives JSON: {
      upcoming: [{ slug, name, open_date, close_date, ... }],
      open: [...],
      closed: [...]
    }
  → renders grouped list
```

**Web changes:** New endpoint `app/api/calendar/route.ts`. Uses the same query and grouping logic from `app/ipo-calendar/page.tsx`.

---

### 4.6 Authentication

**Current (web):**
```
app/auth/page.tsx → supabase.auth.signInWithPassword() → browser cookies → window.location.href = "/admin"
```

**Target (Android):**

For the initial Android release, authentication is **not needed**. The Android app is a read-only public client consuming the same public data as the website. No admin functionality is planned for the Android app.

If user-specific features (watchlists, notifications) are added later, Supabase Auth will be integrated via the [Supabase Kotlin SDK](https://supabase.com/docs/reference/kotlin/introduction). This uses JWT tokens stored in Android's EncryptedSharedPreferences rather than browser cookies.

**Web changes:** None.

---

### 4.7 Admin

**Target:** Not implemented on Android. The admin panel remains a web-only feature. No codepath migration is needed.

**Justification:** `AdminForm.tsx` is 2468 lines of form logic with keyboard navigation, field traversal, and auto-calculation. Replicating this as an Android form provides no user benefit — admin tasks are performed at a desk, not on a phone.

---

### 4.8 Search

**Current (web):** Two mechanisms exist — server-side search via `GET /api/ipos?q=term` (passes `p_q` to `get_ipos_page` RPC) and a client-side DOM manipulation script.

**Target (Android):**
```
Android search bar → GET /api/ipos?q=searchterm&limit=20
  → same RPC-based server-side search
  → results rendered in IpoListScreen
```

**Web changes:** None. The existing `GET /api/ipos?q=` parameter works as-is.

---

### 4.9 Notifications

**Current:** No notification infrastructure exists anywhere in the repository.

**Target (Phase 4, future):** This requires:
1. Firebase Cloud Messaging (FCM) integration in the Android app
2. A device token storage mechanism (new `device_tokens` table in Supabase)
3. A trigger mechanism (Supabase Database Webhook or Edge Function) that fires when an IPO's status changes

This is out of scope for the initial Android release but is documented here for planning.

---

## 5. API Evolution Plan

### Existing Endpoints

| # | Endpoint | Status | Action |
|---|----------|--------|--------|
| 1 | `GET /api/ipos` | **Reusable unchanged** | No modification. Android calls it directly for paginated feed + search. |
| 2 | `GET /api/gmp-histpry/[id]` | **Replace** | Create `GET /api/gmp-history/[id]` (fixed spelling). Deprecate old path after web migration. |
| 3 | `POST /api/fetch-ipo` | **Remains internal** | Admin-only autofill tool. Not exposed to Android. |
| 4 | `POST /api/fetch-gmp` | **Remains internal** | Stub returning random numbers. Not exposed to Android. |

### New Endpoints

#### 5.1 `GET /api/ipos/[slug]` — IPO Detail

**Why needed:** `app/ipo/[slug]/page.tsx` fetches IPO data server-side via three separate Supabase queries (lines 11-18, 142-146, 148-152). There is no HTTP endpoint for this data. Android needs a single request that returns the full IPO record plus related history.

**Implementation:**

```typescript
// app/api/ipos/[slug]/route.ts
import { NextResponse } from "next/server";
import { sanitizeIpoSlug, getIpoBySlug } from "@/lib/ipo.server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = sanitizeIpoSlug(rawSlug);

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const ipo = await getIpoBySlug(slug);

  if (!ipo) {
    return NextResponse.json({ error: "IPO not found" }, { status: 404 });
  }

  // Fetch related history
  const [gmpResult, subResult] = await Promise.all([
    supabase.from("gmp_history")
      .select("gmp, created_at")
      .eq("ipo_id", ipo.id)
      .order("created_at", { ascending: true }),
    supabase.from("subscription_history")
      .select("*")
      .eq("ipo_id", ipo.id)
      .order("day", { ascending: true }),
  ]);

  return NextResponse.json({
    ipo,
    gmpHistory: gmpResult.data ?? [],
    subscriptionHistory: subResult.data ?? [],
  });
}
```

**Reuses:** `sanitizeIpoSlug` and `getIpoBySlug` from `lib/ipo.server.ts` (already exist and are tested by the web detail page).

**Response shape:**
```json
{
  "ipo": { "id": 42, "slug": "example-ipo", "name": "Example", ... },
  "gmpHistory": [{ "gmp": 120, "created_at": "2026-03-15T10:00:00Z" }, ...],
  "subscriptionHistory": [{ "day": 1, ... }, ...]
}
```

---

#### 5.2 `GET /api/gmp-history/[id]` — GMP History (Corrected Path)

**Why needed:** The existing `gmp-histpry` endpoint has a typo. Rather than renaming the folder (which is a breaking change for any current consumer — though none were confirmed), create a new correctly-named endpoint. The implementation is identical.

**Implementation:** Copy `app/api/gmp-histpry/[id]/route.ts` (27 lines) into `app/api/gmp-history/[id]/route.ts`.

---

#### 5.3 `GET /api/brokers` — Broker List

**Why needed:** `BrokerList.tsx` is an async Server Component that queries Supabase directly (lines 50-57). Android has no way to call a Server Component.

**Implementation:**

```typescript
// app/api/brokers/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("brokers")
    .select("id, name, slug, logo_url, account_opening, account_maintenance, equity_delivery, equity_intraday, futures, options, cta_url, notes")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load brokers" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
```

This is a direct extraction of the query from `BrokerList.tsx` lines 50-57.

---

#### 5.4 `GET /api/calendar` — IPO Calendar

**Why needed:** `app/ipo-calendar/page.tsx` queries `supabase.from("ipos").select("*")` (line 98-100), then groups IPOs by status using `getStatus()` (lines 73-85). Android needs this grouping logic served as JSON.

**Implementation:**

```typescript
// app/api/calendar/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ipos")
    .select("id, slug, name, open_date, close_date, price_min, price_max, lot_size, gmp, ipo_type, allotment_date, listing_date");

  if (error) {
    return NextResponse.json({ error: "Failed to load calendar" }, { status: 500 });
  }

  const today = new Date();
  const upcoming: typeof data = [];
  const open: typeof data = [];
  const closed: typeof data = [];

  for (const ipo of data ?? []) {
    const openDate = ipo.open_date ? new Date(ipo.open_date) : null;
    const closeDate = ipo.close_date ? new Date(ipo.close_date) : null;

    if (!openDate || today < openDate) {
      upcoming.push(ipo);
    } else if (closeDate && today <= closeDate) {
      open.push(ipo);
    } else {
      closed.push(ipo);
    }
  }

  return NextResponse.json({ upcoming, open, closed });
}
```

This replicates `getStatus()` from `app/ipo-calendar/page.tsx` lines 73-85 as server-side JSON grouping.

---

## 6. Web Repository Changes

### New Files

| File | Purpose | Basis |
|------|---------|-------|
| `app/api/ipos/[slug]/route.ts` | IPO detail endpoint | Extracts queries from `app/ipo/[slug]/page.tsx` lines 11-152 |
| `app/api/gmp-history/[id]/route.ts` | GMP history (corrected URL) | Copy of `app/api/gmp-histpry/[id]/route.ts` |
| `app/api/brokers/route.ts` | Broker list | Extracts query from `components/BrokerList.tsx` lines 50-57 |
| `app/api/calendar/route.ts` | Calendar grouped list | Extracts query+grouping from `app/ipo-calendar/page.tsx` lines 73-100 |

### Optional Refactoring

| Change | Justification |
|--------|--------------|
| Consolidate allotment badge logic into `lib/allotmentStatus.ts` only | Same logic exists in `lib/ipoStatus.ts`, `IpoCard.tsx` (lines 67-109), and `app/ipo/[slug]/page.tsx` (lines 239-262). When Android re-implements this, having one authoritative source reduces ambiguity. |

### No Other Changes

- **No new folders** beyond the Route Handler files in `app/api/`.
- **No DTOs / serializers / mappers** — Next.js Route Handlers return `NextResponse.json()` directly. The data shapes are defined implicitly by the Supabase queries and TypeScript types already in `lib/`.
- **No shared utility packages** — The web and Android repositories are separate. Shared logic is shared via the API contract (response shapes), not via code sharing.

---

## 7. Android Architecture

### Package Structure

```
com.ipocraft.android/
├── app/                         # Application class, DI setup
├── data/
│   ├── api/                     # Retrofit service interfaces
│   │   ├── IpoCraftApi.kt       # Single Retrofit interface
│   │   └── dto/                 # Response DTOs matching API JSON
│   │       ├── IpoListResponse.kt
│   │       ├── IpoDetailResponse.kt
│   │       ├── BrokerResponse.kt
│   │       └── CalendarResponse.kt
│   ├── repository/              # Repository implementations
│   │   ├── IpoRepository.kt
│   │   ├── BrokerRepository.kt
│   │   └── GmpRepository.kt
│   └── local/                   # Room database (offline cache)
│       ├── IpoCraftDatabase.kt
│       ├── dao/
│       └── entity/
├── domain/
│   ├── model/                   # Domain models (independent of API/DB)
│   │   ├── Ipo.kt
│   │   ├── IpoDetail.kt
│   │   ├── Broker.kt
│   │   ├── GmpPoint.kt
│   │   └── IpoStatus.kt
│   └── usecase/                 # Business logic
│       ├── GetIpoFeedUseCase.kt
│       ├── GetIpoDetailUseCase.kt
│       └── ComputeIpoStatusUseCase.kt
├── ui/
│   ├── feed/                    # IPO list screen
│   ├── detail/                  # IPO detail screen
│   ├── gmp/                     # GMP tracking screen
│   ├── brokers/                 # Broker comparison screen
│   ├── calendar/                # IPO calendar screen
│   ├── search/                  # Search screen
│   └── common/                  # Shared UI components
└── util/                        # Formatters, extensions
```

### Module Structure

For initial release, a **single-module** Gradle project is appropriate. The codebase will be small (5 screens, 1 API service). Multi-module adds build complexity with no benefit at this scale. If the app grows beyond ~20 screens or needs feature-gated delivery, modules can be extracted later along the `data/` / `domain/` / `ui/` boundaries.

### Key Architectural Decisions

| Decision | Choice | Justification |
|----------|--------|--------------|
| **Networking** | Retrofit + Moshi | Standard Android HTTP client. JSON parsing is type-safe with Moshi codegen. No need for Supabase Android SDK — all data flows through Next.js Route Handlers. |
| **Caching** | Room database | Offline cache for IPO list and detail. `IpoEntity` mirrors the API response. Cache-then-network strategy: show cached data immediately, refresh from network in background. |
| **Offline strategy** | Stale-while-revalidate | Room stores last successful API responses. On app open, show cached data. Fetch fresh data. Replace cache on success. Show error only if cache is empty AND network fails. |
| **Navigation** | Jetpack Navigation (Compose) | Single Activity, Compose screens. Navigation arguments pass `slug` (String) for detail navigation. |
| **State management** | ViewModel + StateFlow | Each screen has a ViewModel. UI state is a sealed class (`Loading`, `Success(data)`, `Error(message)`). Compose collects StateFlow. |
| **DI** | Hilt | Standard for Android projects. Provides `@Singleton` scope for Retrofit, Room, and Repository instances. |
| **Error handling** | `Result<T>` wrapper | Network calls wrapped in `runCatching`. Repositories return `Result<T>`. ViewModels map to UI state. No exceptions propagate to UI layer. |
| **Logging** | Timber | Debug builds log network calls and errors. Release builds log only errors. |
| **Image loading** | Coil | Lightweight, Compose-first image loader. Used for broker logos (`logo_url`). |
| **Charting** | Vico or MPAndroidChart | GMP history line chart (equivalent to Recharts `GmpChart.tsx`). Vico is Compose-native; MPAndroidChart is more mature. |

### Dependency Direction

```
ui/ → domain/ → data/
         ↑          ↑
         │          └── api/ (Retrofit)
         │          └── local/ (Room)
         └── model/ (pure Kotlin, no Android dependencies)
```

`domain/` never imports from `ui/` or `data/`. `data/` never imports from `ui/`. This allows the domain layer to be tested with pure JUnit (no Android instrumentation).

---

## 8. Feature Implementation Order

### Phase 0: API Surface (Web Repository)

**Objective:** Create the 4 new API endpoints so Android has something to call.

**Dependencies:** None. This is the prerequisite for all Android work.

**Expected output:** 4 new files in `app/api/`, each testable via `curl`.

**Verification:**
```bash
curl https://ipocraft.com/api/ipos?limit=2
curl https://ipocraft.com/api/ipos/example-company-ipo
curl https://ipocraft.com/api/gmp-history/42
curl https://ipocraft.com/api/brokers
curl https://ipocraft.com/api/calendar
```

---

### Phase 1: Android Foundation

**Objective:** Scaffolding — Gradle project, Hilt, Retrofit, Room, Navigation, and the IPO list screen.

**Dependencies:** Phase 0 complete.

**Expected output:** An Android app that displays a paginated list of IPOs with pull-to-refresh and infinite scroll.

**Verification:** App launches → shows IPO cards → "load more" fetches next page → search filters results.

---

### Phase 2: Detail + GMP

**Objective:** IPO detail screen with full data + GMP history chart.

**Dependencies:** Phase 1 complete, `GET /api/ipos/[slug]` working.

**Expected output:** Tapping an IPO card navigates to a full detail screen showing all fields, subscription table, GMP chart, timeline, and document links.

**Verification:** Detail screen displays all sections. GMP chart renders with real data. Back navigation works.

---

### Phase 3: Broker + Calendar

**Objective:** Broker comparison screen and IPO calendar screen.

**Dependencies:** Phase 1 complete, `GET /api/brokers` and `GET /api/calendar` working.

**Expected output:** Two additional screens accessible from bottom navigation.

**Verification:** Broker screen shows active brokers with charges. Calendar shows grouped IPOs (Upcoming / Open / Closed).

---

### Phase 4: Polish + Release

**Objective:** Offline caching, error states, empty states, deep linking, Play Store listing.

**Dependencies:** Phases 1-3 complete.

**Expected output:** Production-ready APK submitted to Play Store.

**Verification:** App works with airplane mode (shows cached data). All error states render gracefully. Deep links (`ipocraft.com/ipo/slug`) open the Android app.

---

## 9. Shared Business Logic Strategy

### Logic That Should Remain Server-Side

| Logic | Where It Lives Now | Decision | Justification |
|-------|-------------------|----------|--------------|
| Cursor pagination | `lib/ipoFeed.ts` + `get_ipos_page` RPC | **Server-side only** | Android consumes the pagination result via API. Never re-implements the cursor engine. |
| Slug sanitization | `lib/ipo.server.ts` | **Server-side only** | Applied before database lookup. Android sends the slug; the server validates it. |
| `get_ipos_page` RPC | Supabase stored procedure | **Server-side only** | Definition not in repo; cannot be duplicated. |
| Calendar grouping | `app/ipo-calendar/page.tsx` | **Move to API** | `GET /api/calendar` returns pre-grouped data. Android does not re-implement grouping. |

### Logic That Should Be Behind APIs (Pre-Computed)

The detail endpoint (`GET /api/ipos/[slug]`) should return pre-computed display values alongside the raw data. This eliminates the need for Android to re-implement:

```json
{
  "ipo": { ... },
  "computed": {
    "status": "Open",
    "allotmentBadge": "Allotment Awaited",
    "priceBand": "₹120 – ₹125",
    "minInvestment": "₹14,875",
    "gmpDisplay": "₹45",
    "gmpTrendDirection": "up",
    "gmpChangePercent": 12.5
  },
  "gmpHistory": [...],
  "subscriptionHistory": [...]
}
```

This uses the existing logic from `app/ipo/[slug]/page.tsx` (lines 157-211) and `lib/ipoStatus.ts`, executed server-side, returned as JSON. The Android app renders these pre-computed values directly.

### Logic That Must Be Re-Implemented in Android

| Logic | Why | Complexity |
|-------|-----|-----------|
| IPO status for list items | `GET /api/ipos` returns raw dates, not computed status. Each `IPOListItem` has `open_date`, `close_date`, `listing_date` but no `status` field that accounts for date-based transitions. IpoCard computes this client-side. | Low (~30 lines Kotlin) |
| Allotment badge for list items | Same reason — `IPOListItem` has `allotment_out` and `allotment_date` but the badge is computed client-side by `IpoCard.tsx` lines 67-109. | Low (~25 lines Kotlin) |
| Price band formatting | `₹{min} – ₹{max}` with null handling | Trivial |
| Subscription display | `{value}x` or passthrough | Trivial |

### Logic That Should NOT Be Re-Implemented

| Logic | Reason |
|-------|--------|
| Lot auto-calculation | Admin-only. Not relevant for Android. |
| Slug generation | Admin-only. Server generates slugs. |
| Admin field validation | Admin-only. |

---

## 10. Migration Strategy

### Rollout Order

```
Step 1: Deploy API endpoints to production (web repo)
        → No existing behaviour changes
        → New endpoints are additive (new files only)
        → Verify all existing pages still work

Step 2: Android internal testing against production APIs
        → Using the live Supabase database
        → Read-only operations only

Step 3: Android closed beta (Play Store internal track)
        → Limited users
        → Monitor API error rates via Vercel logs

Step 4: Android public release
```

### Backward Compatibility

Every change to the web repository is **additive**. No existing file is modified (unless the optional allotment consolidation is done). New Route Handler files are placed in `app/api/` alongside existing ones. The existing web pages continue to use their Server Component data paths.

If the `gmp-histpry` endpoint is renamed, the old path should be kept alive (returning the same data) for at least one release cycle.

### API Stability Guarantee

Once `GET /api/ipos/[slug]` is published and the Android app is released:

- Fields can be **added** to responses without breaking Android (Moshi ignores unknown fields by default).
- Fields must **not be removed** from responses without updating the Android app first.
- Field types must **not change** (e.g., `gmp: number` must not become `gmp: string`).

This does not require a formal versioning system. It requires the discipline of additive-only changes to response shapes.

---

## 11. Risk Assessment

| # | Risk | Impact | Likelihood | Mitigation | Evidence |
|---|------|--------|-----------|------------|---------|
| 1 | **`get_ipos_page` RPC is opaque** — its definition is not in the repository. If it has bugs or needs to be modified for Android-specific sorting, the team cannot debug it from the codebase. | High | Medium | Accept for Phase 1. If sorting is needed, add a new RPC rather than modifying the existing one. Document the RPC parameters based on `lib/ipoFeed.ts` lines 154-163. | `lib/ipoFeed.ts` line 154 calls RPC; no migration file defines it. |
| 2 | **Anon key exposure** — all admin writes use `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Embedding this key in the Android APK (for any future auth feature) is equivalent to the current web exposure — it's public by design. Security depends entirely on Supabase RLS policies. | High | Low (for read-only app) | Android uses the same anon key for reads. Writes are not implemented on Android. RLS policies must be audited separately (not in this repo). | `components/AdminDashboard.tsx` lines 10-13. |
| 3 | **Status logic duplication** — Android must re-implement `getIPOStatus()` and `getAllotmentBadge()` in Kotlin because `GET /api/ipos` returns raw data, not computed status. If the priority rules change on web, Android could show different results. | Medium | Medium | Use the pre-computed `computed` object in the detail endpoint to reduce duplication to the list screen only. Document the priority rules in a shared `LOGIC.md` file readable by both teams. | `lib/ipoStatus.ts`, `lib/allotmentStatus.ts`, `IpoCard.tsx` lines 33-109. |
| 4 | **Unbounded queries** — the calendar and GMP endpoints query all IPOs with no limit. As the dataset grows, response payloads will increase. | Medium | Low (current dataset appears small) | For the initial release, this is acceptable. If the dataset exceeds ~500 IPOs, add server-side pagination to `/api/calendar` and limit `/api/ipos` calls on the GMP screen. | `app/gmp/page.tsx` lines 78-97, `app/ipo-calendar/page.tsx` line 98-100. |
| 5 | **No rate limiting on API** — new endpoints have no authentication or rate limiting. A misbehaving client could overwhelm the Supabase project. | Medium | Low | Vercel's built-in DDoS protection applies by default. For additional protection, add rate limiting via Vercel's `vercel.json` config or a simple in-memory counter in the Route Handlers. | `next.config.ts` (no custom headers), `vercel.json` (empty). |
| 6 | **`subscription_history` table schema is unknown** — the detail endpoint queries `select("*")` on this table but no DDL exists in the repo. Android DTOs must be designed based on observed data at runtime. | Low | High (will definitely need runtime verification) | Query the table once in development, document the columns, then define the DTO. | `app/ipo/[slug]/page.tsx` line 142-146. |

---

## 12. Testing Strategy

### Web Repository Testing

| Layer | Approach |
|-------|---------|
| **Existing page regression** | No existing files are modified. Risk of regression is zero for pages. |
| **New API endpoints** | Manual `curl` tests against each endpoint. Verify: (a) correct JSON shape, (b) 404 for invalid slug, (c) empty array for no data, (d) 500 on Supabase error. |
| **Integration** | Deploy to Vercel preview branch. Verify all 8 API endpoints return expected data. Verify all existing pages render correctly. |

### Android Testing

| Layer | Approach | Tool |
|-------|---------|------|
| **Unit: Domain** | Test `ComputeIpoStatusUseCase` — verify priority logic matches `lib/ipoStatus.ts` for all cases (Upcoming, Open, Closed, Listed, admin override, allotment date). | JUnit 5 |
| **Unit: ViewModel** | Test state transitions: `Loading → Success`, `Loading → Error`, refresh behaviour. | JUnit 5 + Turbine (for StateFlow testing) |
| **Unit: Repository** | Test mapping from DTO to domain model. Test offline fallback (Room returns cached data when network fails). | JUnit 5 + MockWebServer |
| **Integration: API** | MockWebServer records real API responses. Tests verify DTO parsing against actual JSON shapes. | OkHttp MockWebServer |
| **UI: Compose** | Compose UI tests for each screen. Verify: list renders items, detail shows all sections, search filters work. | Compose Testing |
| **End-to-end** | Instrumented test on emulator: launch app → scroll feed → tap IPO → see detail → back → navigate to brokers. | Espresso / Compose Testing |

### Rollout Validation

Before public release:
1. Install APK on 3 physical devices (different Android versions: 10, 13, 15)
2. Verify all 5 screens load with production data
3. Enable airplane mode → verify cached data displays
4. Disable airplane mode → verify data refreshes
5. Test deep link: `adb shell am start -a android.intent.action.VIEW -d "https://ipocraft.com/ipo/example-ipo"`

---

## 13. Development Phases

### Phase 0: API Surface Extension (Web Team, ~2 days)

**Goals:**
- Create 4 new Route Handler files
- Verify all 8 API endpoints work with `curl`

**Deliverables:**
- `app/api/ipos/[slug]/route.ts`
- `app/api/gmp-history/[id]/route.ts`
- `app/api/brokers/route.ts`
- `app/api/calendar/route.ts`

**Repository changes:** 4 new files in `ipocraft/app/api/`.

**Android changes:** None.

**Verification checklist:**
- [ ] `GET /api/ipos?limit=2` returns `{ items: [...], hasMore, nextCursor, snapshot }`
- [ ] `GET /api/ipos/known-slug` returns `{ ipo: {...}, gmpHistory: [...], subscriptionHistory: [...] }`
- [ ] `GET /api/ipos/nonexistent` returns `{ error: "IPO not found" }` with HTTP 404
- [ ] `GET /api/gmp-history/known-id` returns array of GMP points
- [ ] `GET /api/brokers` returns array of active brokers
- [ ] `GET /api/calendar` returns `{ upcoming: [...], open: [...], closed: [...] }`
- [ ] All existing web pages render correctly (no regression)

**Exit criteria:** All curl tests pass. Vercel preview deployment verified.

---

### Phase 1: Android Foundation (~2 weeks)

**Goals:**
- Android project scaffolding
- IPO list screen with pagination
- Search functionality
- Pull-to-refresh
- Offline caching for list

**Deliverables:**
- `ipocraft-android/` repository initialized
- Working IPO feed screen

**Repository changes (web):** None.

**Android changes:**
- Gradle project with Hilt, Retrofit, Room, Jetpack Compose, Navigation
- `IpoCraftApi` Retrofit interface
- `IpoListResponse` DTO
- `IpoRepository` with Room caching
- `IpoFeedScreen` Composable
- `IpoFeedViewModel`
- `ComputeIpoStatusUseCase` (re-implements status logic from `lib/ipoStatus.ts`)

**Verification checklist:**
- [ ] App launches and shows IPO list
- [ ] Scrolling to bottom loads next page
- [ ] Search field filters results via API
- [ ] Pull-to-refresh reloads data
- [ ] Airplane mode shows cached list
- [ ] Status badges (Open/Upcoming/Closed/Listed) match web

**Exit criteria:** APK installable. All list interactions work.

---

### Phase 2: Detail + GMP (~1.5 weeks)

**Goals:**
- IPO detail screen with all data sections
- GMP history line chart
- Deep link from IPO card to detail

**Deliverables:**
- `IpoDetailScreen` Composable
- `GmpChartComposable` (Vico or MPAndroidChart)
- Subscription table section
- Timeline section

**Repository changes (web):** None (endpoints already deployed in Phase 0).

**Android changes:**
- `IpoDetailResponse` DTO
- `IpoDetailScreen` + `IpoDetailViewModel`
- `GmpChart` composable
- Navigation: `IpoFeedScreen → IpoDetailScreen` via slug argument

**Verification checklist:**
- [ ] Tapping IPO card navigates to detail
- [ ] All IPO fields render (price band, dates, subscription, lot sizes, company info, contacts)
- [ ] GMP chart renders with history data
- [ ] GMP trend arrow and change percentage display
- [ ] Document links (DRHP, RHP, Allotment Status) are clickable
- [ ] Back navigation returns to list at same scroll position

**Exit criteria:** Detail screen is feature-complete relative to the web detail page.

---

### Phase 3: Brokers + Calendar (~1 week)

**Goals:**
- Broker comparison screen
- IPO calendar screen
- Bottom navigation between all screens

**Deliverables:**
- `BrokerScreen` Composable
- `CalendarScreen` Composable
- Bottom navigation bar

**Repository changes (web):** None.

**Android changes:**
- `BrokerResponse` DTO, `BrokerRepository`, `BrokerViewModel`
- `CalendarResponse` DTO, `CalendarViewModel`
- Bottom navigation: Feed | GMP | Calendar | Brokers

**Verification checklist:**
- [ ] Broker screen shows active brokers with charges
- [ ] "Open Account" button opens external browser
- [ ] Calendar groups IPOs into Upcoming / Open / Closed sections
- [ ] Bottom navigation works between all 4 tabs
- [ ] Tab state is preserved during navigation

**Exit criteria:** All 5 screens functional.

---

### Phase 4: Polish + Release (~1 week)

**Goals:**
- Error states for all screens
- Empty states for all screens
- Loading shimmer animations
- Deep linking (Android App Links)
- Play Store listing
- Performance optimization (ProGuard, baseline profiles)

**Deliverables:**
- Production-signed APK
- Play Store listing

**Repository changes (web):** Add `/.well-known/assetlinks.json` for Android App Links (or configure via Vercel headers).

**Android changes:**
- Error composable (retry button)
- Empty state composable
- Shimmer loading placeholders
- `AndroidManifest.xml` intent filters for `ipocraft.com` deep links
- ProGuard rules for Retrofit + Moshi

**Verification checklist:**
- [ ] All screens handle network errors gracefully
- [ ] All screens show empty state when no data
- [ ] Deep link `https://ipocraft.com/ipo/slug` opens detail screen
- [ ] APK size < 10 MB
- [ ] Cold start < 2 seconds on mid-range device
- [ ] Play Store pre-launch report passes

**Exit criteria:** APK submitted to Play Store. Internal track approved.

---

## 14. Migration Checklist

### Web Repository

```
□ Create app/api/ipos/[slug]/route.ts
□ Create app/api/gmp-history/[id]/route.ts
□ Create app/api/brokers/route.ts
□ Create app/api/calendar/route.ts
□ Verify GET /api/ipos still works (no regression)
□ Verify GET /api/ipos/[slug] returns full IPO + histories
□ Verify GET /api/ipos/invalid-slug returns 404
□ Verify GET /api/gmp-history/[id] returns correct data
□ Verify GET /api/brokers returns active brokers
□ Verify GET /api/calendar groups correctly
□ Verify all existing web pages render correctly
□ Deploy to Vercel production
□ Document API response shapes in README or API.md
```

### Android Repository

```
□ Initialize Gradle project with Compose, Hilt, Retrofit, Room
□ Define IpoCraftApi Retrofit interface
□ Define all DTOs (IpoListResponse, IpoDetailResponse, BrokerResponse, CalendarResponse)
□ Implement IpoRepository with Room caching
□ Implement ComputeIpoStatusUseCase (port from lib/ipoStatus.ts)
□ Implement IpoFeedScreen + ViewModel
□ Implement IpoDetailScreen + ViewModel
□ Implement GmpChart composable
□ Implement BrokerScreen + ViewModel
□ Implement CalendarScreen + ViewModel
□ Implement SearchScreen or search-in-feed
□ Implement bottom navigation
□ Implement offline fallback (Room cache)
□ Implement error states for all screens
□ Implement empty states for all screens
□ Implement deep linking for ipocraft.com/ipo/[slug]
□ Test on Android 10, 13, 15
□ Test offline mode
□ Test with production API
□ Configure ProGuard
□ Generate signed APK
□ Submit to Play Store internal track
□ Verify Play Store pre-launch report
□ Submit to Play Store production
```

---

## 15. Definition of Done

Android integration is considered **complete** when all of the following are true:

### API Surface
- [ ] All 4 new API endpoints are deployed to production and return correct data
- [ ] All 4 existing API endpoints continue to function without regression
- [ ] All existing web pages render identically to pre-change state

### Android App — Functional
- [ ] IPO list screen displays paginated feed with infinite scroll
- [ ] Search returns filtered results from the server
- [ ] IPO detail screen displays all data sections (pricing, dates, subscription, GMP chart, company info, documents, contacts)
- [ ] GMP chart renders historical data with trend indicators
- [ ] Broker comparison screen displays active brokers
- [ ] IPO calendar screen groups IPOs by Upcoming / Open / Closed
- [ ] Bottom navigation works between all screens
- [ ] Deep links from `ipocraft.com/ipo/[slug]` open the correct detail screen

### Android App — Quality
- [ ] Offline mode shows cached data for previously viewed screens
- [ ] All screens display appropriate error states when network fails
- [ ] All screens display appropriate empty states when no data is available
- [ ] Status badges (Open, Upcoming, Closed, Listed) match the web application for the same IPO
- [ ] Allotment badges (Allotment Out, Allotment Awaited) match the web application for the same IPO
- [ ] Cold start time < 2 seconds on a mid-range Android device
- [ ] APK size < 10 MB
- [ ] App works on Android 10+ (API 29+)
- [ ] Play Store pre-launch report shows no critical issues

### Organizational
- [ ] API response shapes are documented
- [ ] Status/allotment priority logic is documented in a shared file readable by both web and Android teams
- [ ] Android repository has CI (build + test on each PR)
- [ ] No admin functionality has been duplicated on Android
- [ ] No database schema changes were required
- [ ] No existing web repository files were modified (only additions)
