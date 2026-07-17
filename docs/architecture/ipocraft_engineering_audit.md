# IPOCraft — Independent Engineering Audit Report

> **Audit Date:** 2026-07-17  
> **Repository:** `/Users/sarth/ipocraft`  
> **Corpus:** `sarthpatkar/ipocraft`  
> **Standard:** All statements are directly supported by repository evidence. Where evidence is insufficient, this is explicitly stated.

---

## Table of Contents

1. [Executive Repository Overview](#1-executive-repository-overview)
2. [Repository Structure Analysis](#2-repository-structure-analysis)
3. [Application Architecture](#3-application-architecture)
4. [Feature Inventory](#4-feature-inventory)
5. [UI / UX Audit](#5-ui--ux-audit)
6. [Component Audit](#6-component-audit)
7. [Database Audit](#7-database-audit)
8. [API Audit](#8-api-audit)
9. [Performance Audit](#9-performance-audit)
10. [Security Audit](#10-security-audit)
11. [Deployment Audit](#11-deployment-audit)
12. [Reusability Assessment](#12-reusability-assessment)
13. [Scalability Observations](#13-scalability-observations)
14. [Code Quality Assessment](#14-code-quality-assessment)
15. [Final Assessment](#15-final-assessment)

---

## 1. Executive Repository Overview

**Confidence: High**

IPOCraft is a web-based informational platform focused on Indian IPO (Initial Public Offering) data. The repository is a single monorepo containing one deployable application.

| Attribute | Value |
|-----------|-------|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19.2.3 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) |
| Database | Supabase (PostgreSQL hosted) |
| Auth | Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) |
| Charting | Recharts v3 |
| Deployment | Vercel (inferred from `vercel.json` presence and `package.json` script) |
| Domain | `https://ipocraft.com` (hardcoded in `lib/site-url.ts`) |
| Analytics | Google Analytics (`G-V2DGFHC1DY`) — hardcoded in `app/layout.tsx` |

**Evidence:** `package.json`, `next.config.ts`, `app/layout.tsx`, `lib/site-url.ts`, `.env.local`, `vercel.json`

---

## 2. Repository Structure Analysis

### Root-level Files

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | Dependency manifest and npm scripts | Active |
| `next.config.ts` | Next.js configuration with `turbopack` and `trailingSlash: false` | Active |
| `tsconfig.json` | TypeScript configuration with strict mode, path alias `@/*` | Active |
| `.gitignore` | Excludes `node_modules`, `.next`, `.env*`, `.vercel`, `.tsbuildinfo` | Active |
| `.env.local` | Holds Supabase URL, anon key, service role key, and site URL. **This file exists locally and contains secrets.** It is covered by `.gitignore` via `.env*`. | Active |
| `vercel.json` | Contains only `{}` — no custom Vercel config is set | Active (minimal) |
| `eslint.config.mjs` | ESLint config using `eslint-config-next` | Active |
| `postcss.config.mjs` | PostCSS config using `@tailwindcss/postcss` | Active |
| `proxy.ts` | Defines a `proxy()` function that reads a Supabase session from cookies and redirects unauthenticated requests to `/admin` paths. **This file is NOT referenced as a Next.js middleware** (`middleware.ts` does not exist in the repository). | Low Confidence — appears unused as middleware |
| `README.md` | Boilerplate Next.js README from `create-next-app`. Contains no IPOCraft-specific documentation. | Present but generic |

### `/app` Directory (Next.js App Router)

All routes use the App Router convention (`page.tsx` files inside named directories).

| Route | File | Type |
|-------|------|------|
| `/` | `app/page.tsx` | Server Component (async) |
| `/layout` (root) | `app/layout.tsx` | Server Component (root layout) |
| `/ipo` | `app/ipo/page.tsx` | Server Component (async) |
| `/ipo/[slug]` | `app/ipo/[slug]/page.tsx` | Server Component (async, 65 KB) |
| `/gmp` | `app/gmp/page.tsx` | Server Component (async) |
| `/ipo-calendar` | `app/ipo-calendar/page.tsx` | Server Component (async) |
| `/brokers` | `app/brokers/page.tsx` | Server Component (async) |
| `/admin` | `app/admin/page.tsx` | Thin wrapper → `AdminDashboard` (Client) |
| `/auth` | `app/auth/page.tsx` | Client Component (`"use client"`) |
| `/auth/callback` | `app/auth/callback/route.ts` | Route Handler (GET) |
| `/about` | `app/about/page.tsx` | Server Component |
| `/contact` | `app/contact/page.tsx` | Server Component |
| `/privacy` | `app/privacy/page.tsx` | Server Component |
| `/terms` | `app/terms/page.tsx` | Server Component |
| `/what-is-ipo-gmp` | `app/what-is-ipo-gmp/page.tsx` | Server Component |
| `/how-ipo-allotment-works` | `app/how-ipo-allotment-works/page.tsx` | Server Component |
| `/ipo-subscription-meaning` | `app/ipo-subscription-meaning/page.tsx` | Server Component |
| `/qib-hni-retail-explained` | `app/qib-hni-retail-explained/page.tsx` | Server Component |
| `/ipo-grey-market-guide` | `app/ipo-grey-market-guide/page.tsx` | Server Component |
| `/api/ipos` | `app/api/ipos/route.ts` | API Route Handler (GET) |
| `/api/fetch-ipo` | `app/api/fetch-ipo/route.ts` | API Route Handler (POST) |
| `/api/fetch-gmp` | `app/api/fetch-gmp/route.ts` | API Route Handler (POST) |
| `/api/gmp-histpry/[id]` | `app/api/gmp-histpry/[id]/route.ts` | API Route Handler (GET) — **note typo "histpry" in folder name** |
| `/test` | `app/test/` | Directory present; no files inspected |

**Evidence:** Directory listing of `/app` and all subdirectory listings.

### `/components` Directory

18 component files, all TypeScript/TSX, flat structure (no subdirectories).

### `/lib` Directory

9 utility/library files. All TypeScript.

### `/supabase` Directory

Contains one subdirectory `migrations/` with one SQL migration file: `20260228143000_content_depth_and_brokers.sql`.

### `/scripts` Directory

Contains one file: `check-redirects.mjs` — a Node.js CLI script for SEO redirect auditing.

### `/data` Directory

Contains one file: `data/ipos.ts` — a hardcoded array with a single placeholder IPO entry (`ABC Technologies IPO`). This file does not appear to be imported anywhere in active page code (all active data is fetched from Supabase).

**Confidence for `data/ipos.ts` usage:** Low — Cannot confirm it is actively used from the current repository.

### `/public` Directory

| File | Purpose |
|------|---------|
| `logo2.png` | Brand logo used in Navbar and footer |
| `google45a9a650ad70df2c.html` | Google Search Console domain verification file |
| `llms.txt` | LLM/AI crawler discovery file listing primary content URLs |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Default Next.js generated SVG assets (not actively used in app pages from observable code) |

---

## 3. Application Architecture

### Frontend Architecture

**Confidence: High**

The application uses the **Next.js 16 App Router** with a hybrid rendering strategy:
- The majority of pages are **async Server Components** that fetch data directly from Supabase on the server.
- Interactive components are **Client Components** explicitly marked with `"use client"`.
- There is **no React Query, SWR, Zustand, Redux, or any external state management library**. State is managed via React `useState` and `useEffect` within individual Client Components.
- The root layout (`app/layout.tsx`) is a Server Component that includes `Navbar`, Google Analytics scripts, and a footer.

**Evidence:** `package.json`, all `page.tsx` files, component files.

### Rendering Strategy

| Pattern | Where Used |
|---------|-----------|
| Server-side data fetch on every request | `app/page.tsx`, `app/gmp/page.tsx`, `app/ipo/page.tsx`, `app/ipo-calendar/page.tsx`, `app/brokers/page.tsx` |
| Static content with no data fetch | `/about`, `/contact`, `/privacy`, `/terms`, learning guide pages |
| Client-side load-more (infinite scroll pattern) | `components/IpoLoadMoreClient.tsx` fetching `/api/ipos` |
| `unstable_noStore()` | Used in `app/ipo/page.tsx` to prevent caching |
| React `cache()` | Used in `lib/ipo.server.ts` (`getIpoBySlug`) and `app/ipo/[slug]/page.tsx` (`getCachedIpoBySlug`) |
| `export const dynamic = "force-dynamic"` | Used in `app/api/ipos/route.ts` |

**Evidence:** `app/ipo/page.tsx` (line 7, 102), `app/ipo/[slug]/page.tsx` (line 9-11), `lib/ipo.server.ts` (line 51), `app/api/ipos/route.ts` (line 5).

### Backend Architecture

**Confidence: High**

There is **no dedicated backend server** outside of Next.js. All server-side logic runs within:
1. **Next.js Server Components** (direct Supabase calls on the server)
2. **Next.js Route Handlers** (`/api/*` endpoints)
3. **Supabase** as the backend-as-a-service (PostgreSQL + Auth + Storage)

There is no Express, Fastify, NestJS, Spring, Django, or any other dedicated backend framework in the repository.

**Evidence:** Directory structure, `package.json` (no backend framework dependency).

### Routing

The App Router is used. All routes follow the file-system convention. Dynamic routes:
- `/ipo/[slug]` — individual IPO detail pages
- `/api/gmp-histpry/[id]` — GMP history by IPO ID

Navigation links are statically defined in `components/Navbar.tsx` (`LINKS` array: Home, IPO, GMP, IPO Calendar, Brokers).

### Authentication Flow

**Confidence: High**

Authentication is implemented using **Supabase Auth** with email/password sign-in.

1. Unauthenticated user visits `/admin`.
2. **`proxy.ts`** defines a session-checking function. However, **`middleware.ts` does not exist** in the repository. The `proxy.ts` file's `config.matcher` suggests it was intended as middleware, but it is not wired as a Next.js middleware file. This means **admin route protection at the middleware level cannot be confirmed from the repository.**
3. `/auth/page.tsx` renders an email/password login form. On success, it calls `window.location.href = "/admin"`.
4. `/auth/callback/route.ts` handles the OAuth PKCE code exchange (`supabase.auth.exchangeCodeForSession(code)`), though the login form uses `signInWithPassword` (not OAuth). The callback route appears set up for OAuth but may be unused by the current password login flow.
5. `AdminSessionGuard` (Client Component) enforces a 30-minute inactivity timeout. It listens to `mousemove`, `keydown`, `click`, `scroll` events and calls `supabase.auth.signOut()` on timeout.
6. `AdminLogoutButton` calls `supabase.auth.signOut()` explicitly.

**Evidence:** `proxy.ts`, `app/auth/page.tsx`, `app/auth/callback/route.ts`, `components/AdminSessionGuard.tsx`, `components/AdminLogoutButton.tsx`.

### Authorization Flow

**Confidence: Medium**

- The Supabase anon key is used for all public data queries (IPO listings, GMP data, brokers).
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) is used in `lib/ipo.server.ts` for server-side slug lookup: it falls back to the anon key if the service role key is absent.
- Admin write operations (insert, update, delete on `ipos` and `brokers`) in `AdminDashboard.tsx`, `AdminForm.tsx`, and `adminActions.ts` use a **browser client initialized with the anon key** (`createBrowserClient`). Authorization for these writes is therefore dependent entirely on **Supabase Row Level Security (RLS) policies**. The migration file does not define any RLS policies. Whether RLS policies exist cannot be verified from the repository alone.

> **Cannot be verified from the current repository:** Whether Supabase RLS policies are configured on `ipos`, `brokers`, or `gmp_history` tables.

**Evidence:** `lib/ipo.server.ts` (lines 27-31), `lib/adminActions.ts` (lines 1-7), `components/AdminDashboard.tsx` (lines 10-13).

### Database Interaction

All database interaction goes through the `@supabase/supabase-js` and `@supabase/ssr` client libraries. Two client types are used:

1. **Server Client** (`createSupabaseServerClient` from `lib/supabaseServer.ts`): Created per request using Next.js `cookies()`. Used in Server Components and Route Handlers. Cookie `set` and `remove` methods are no-ops in this client (read-only cookie interaction).
2. **Browser Client** (`createBrowserClient` from `@supabase/ssr`): Used in Client Components (`AdminDashboard.tsx`, `AdminForm.tsx`, `AdminSessionGuard.tsx`, `AdminLogoutButton.tsx`, `auth/page.tsx`).
3. **Direct Supabase Client** (`createClient` from `@supabase/supabase-js`): Used in `lib/ipo.server.ts` (with service role key fallback) and `lib/supabase.ts` (anon key, singleton). Also instantiated inline in `app/api/gmp-histpry/[id]/route.ts`.

**Note:** `lib/supabase.ts` exports a module-level singleton `supabase` instance with the anon key. This singleton is imported in `app/ipo/[slug]/page.tsx` and `components/AdminForm.tsx`.

**Evidence:** `lib/supabase.ts`, `lib/supabaseServer.ts`, `lib/adminActions.ts`, `components/AdminDashboard.tsx`, `app/api/gmp-histpry/[id]/route.ts`.

### State Management

No global state management library is used. State is isolated within:
- `AdminDashboard.tsx`: `useState` for IPOs list, filtered list, brokers list, loading states, modals, search, toast
- `IpoLoadMoreClient.tsx`: `useState` for items, hasMore, nextCursor, loading, error
- `GmpTable.tsx` and `GmpTableClient.tsx`: `useState` for search, filter, sort
- `Navbar.tsx`: `useState` for scroll state, menu open, active indicator position, hover indicator, scroll progress

**Evidence:** All client component files.

### Data Fetching

- **Server-side:** Direct Supabase queries using `createSupabaseServerClient()` in async Server Components.
- **Client-side (load more):** `IpoLoadMoreClient.tsx` calls `/api/ipos` via `fetch()` with cursor-based pagination parameters.
- **Admin data:** `AdminDashboard.tsx` and `adminActions.ts` call Supabase directly from the browser client.
- **IPO Feed pagination:** Uses a cursor-based approach. The `getIpoFeedPage` function in `lib/ipoFeed.ts` calls a Supabase RPC function named `get_ipos_page` with parameters `p_limit`, `p_status`, `p_type`, `p_q`, `p_snapshot`, `p_cursor_open_date`, `p_cursor_created_at`, `p_cursor_slug`.

> **Cannot be verified from the current repository:** The definition of the `get_ipos_page` Supabase RPC/stored procedure. It is called but not defined in the migration files present.

**Evidence:** `lib/ipoFeed.ts` (line 154), `components/IpoLoadMoreClient.tsx`, `app/gmp/page.tsx`, `app/ipo-calendar/page.tsx`.

### Error Handling

- **Server Components:** Supabase errors are `console.error`'d. In some cases (e.g., `BrokerList.tsx`, `ipo.server.ts`), an error state renders a UI error message. In other cases (e.g., `app/ipo-calendar/page.tsx`, `app/gmp/page.tsx`), errors are logged but the page renders with empty data.
- **Route Handlers:** Return `NextResponse.json({ error: ... }, { status: 500 })` on errors.
- **Client Components:** `IpoLoadMoreClient.tsx` shows an inline error message. Admin operations use `alert()` for some errors and toast messages for others.
- **`notFound()`:** Used in `app/ipo/[slug]/page.tsx` when slug sanitization fails or IPO record is not found.

**Evidence:** `lib/ipo.server.ts`, `components/BrokerList.tsx`, `components/IpoLoadMoreClient.tsx`, `app/ipo/[slug]/page.tsx`, `app/api/ipos/route.ts`.

### Environment Configuration

| Variable | Usage | Exposure |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public (client-visible) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key | Public (client-visible) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for local dev | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; used in `lib/ipo.server.ts` | Server-only (no `NEXT_PUBLIC_` prefix) |

The `.env.local` file contains actual key values (JWT tokens). This file is covered by `.gitignore` (`/.env*`) and should not be committed.

**Evidence:** `.env.local`, `lib/ipo.server.ts`, `lib/supabase.ts`, `lib/supabaseServer.ts`.

---

## 4. Feature Inventory

### 4.1 IPO Listing Feed

**Status: Implemented**

- Lists IPOs from the `ipos` Supabase table with cursor-based pagination.
- Supports filtering by `status` (open/upcoming/closed/listed), `ipo_type` (mainboard/sme), and text search (`q`).
- Homepage shows 6 items; `/ipo` page uses `IpoLoadMoreClient` for progressive loading.
- Each card (`IpoCard.tsx`) displays: name, exchange, sector, ipo_type, status, offer dates, price band, subscription, lot size, GMP, allotment badge, listing return badge.
- Links route to `/ipo/[slug]`.

**Files:** `app/page.tsx`, `app/ipo/page.tsx`, `lib/ipoFeed.ts`, `components/IpoList.tsx`, `components/IpoCard.tsx`, `components/IpoLoadMoreClient.tsx`, `app/api/ipos/route.ts`

### 4.2 IPO Detail Page

**Status: Implemented (very large page — 65 KB, 1529 lines)**

- Individual IPO pages at `/ipo/[slug]`.
- Fetches full IPO record by slug from `ipos` table.
- Displays extensive detail: price band, dates, GMP, subscription breakdown (QIB/NII/RII/BHNI/SHNI), lot tables, about company, objectives, strengths, risks, promoter holding, reservation percentages, face value, issue size, lead managers, registrar, DRHP/RHP links, listing data, valuation metrics (EPS, PE, ROCE, D/E, PAT margin, market cap), company/registrar contacts.
- Includes a GMP trend chart (`GmpChart.tsx`) fetched from `/api/gmp-histpry/[id]`.
- Generates per-IPO metadata (title, description, OpenGraph, Twitter cards, canonical URLs).
- `generateStaticParams` is NOT observed in the slug page — pages appear to render dynamically.
- Uses `cache()` for request deduplication between `generateMetadata` and the page render.

**Files:** `app/ipo/[slug]/page.tsx`, `components/GmpChart.tsx`, `app/api/gmp-histpry/[id]/route.ts`

### 4.3 GMP Tracker

**Status: Implemented**

- `/gmp` page fetches all IPOs with GMP data.
- Also fetches `gmp_history` for each IPO to show trend (latest vs. previous GMP).
- Passes data to `GmpTableClient` (Client Component with virtualization).
- Filters: All / Open / Upcoming / Closed / Active Only / Mainboard / SME.
- Sorts: Highest GMP / Most Subscribed / Closing Soon.
- Real-time column-level sort with ascending/descending toggle.
- Virtual scrolling (window of 18 rows, `ROW_HEIGHT=48`).
- Rows link to `/ipo/[slug]`.

**Files:** `app/gmp/page.tsx`, `components/GmpTableClient.tsx`, `components/GmpTable.tsx` (also exists, separate implementation)

### 4.4 IPO Calendar

**Status: Implemented**

- `/ipo-calendar` fetches all IPOs and categorizes them into Upcoming, Open, and Closed sections.
- Does not use `listing_date` for status calculation — only `open_date` and `close_date`.
- Renders cards with name, dates, price, lot size, GMP, and link to detail page.

**Files:** `app/ipo-calendar/page.tsx`

### 4.5 Broker Comparison

**Status: Implemented**

- `/brokers` page renders all active brokers (`is_active = true`) ordered by `sort_order`.
- Each `BrokerCard.tsx` shows: name, account opening, account maintenance, equity delivery, equity intraday, futures, options charges, notes, and a CTA link.
- Homepage shows first 4 brokers via `BrokerList limit={4}`.
- Affiliate disclosure is present in the brokers page footer.

**Files:** `app/brokers/page.tsx`, `components/BrokerList.tsx`, `components/BrokerCard.tsx`

### 4.6 Admin Panel

**Status: Implemented**

- Accessible at `/admin`.
- Three tabs: IPOs, Brokers, Settings.
- **IPOs tab:** Table of all IPOs with search and status filter. Per-row actions: Edit, View, Duplicate, Delete. Inline GMP update field with "Save" button that also inserts into `gmp_history`.
- **Brokers tab:** Table of all brokers with active/inactive count. Actions: Edit, Delete.
- **Settings tab:** Placeholder only — shows text: *"Future settings like automation, cron jobs, SEO, disclaimers."*
- Edit opens `AdminForm.tsx` (88 KB, 2468 lines) in a modal.
- `AdminForm.tsx` has 94 fields organized into 8 sections (Essentials, Company Narrative, Ownership & Reservation, Issue Details, Lot Details, Listing/Allotment/Documents, Valuation, Contacts). Includes auto-slug generation from name.
- All admin writes use the browser Supabase client with anon key.

**Files:** `app/admin/page.tsx`, `components/AdminDashboard.tsx`, `components/AdminForm.tsx`, `components/AdminBrokerForm.tsx`, `components/BrokerForm.tsx`, `components/DeleteConfirmModal.tsx`, `components/AdminStats.tsx`, `components/AdminLogoutButton.tsx`, `components/AdminSessionGuard.tsx`

### 4.7 Authentication (Admin Login)

**Status: Implemented**

- `/auth` page: minimal email/password form using `supabase.auth.signInWithPassword()`.
- On success, redirects to `/admin` via `window.location.href`.
- `/auth/callback` route handles Supabase OAuth code exchange (may be unused by current password-only flow).
- 30-minute inactivity session timeout enforced client-side by `AdminSessionGuard`.

**Files:** `app/auth/page.tsx`, `app/auth/callback/route.ts`, `components/AdminSessionGuard.tsx`, `components/AdminLogoutButton.tsx`

### 4.8 Educational Content / SEO Pages

**Status: Implemented (static content)**

Five dedicated educational pages:
- `/what-is-ipo-gmp` — Explanation of Grey Market Premium
- `/how-ipo-allotment-works` — IPO allotment process
- `/ipo-subscription-meaning` — Subscription demand explanation
- `/qib-hni-retail-explained` — Investor category breakdown
- `/ipo-grey-market-guide` — Grey market guide

**Files:** Respective `page.tsx` files in each directory. No dynamic data fetching observed in page names; content is static HTML.

### 4.9 Sitemap

**Status: Implemented**

- `/sitemap.xml` is dynamically generated by `app/sitemap.ts`.
- Includes 14 static pages + all IPO slug pages from the database.
- IPO slugs are sanitized via `getSanitizedIpoSlugs()` which deduplicates and validates slugs.

**Files:** `app/sitemap.ts`, `lib/ipo.server.ts`

### 4.10 Robots.txt

**Status: Implemented**

- `/robots.txt` disallows `/admin`, `/api`, `/auth`.
- Allows all other paths.
- Points to `sitemap.xml` at the canonical origin.

**Files:** `app/robots.ts`

### 4.11 GMP History Chart

**Status: Implemented**

- Individual IPO detail pages display a GMP trend chart using Recharts `LineChart`.
- Data is fetched from `gmp_history` table via `/api/gmp-histpry/[id]` (GET).
- Chart shows trend color: green if latest GMP ≥ previous, red if declining.
- Only the latest dot is rendered explicitly; other data points have no dot.

**Files:** `components/GmpChart.tsx`, `app/api/gmp-histpry/[id]/route.ts`

### 4.12 SEO Tooling

**Status: Implemented**

- `scripts/check-redirects.mjs`: CLI tool to check HTTP redirects and canonical URL correctness for a list of URLs.
- Invoked by `npm run seo:check-redirects`.
- `public/llms.txt`: LLM crawler discovery file.
- `public/google45a9a650ad70df2c.html`: Google Search Console ownership verification.

**Files:** `scripts/check-redirects.mjs`, `public/llms.txt`, `public/google45a9a650ad70df2c.html`

### 4.13 Allotment Status Logic

**Status: Implemented**

Two overlapping implementations of allotment status logic exist:
- `lib/allotmentStatus.ts` (`getAllotmentBadge`): Priority-based logic — admin override → listed → allotment date reached → null.
- `lib/ipoStatus.ts` (`getIPOStatus`): Combined IPO status + allotment status logic.
- `components/IpoCard.tsx` contains its own inline `getAllotmentBadge` function (third implementation).

All three implement the same priority logic but are separate code paths.

**Evidence:** `lib/allotmentStatus.ts`, `lib/ipoStatus.ts`, `components/IpoCard.tsx` (lines 67-109).

---

## 5. UI / UX Audit

### 5.1 Global Layout (`app/layout.tsx`)

- **Layout:** Sticky navbar + full-width main content (`max-w-7xl mx-auto`) + footer.
- **Typography:** Inter (Google Fonts, weights 400/500), loaded via `next/font/google` with `font-display: swap`.
- **Color scheme:** Forced light mode (`color-scheme: light` in both HTML and CSS). No dark mode.
- **Footer:** Brand logo, two-column link nav (Quick Links, Learning Guides), social icons (Instagram, Telegram, LinkedIn, X, YouTube), legal disclaimer, copyright.
- **Analytics:** Google Analytics loaded with `strategy="lazyOnload"`.
- **Schema.org:** Organization schema injected via `next/script`.

### 5.2 Homepage (`/`)

- **Hero:** Gradient background with animated blur blobs (`animate-pulse`). H1, subtitle, learning link, trust badges, two CTA buttons.
- **IPO section:** Search form (debounced auto-submit via inline `<script>`), filter pill links (Mainboard, SME, Open, Upcoming, Closed, All), IPO grid (1/2/3 columns responsive), "Show More" link to `/ipo`.
- **SEO sections:** Two cards (What is GMP, Data Transparency), research insights paragraph, legal disclaimer, FAQ section.
- **Broker section:** H2, description, "View All Brokers" link, `BrokerList limit={4}`.
- **Information hierarchy:** H1 → trust badges → CTAs → H2 (IPOs) → filters → grid → H2 (Brokers).
- **Accessibility observations:** Trust badge `<span>` elements have no accessible roles. Inline `<script>` for debounced search is not accessible to screen readers.

### 5.3 IPO Listings Page (`/ipo`)

- **Hero:** Animated gradient background, H1, subtitle, CTA buttons.
- **Trust badges:** Three static info pills.
- **Sticky filter bar:** Search input with icon, type filters (Mainboard/SME/All), status filters (Open/Upcoming/Listed/Closed). Sticky at `top-[88px]`.
- **Hidden spacer:** `<div className="hidden md:block h-28 lg:h-32" />` used to prevent sticky overlap.
- **IPO grid:** Rendered by `IpoLoadMoreClient` with "Show More IPOs" button.
- **Inline client-side search:** A `<script>` tag filters cards by hiding/showing elements directly — this operates independently of server-side filtering.
- **Loading state:** "Loading..." text on the load-more button; no skeleton loading.

### 5.4 IPO Detail Page (`/ipo/[slug]`)

- **Very large file:** 1529 lines, 65 KB. All layout and styling is inline in this single file.
- Displays: status badges, allotment badge, GMP, price band, dates, subscription breakdown, lot tables, about/objectives/strengths/risks, promoter holding, reservations, issue details, contacts, listing data, GMP chart.
- **Navigation:** Breadcrumb-style "← Back to IPOs" link at top.
- **No separate layout:** The full page layout is defined within the single page file.

### 5.5 GMP Tracker (`/gmp`)

- **Hero:** Dark gradient (navy to near-black), H1, subtitle, two CTA buttons.
- **Layout:** 3-column + 1-column sidebar (on large screens). Sidebar contains an "Ad Space" placeholder (`div` with dashed border, text "Ad Space").
- **Sticky filter bar:** Status and sort filter links.
- **Table:** Virtualized (18 visible rows at a time), sticky first column (IPO name), sortable GMP and Subscription columns.
- **Sidebar:** "Apply IPO" banner linking to `/brokers`, FAQ section, Ad Space placeholder.

### 5.6 IPO Calendar (`/ipo-calendar`)

- **Layout:** Hero, then three `Section` components (Upcoming, Open, Closed) each rendered as a card grid.
- **Status calculation:** Based only on `open_date` and `close_date`. Does not consider `listing_date`.
- **Cards:** Name, date range, price, lot, GMP, status badge. Links to `/ipo/[slug]`.

### 5.7 Brokers Page (`/brokers`)

- **Layout:** Hero, broker grid, info sections, legal/affiliate disclosure.
- **Grid:** 1-column on mobile, 2-column on large screens.
- **Affiliate disclosure:** Present and explicitly states commission may be earned on referral links.

### 5.8 Admin Panel (`/admin`)

- **Authentication enforcement:** Client-side only via `AdminSessionGuard` (30-min inactivity). Server-side route protection cannot be confirmed (see Security section).
- **Layout:** Plain white card layout, no responsive styling emphasis. Tab navigation (IPOs, Brokers, Settings).
- **IPO table:** 10 columns, horizontal scroll implied. Inline GMP update input per row.
- **Form modal:** Full-screen modal, scrollable, 8 sections, all 94 fields.
- **Consistency:** Admin UI has different visual language (plain borders, gray tones) compared to the public-facing design (gradient heroes, shadow cards).

### 5.9 Auth Page (`/auth`)

- **Layout:** Centered card on full-screen white background.
- **Fields:** Email input, password input, Login button.
- **Error handling:** `alert()` dialog for errors.
- **No "forgot password" link** is observable.

### 5.10 Educational Pages

Cannot be fully audited — content of each page file was not individually read. They exist as server components within the `/app` directory.

> **Cannot be verified from the current repository:** Full content and layout of `/about`, `/contact`, `/privacy`, `/terms`, `/what-is-ipo-gmp`, `/how-ipo-allotment-works`, `/ipo-subscription-meaning`, `/qib-hni-retail-explained`, `/ipo-grey-market-guide`. File sizes suggest they are non-trivial.

---

## 6. Component Audit

### 6.1 `Navbar.tsx`
- **Purpose:** Sticky navigation bar with animated active pill indicator, scroll progress bar, mobile hamburger menu.
- **Where used:** `app/layout.tsx` (global, all pages)
- **Dependencies:** `next/link`, `next/image`, `next/navigation` (`usePathname`), React hooks (`useEffect`, `useState`, `useRef`, `useLayoutEffect`)
- **Complexity:** High — implements sliding indicator (`transform: translate3d`), hover underline indicator, scroll progress (`width: ${scrollProgress}%`), shimmer CSS animation via inline `<style jsx>`, scroll-shadow on mobile menu.
- **Client Component:** Yes (`"use client"`)
- **Reusability:** Application-specific. Not extractable without modification.

### 6.2 `IpoCard.tsx`
- **Purpose:** Card display for one IPO in a list.
- **Where used:** `components/IpoList.tsx`
- **Exports:** `IPOListItem` type (primary type for IPO data), `IpoCard` default
- **Dependencies:** No external libraries. Pure React.
- **Client Component:** Yes (`"use client"`) — needed for status badge animation
- **Complexity:** Medium — contains three independent helper functions (status, allotment badge, listed return badge) that duplicate logic from `lib/ipoStatus.ts` and `lib/allotmentStatus.ts`.
- **Observable concern:** `IPOListItem` type is declared and exported from this component file rather than a dedicated types file.

### 6.3 `IpoList.tsx`
- **Purpose:** Renders a responsive grid of `IpoCard` components wrapped in `Link` elements.
- **Where used:** `app/page.tsx` (homepage), `components/IpoLoadMoreClient.tsx`
- **Dependencies:** `next/link`, `IpoCard`
- **Server Component:** Yes (no `"use client"`)
- **Complexity:** Low

### 6.4 `IpoLoadMoreClient.tsx`
- **Purpose:** Client-side "load more" wrapper around `IpoList`. Fetches additional IPO pages from `/api/ipos` using cursor-based pagination.
- **Where used:** `app/ipo/page.tsx`
- **Dependencies:** `IpoList`, `IpoCard` (type), `lib/ipoFeed` (type)
- **Client Component:** Yes
- **Complexity:** Medium — deduplication of items by ID, cursor management, error state.

### 6.5 `GmpTableClient.tsx`
- **Purpose:** Client-side interactive GMP table with virtual scrolling, search, sort, filter, and GMP trend arrows.
- **Where used:** `app/gmp/page.tsx`
- **Dependencies:** `next/link`, `lib/ipoSort`, React `useMemo`, `useState`, `useEffect`, `useRef`
- **Client Component:** Yes
- **Complexity:** High — implements DOM-level virtualization (spacer rows), `React.memo` for row memoization, multi-criteria filtering, sort toggle.
- **Observable concern:** Virtual scroll uses `ROW_HEIGHT = 48` and `VISIBLE_COUNT = 18` hardcoded constants.

### 6.6 `GmpTable.tsx`
- **Purpose:** Alternative GMP table with search, type filter, and sort. Less sophisticated than `GmpTableClient.tsx` (no virtualization, no links).
- **Where used:** Cannot confirm active usage from observable page files. `GmpTableClient.tsx` is the one imported by `app/gmp/page.tsx`.
- **Client Component:** Yes
- **Complexity:** Medium
- **Observable concern:** Appears potentially superseded by `GmpTableClient.tsx`.

### 6.7 `GmpChart.tsx`
- **Purpose:** Line chart of GMP over time for a single IPO.
- **Where used:** `app/ipo/[slug]/page.tsx`
- **Dependencies:** `recharts` (`LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`)
- **Client Component:** Yes
- **Complexity:** Medium — trend-color detection, custom tooltip, SVG dot render for latest point only.

### 6.8 `GmpSearch.tsx`
- **Purpose:** A search input that directly manipulates `tbody tr` elements via DOM queries to show/hide rows.
- **Where used:** Cannot confirm active usage from observable page files.
- **Client Component:** Yes
- **Complexity:** Low — DOM manipulation approach.
- **Observable concern:** Direct DOM manipulation (`row.style.display = "none"`) is unconventional in React applications.

### 6.9 `BrokerList.tsx`
- **Purpose:** Server Component that fetches active brokers and renders `BrokerCard` grid.
- **Where used:** `app/page.tsx` (limit 4), `app/brokers/page.tsx` (no limit)
- **Dependencies:** `BrokerCard`, `lib/supabaseServer`
- **Server Component:** Yes (async)
- **Reusability:** Moderate — accepts `limit` prop.

### 6.10 `BrokerCard.tsx`
- **Purpose:** Card display for one broker.
- **Exports:** `BrokerListItem` type, `BrokerCard` default
- **Dependencies:** None
- **Server Component:** Yes (no `"use client"`)
- **Complexity:** Low

### 6.11 `AdminDashboard.tsx`
- **Purpose:** Main admin panel UI. Manages IPOs and brokers via tabbed interface.
- **Where used:** `app/admin/page.tsx`
- **Dependencies:** `BrokerForm`, `DeleteConfirmModal`, `AdminForm`, `lib/ipoSort`, `@supabase/ssr`
- **Client Component:** Yes (664 lines)
- **Complexity:** High — multiple state slices, inline data fetch functions, GMP update logic with history insert, duplicate IPO function.
- **Observable concern:** Supabase client instantiated at module level (line 10-13) rather than inside a `useMemo` or component lifecycle.

### 6.12 `AdminForm.tsx`
- **Purpose:** Full IPO create/edit form with 94 fields across 8 collapsible sections.
- **Where used:** `AdminDashboard.tsx` (in modal)
- **Dependencies:** `lib/supabase` (singleton), React hooks
- **Client Component:** Yes (2468 lines, 88 KB)
- **Complexity:** Very High — field-level validation, auto-slug generation, keyboard navigation between fields, section accordion, fetch-on-autofill from `/api/fetch-ipo` endpoint.
- **Observable concern:** This is the largest file in the repository at 88 KB.

### 6.13 `AdminSessionGuard.tsx`
- **Purpose:** Enforces 30-minute inactivity logout for admin pages.
- **Where used:** Cannot confirm from observable admin page files that this is mounted. `app/admin/page.tsx` only imports `AdminDashboard`.
- **Client Component:** Yes
- **Observable concern:** If not mounted in `AdminDashboard` or `app/admin/page.tsx`, the 30-minute timeout is not active. Checking `AdminDashboard.tsx` — `AdminSessionGuard` is **not imported or rendered** in `AdminDashboard.tsx`. `app/admin/page.tsx` only renders `<AdminDashboard />`.

> **Observable gap:** `AdminSessionGuard` is defined but not observed to be mounted in any page that was read. Its session timeout may not be active.

**Evidence:** `components/AdminSessionGuard.tsx` exists; `app/admin/page.tsx` renders only `<AdminDashboard />`; `components/AdminDashboard.tsx` does not import or render `AdminSessionGuard`.

### 6.14 `AdminLogoutButton.tsx`
- **Purpose:** Button that calls `supabase.auth.signOut()` and redirects to `/auth`.
- **Where used:** Cannot confirm from observable files.
- **Observable concern:** Same mounting question as `AdminSessionGuard`.

### 6.15 `DeleteConfirmModal.tsx`
- **Purpose:** Simple confirmation modal for destructive actions.
- **Where used:** `AdminDashboard.tsx`
- **Complexity:** Low

### 6.16 `AdminStats.tsx`
- **Purpose:** Stats display component (974 bytes).
- **Where used:** Cannot confirm active usage from observable files.
- **Observable concern:** May be unused.

### 6.17 `BrokerForm.tsx` and `AdminBrokerForm.tsx`
- Two separate broker form components exist. Both are in `/components`.
- `BrokerForm.tsx`: Used in `AdminDashboard.tsx` as the broker edit/add form (inside a modal).
- `AdminBrokerForm.tsx`: Cannot confirm active usage from observable files.
- **Observable concern:** Two broker form files may indicate duplication or one superseding the other.

---

## 7. Database Audit

### Tables Confirmed from Repository Evidence

**Confidence: Medium** — The migration file adds columns to existing tables and creates the `brokers` table. The base `ipos` table structure and `gmp_history` table are referenced in code but their DDL is not in the migration file.

#### Table: `ipos`
Referenced throughout the codebase. Columns observed from code and migration:

| Column | Type (inferred) | Source |
|--------|----------------|--------|
| `id` | integer/bigint | `lib/ipoFeed.ts`, `components/AdminDashboard.tsx` |
| `slug` | text | `lib/ipo.server.ts` |
| `name` | text | `lib/ipoFeed.ts` |
| `exchange` | text | `lib/ipoFeed.ts` |
| `sector` | text | `lib/ipoFeed.ts` |
| `status` | text | `lib/ipoFeed.ts` |
| `ipo_type` | text | `lib/ipoFeed.ts` |
| `price_min` | numeric | migration |
| `price_max` | numeric | migration |
| `gmp` | numeric | `lib/ipoFeed.ts` |
| `lot_size` | numeric | `lib/ipoFeed.ts` |
| `open_date` | date | migration |
| `close_date` | date | migration |
| `listing_date` | text/date | `lib/ipoFeed.ts` |
| `allotment_date` | date | migration |
| `refund_date` | date | migration |
| `allotment_link` | text | migration |
| `allotment_out` | boolean | `components/IpoCard.tsx` |
| `allotment_status` | text | `lib/ipoFeed.ts` |
| `sub_total` | numeric | migration |
| `sub_qib` | numeric | migration |
| `sub_nii` | numeric | migration |
| `sub_rii` | numeric | migration |
| `sub_bhni` | text (AdminForm field) | `components/AdminForm.tsx` |
| `sub_shni` | text (AdminForm field) | `components/AdminForm.tsx` |
| `subscription_updated_at` | timestamp (AdminForm field) | `components/AdminForm.tsx` |
| `about_company` | text | migration |
| `company_strengths` | text | migration |
| `company_risks` | text | migration |
| `objectives` | text | migration |
| `promoter_holding_pre` | numeric | migration |
| `promoter_holding_post` | numeric | migration |
| `reservation_qib` | numeric | migration |
| `reservation_nii` | numeric | migration |
| `reservation_rii` | numeric | migration |
| `reservation_employee` | numeric | migration |
| `lead_managers` | text | migration |
| `registrar` | text | migration |
| `drhp_link` | text | migration |
| `rhp_link` | text | migration |
| `listing_exchange` | text | migration |
| `listing_price` | numeric | migration |
| `listing_gain_percent` | numeric | migration |
| `created_at` | timestamptz | migration |
| `face_value`, `issue_size`, `fresh_issue`, etc. | text/numeric | `AdminForm.tsx` FIELD_ORDER |
| `eps_pre`, `eps_post`, `pe_pre`, `pe_post`, `roce`, `debt_equity`, `pat_margin`, `market_cap` | numeric | `AdminForm.tsx` FIELD_ORDER |
| `company_address`, `company_phone`, `company_email`, `company_website` | text | `AdminForm.tsx` |
| `registrar_phone`, `registrar_email`, `registrar_website` | text | `AdminForm.tsx` |

> **Cannot be verified from the current repository:** The complete DDL (CREATE TABLE) for `ipos`. The migration file uses `ALTER TABLE IF EXISTS`, implying the table was created earlier (possibly via the Supabase dashboard or a prior migration not in this repository).

#### Table: `brokers`
Fully defined in the migration file.

| Column | Type | Constraints |
|--------|------|------------|
| `id` | uuid | PRIMARY KEY, default `gen_random_uuid()` |
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

**Index:** `idx_brokers_active_order` on `(is_active, sort_order, name)`

**Trigger:** `trg_brokers_set_updated_at` — sets `updated_at = now()` before each update.

**Evidence:** `supabase/migrations/20260228143000_content_depth_and_brokers.sql`

#### Table: `gmp_history`
Referenced in code but **no DDL exists in the repository migration files**.

Columns inferred from usage:
- `ipo_id` — references `ipos.id` (FK relationship inferred, not confirmed from DDL)
- `gmp` — numeric GMP value
- `created_at` — timestamp

**Evidence:** `components/AdminDashboard.tsx` (lines 225-228), `app/api/gmp-histpry/[id]/route.ts`, `app/gmp/page.tsx`.

> **Cannot be verified from the current repository:** Full DDL for `gmp_history` table, including data types, constraints, and indexes.

### Database Functions / Stored Procedures

- `get_ipos_page`: Called via `supabase.rpc()` in `lib/ipoFeed.ts`. Parameters: `p_limit`, `p_status`, `p_type`, `p_q`, `p_snapshot`, `p_cursor_open_date`, `p_cursor_created_at`, `p_cursor_slug`. **Definition not present in repository.**
- `set_updated_at()`: Defined in migration as a trigger function for `brokers`.

> **Cannot be verified from the current repository:** Definition of `get_ipos_page` Supabase RPC function.

### Extensions

- `pgcrypto` — enabled in migration (used for `gen_random_uuid()`).

**Evidence:** `supabase/migrations/20260228143000_content_depth_and_brokers.sql` (line 1).

### Row Level Security

> **Cannot be verified from the current repository:** Whether any RLS policies are defined on any table. No `CREATE POLICY` or `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` statements appear in the migration file.

---

## 8. API Audit

### 8.1 `GET /api/ipos`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Paginated IPO feed for client-side load-more |
| **Consumer** | `IpoLoadMoreClient.tsx` |
| **Auth** | None (public endpoint) |
| **Cache** | `export const dynamic = "force-dynamic"` — no caching |
| **Inputs** | `limit`, `status`, `type`, `q`, `snapshot`, `cursorOpenDate`, `cursorCreatedAt`, `cursorSlug` (all query params) |
| **Outputs** | `{ items, hasMore, nextCursor, snapshot }` |
| **Database** | Calls Supabase RPC `get_ipos_page` |
| **Error** | Returns `{ error: "Unable to load IPO feed page" }` with HTTP 500 |

**Evidence:** `app/api/ipos/route.ts`

### 8.2 `POST /api/fetch-ipo`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Returns a placeholder logo URL and description for a company name |
| **Consumer** | `AdminForm.tsx` (autofill feature) |
| **Auth** | None |
| **Inputs** | `{ companyName }` (JSON body) |
| **Outputs** | `{ logo, industry, description, website, gmp }` |
| **Implementation** | Generates a Clearbit logo URL by sanitizing the company name to a domain guess. Returns hardcoded placeholder text. `industry` is always `"To be updated"`. `gmp` is always `null`. |
| **External dependency** | `https://logo.clearbit.com/{domain}` — called indirectly (URL only, not fetched in the handler) |

**Evidence:** `app/api/fetch-ipo/route.ts`

### 8.3 `POST /api/fetch-gmp`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Returns a GMP value for a company name |
| **Consumer** | Cannot confirm from observable files |
| **Auth** | None |
| **Inputs** | `{ companyName }` (JSON body) |
| **Outputs** | `{ gmp, source }` |
| **Implementation** | Returns `Math.floor(Math.random() * 200)` as GMP. `source` is `"estimated"`. Code comment: *"temporary demo"*. |
| **Note** | This is a stub/demo endpoint. GMP values are random on every call. |

**Evidence:** `app/api/fetch-gmp/route.ts`

### 8.4 `GET /api/gmp-histpry/[id]`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Returns GMP history records for a given IPO ID |
| **Consumer** | `components/GmpChart.tsx` (mounted in `/ipo/[slug]` page) |
| **Auth** | None (public endpoint, uses anon key) |
| **Inputs** | `id` (URL path parameter — IPO ID) |
| **Outputs** | Array of `{ ipo_id, gmp, created_at, ... }` records |
| **Database** | Queries `gmp_history` table filtered by `ipo_id`, ordered `created_at` ascending |
| **Error** | Returns `{ error: message }` with HTTP 500 |
| **Note** | Folder is named `gmp-histpry` — typo ("history" misspelled) |

**Evidence:** `app/api/gmp-histpry/[id]/route.ts`

### 8.5 `GET /auth/callback`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Handles Supabase OAuth PKCE code exchange |
| **Auth** | Supabase code grant |
| **Inputs** | `code` (query param) |
| **Outputs** | Redirect to `/admin` |
| **Note** | Used for OAuth flows. Current login form uses password auth. This route may be unused in normal operation. |

**Evidence:** `app/auth/callback/route.ts`

---

## 9. Performance Audit

### Rendering

- **Server Components** are used for data-heavy pages (`/`, `/ipo`, `/gmp`, `/ipo-calendar`, `/brokers`, `/ipo/[slug]`). This moves database round-trips off the client.
- **`unstable_noStore()`** is called in `/ipo/page.tsx`, preventing Next.js from caching the page. This means every request to `/ipo` triggers a fresh Supabase query.
- **React `cache()`** is used in `lib/ipo.server.ts` and `app/ipo/[slug]/page.tsx` for request deduplication within a single render cycle.

### Data Fetching Patterns

- **`/gmp` page** fetches all IPOs with no limit, then fetches all GMP history for those IPO IDs in a second query. For a large number of IPOs, this is an unbounded query. **Medium concern, directly observable.**
- **`/ipo-calendar` page** also fetches all IPOs with `select("*")` (no field selection, no limit). **Medium concern, directly observable.**
- **`/api/gmp-histpry/[id]`** uses a direct `createClient()` call per request (new Supabase client instantiation on every API call).
- **`AdminDashboard.tsx`** fetches all IPOs with `select("*")` and all GMP history data on mount.

### Bundle Composition

- **Recharts** is a runtime dependency (`dependencies`, not `devDependencies`). It will be included in the client bundle where `GmpChart` is imported. `GmpChart` is a Client Component.
- **Google Fonts** are loaded via `next/font/google` with `display: "swap"`. Two fonts are loaded: `Inter` and `Playfair_Display`. They are loaded in multiple page files independently (e.g., both in `app/page.tsx` and `app/gmp/page.tsx`).
- **Google Analytics** is loaded with `strategy="lazyOnload"` — deferred until page is idle. **Good practice.**
- **Tailwind CSS v4** — utility-first CSS, expected to produce optimized output.

### Images

- Logo loaded via `next/image` in Navbar and footer — `width={120}` and `width={140}` respectively. `priority` is set on the footer logo image but not the navbar logo. This appears backward (navbar loads first).
- No other images are used beyond the logo.

### Virtual Scrolling

- `GmpTableClient.tsx` implements manual virtual scrolling using scroll events and spacer rows. `ROW_HEIGHT = 48`, `VISIBLE_COUNT = 18`.

### Caching

- No HTTP response caching headers are explicitly set in Route Handlers.
- No `fetch` cache configurations (`next: { revalidate: ... }`) are observed in Server Components (except `unstable_noStore` for opt-out).

### Hydration

- Client Components include `GmpTableClient`, `IpoLoadMoreClient`, `IpoCard`, `Navbar`, admin components, auth page.
- `IpoCard` is a Client Component primarily for animations (`animate-pulse` on status badges). The component does not use any browser APIs directly.

---

## 10. Security Audit

### Environment Variables and Secrets

- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Public key. Observable from browser. This is expected behavior for Supabase's security model.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Server-only. Not prefixed with `NEXT_PUBLIC_`. Used only in `lib/ipo.server.ts` which is marked `import "server-only"`. **Correctly scoped.**
- **`.env.local`**: Present with actual credentials. `.gitignore` covers `.env*`. However, the file exists locally with a live service role key and live anon key.

**Observable:** The `.env.local` file's service role JWT is a long-lived token (expires ~2087 per the JWT payload `"exp":2087769625`).

### Admin Route Protection

- `proxy.ts` defines admin route protection logic but **is not wired as Next.js middleware** (no `middleware.ts` file exists).
- `AdminSessionGuard` is defined but **not observed to be mounted** in `app/admin/page.tsx` or `components/AdminDashboard.tsx`.
- The only server-side admin protection observable is the requirement to be authenticated with Supabase Auth for writes — but this depends on RLS policies which cannot be verified.

> **Observable gap:** Server-side admin route protection cannot be confirmed from the repository. Admin write operations use the anon key browser client; their protection depends entirely on unverifiable Supabase RLS policies.

### Input Validation

- **Slug sanitization:** `sanitizeIpoSlug()` in `lib/ipo.server.ts` validates slug format (no `/`, `?`, `#`, trims whitespace).
- **Admin form:** `AdminForm.tsx` manages form state as plain strings. No observable input sanitization or validation library.
- **API inputs:** Query parameters are parsed with `searchParams.get()`. Limit is parsed via `Number()` with `NaN` check.
- **`/api/fetch-gmp`** and **`/api/fetch-ipo`**: Accept arbitrary `companyName` string from the request body. No length restriction or sanitization observable.

### Cross-Site Scripting (XSS)

- **`dangerouslySetInnerHTML`** is used in `app/page.tsx` and `app/ipo/page.tsx` for JSON-LD schema injection. The content is constructed from template literals, not from user input. Low XSS risk for these specific uses.
- **`GmpSearch.tsx`** uses `element.innerHTML = highlighted` after constructing a highlighted string using `regex.replace`. The input `query` comes from the search input value. If malicious HTML is injected into the search query, this could produce XSS. **Observable XSS risk if `GmpSearch` is actively mounted.**
- **`app/page.tsx`** (home search) uses a `<script>` inline that calls `form.submit()` — no innerHTML manipulation.

### Storage

- No Supabase Storage configuration is visible in the repository.

### HTTP Security Headers

- No `next.config.ts` security headers configuration is present. The Next.js config contains only `trailingSlash: false` and `turbopack`.

> **Cannot be verified from the current repository:** Whether Vercel deployment adds security headers (X-Frame-Options, CSP, HSTS, etc.).

### Robots and Crawlers

- `/admin`, `/api`, and `/auth` are disallowed in `robots.ts`. **Correctly implemented.**

---

## 11. Deployment Audit

### Hosting

**Confidence: Medium**

- `vercel.json` is present (content: `{}`). This suggests Vercel deployment is configured.
- Domain `https://ipocraft.com` is hardcoded in `lib/site-url.ts`.
- `.gitignore` includes `.vercel`.

> **Cannot be verified from the current repository:** Actual Vercel project settings, team, or environment variable configuration in Vercel dashboard.

### Build Configuration

- `next build` is the production build command (`package.json` script).
- `next dev` for development (uses Turbopack per `next.config.ts`).
- `turbopack` is enabled for dev only (`root: __dirname` in `turbopack` config).

### Environment Configuration

- `.env.local` is for local development.
- Production environment variables must be configured separately (e.g., in Vercel dashboard). Cannot verify production env vars.

### CI/CD

> **Cannot be verified from the current repository:** No `.github/workflows/`, `.gitlab-ci.yml`, `.circleci/`, or any CI/CD configuration file is present in the repository.

### Monitoring

> **Cannot be verified from the current repository:** No error monitoring (Sentry, Datadog, etc.) configuration is present.

### Analytics

- **Google Analytics** (`G-V2DGFHC1DY`) is hardcoded in `app/layout.tsx` and loads for all users via `strategy="lazyOnload"`.

**Evidence:** `app/layout.tsx` (lines 52-63).

### SEO Infrastructure

- `app/sitemap.ts`: Dynamic sitemap generation.
- `app/robots.ts`: Robots.txt generation.
- `public/google45a9a650ad70df2c.html`: Google Search Console verification.
- `public/llms.txt`: LLM crawler declaration.
- Custom redirect audit script: `scripts/check-redirects.mjs`.
- Per-page canonical URLs, OpenGraph tags, Twitter card meta, JSON-LD structured data.

---

## 12. Reusability Assessment

### What Is Reusable

Based only on the current implementation, the following components are reusable as-is or with minor parameterization:

| Item | Reusability Level | Notes |
|------|-----------------|-------|
| `lib/ipoFeed.ts` (`getIpoFeedPage`) | **High** | Well-typed function with clear inputs/outputs. Depends on Supabase client. |
| `lib/ipoSort.ts` | **High** | Pure functions. No dependencies. |
| `lib/ipoStatus.ts` | **High** | Pure function. No dependencies. |
| `lib/allotmentStatus.ts` | **High** | Pure function. No dependencies. |
| `lib/site-url.ts` | **Medium** | Hardcodes `https://ipocraft.com`. Would need parameterization. |
| `lib/ipo.server.ts` | **Medium** | `server-only` import restricts to server environments. Depends on Supabase. |
| `components/IpoCard.tsx` | **Medium** | IPO-domain specific, self-contained. |
| `components/GmpChart.tsx` | **Medium** | Recharts-based chart. Could accept any `{ gmp, created_at }[]` data. |
| `components/BrokerCard.tsx` | **Low** | Broker-domain specific. |
| `scripts/check-redirects.mjs` | **High** | Generic redirect audit utility. No domain-specific code. |
| Supabase client factories | **Medium** | Abstracted into `lib/supabase.ts` and `lib/supabaseServer.ts`. |

### What Is Not Reusable Without Significant Refactoring

- `components/AdminForm.tsx` (2468 lines, 88 KB) — IPO-specific, monolithic.
- `components/AdminDashboard.tsx` — Tightly coupled to IPO and broker data structures.
- `components/Navbar.tsx` — Application-specific navigation links and brand.
- `app/ipo/[slug]/page.tsx` — 1529 lines, all inline, tightly coupled to IPO data structure.

### Business Logic

The following business logic is observable:
- **IPO status calculation** (Upcoming/Open/Closed/Listed) — `lib/ipoStatus.ts`, `components/IpoCard.tsx`
- **Allotment status calculation** (Out/Awaited/null with admin override) — `lib/allotmentStatus.ts`, `lib/ipoStatus.ts`, `components/IpoCard.tsx`
- **IPO sort by newest open date** — `lib/ipoSort.ts`
- **Cursor-based IPO pagination** — `lib/ipoFeed.ts`
- **Slug sanitization** — `lib/ipo.server.ts`

These are all located in the `/lib` directory as pure or near-pure functions and are the most extractable business logic units in the codebase.

---

## 13. Scalability Observations

### Frontend

- **Unbounded queries:** `/gmp` and `/ipo-calendar` fetch all IPOs without pagination or limits. As the number of IPO records grows, these queries will return more data, increasing response size and client-side memory usage.
- **Client-side virtual scrolling:** `GmpTableClient` uses manual virtual scrolling that is computed from all rows in memory. The data array is still fully loaded even if only 18 rows are rendered.
- **Server Component data fetching:** Most pages perform Supabase queries server-side, which is appropriate.

### Database

- **`brokers` table:** Has a composite index on `(is_active, sort_order, name)` — appropriate for the `ORDER BY sort_order, name WHERE is_active = true` query pattern.
- **`ipos` table:** No indexes visible in the migration file. The `get_ipos_page` RPC function handles pagination, but its implementation and indexes cannot be verified.
- **`gmp_history` table:** No DDL visible. Foreign key and indexes are unverifiable.

### APIs

- **`/api/ipos`:** `force-dynamic` with no caching means every call hits Supabase. Under high traffic, this creates N Supabase connections for N concurrent users loading more IPOs.
- **`/api/gmp-histpry/[id]`:** Creates a new `createClient()` per request instead of reusing a singleton.

### Storage

> Cannot be verified. No Supabase Storage configuration is in the repository.

### Hosting

> Cannot be verified. Vercel's scaling behavior depends on the plan and configuration in the Vercel dashboard.

---

## 14. Code Quality Assessment

### Folder Organization

- **Flat component structure:** All 18 components reside in a single `/components` directory with no subdirectories. Given 18 files, this is manageable but mixing admin, public, and UI utility components in one flat directory.
- **`/lib` directory:** Clear separation of utilities, Supabase clients, and business logic.
- **`/app` directory:** Standard App Router convention followed.

### Naming Consistency

- **Typo in route directory:** `app/api/gmp-histpry` (missing letter in "history"). This is a persistent typo in the URL path and would affect any external consumer of this API.
- **Dual naming for GMP table:** `GmpTable.tsx` vs `GmpTableClient.tsx` — inconsistent naming convention.
- **`proxy.ts`:** Filename implies middleware but is not wired as middleware.

### Code Organization

- **Logic duplication:** Allotment badge logic is implemented three times (`lib/allotmentStatus.ts`, `lib/ipoStatus.ts`, `components/IpoCard.tsx`).
- **Inline scripts:** `app/page.tsx` and `app/ipo/page.tsx` use `dangerouslySetInnerHTML` with inline `<script>` tags for debounced search and client-side filtering. This is a non-React pattern within a React application.
- **Large files:** `AdminForm.tsx` (88 KB, 2468 lines) and `app/ipo/[slug]/page.tsx` (65 KB, 1529 lines) are notably large. All IPO detail layout and logic exists in a single file.
- **`data/ipos.ts`:** A single-entry hardcoded placeholder file. Not actively referenced in production code paths.
- **`proxy.ts`:** Present at root but not wired as `middleware.ts`.

### TypeScript Usage

- **`strict: true`** is enabled in `tsconfig.json`.
- **`any` type usage:** `lib/ipoStatus.ts` and `lib/allotmentStatus.ts` use `ipo: any` as parameter type.
- **`unknown` type:** `AdminDashboard.tsx` uses `IpoRecord` and `BrokerRecord` with index signatures `[key: string]: string | number | boolean | null | undefined`.
- **`RawIpoRow`** type in `lib/ipoFeed.ts` uses `unknown` for all fields — explicit normalization before use.

### Maintainability

- **`AdminForm.tsx`** at 2468 lines handles all 94 fields, all 8 sections, auto-save, keyboard nav, and validation in a single file. This concentration reduces readability.
- **`app/ipo/[slug]/page.tsx`** at 1529 lines contains all IPO detail layout, helper functions, and structured data in a single file.
- Google Analytics measurement ID (`G-V2DGFHC1DY`) is hardcoded in `app/layout.tsx` rather than loaded from an environment variable.
- The canonical domain (`https://ipocraft.com`) is hardcoded in `lib/site-url.ts`.

---

## 15. Final Assessment

### Current Strengths

| Strength | Evidence |
|----------|---------|
| Next.js App Router with Server Components used correctly for data-fetching | `app/*/page.tsx` files |
| Supabase SSR integration properly uses server vs. browser client variants | `lib/supabaseServer.ts`, `lib/supabase.ts` |
| Cursor-based pagination with snapshot-consistent reads | `lib/ipoFeed.ts` |
| Comprehensive SEO implementation (canonical URLs, OpenGraph, Twitter cards, JSON-LD, robots, sitemap) | Multiple page files, `app/sitemap.ts`, `app/robots.ts` |
| Business logic utilities (`ipoSort`, `ipoStatus`, `allotmentStatus`) are isolated in `/lib` | `/lib` directory |
| Service role key correctly scoped to server-only module | `lib/ipo.server.ts` (uses `import "server-only"`) |
| GMP history virtualized table with memoized rows | `components/GmpTableClient.tsx` |
| Google Analytics loaded with `lazyOnload` strategy | `app/layout.tsx` |
| Slug sanitization prevents path traversal issues | `lib/ipo.server.ts` |
| TypeScript strict mode enabled | `tsconfig.json` |
| Legal disclaimers and affiliate disclosures present in UI | `app/brokers/page.tsx`, `app/layout.tsx` |

### Current Limitations

| Limitation | Evidence |
|-----------|---------|
| `proxy.ts` is not wired as Next.js middleware — admin route server-side protection is unconfirmed | `proxy.ts` exists; `middleware.ts` does not |
| `AdminSessionGuard` is not mounted in observable admin pages | `app/admin/page.tsx`, `components/AdminDashboard.tsx` |
| Admin writes use anon key browser client — authorization depends on unverifiable Supabase RLS policies | `components/AdminDashboard.tsx` lines 10-13 |
| `api/fetch-gmp` returns random GMP values (stub/demo) | `app/api/fetch-gmp/route.ts` line 20 |
| Typo in API route: `gmp-histpry` | Directory name |
| Unbounded Supabase queries in `/gmp` and `/ipo-calendar` pages | `app/gmp/page.tsx`, `app/ipo-calendar/page.tsx` |
| Logic duplication: allotment badge implemented in 3 places | `lib/allotmentStatus.ts`, `lib/ipoStatus.ts`, `components/IpoCard.tsx` |
| `AdminForm.tsx` is 88 KB / 2468 lines in a single file | File size |
| `app/ipo/[slug]/page.tsx` is 65 KB / 1529 lines | File size |
| `data/ipos.ts` contains a single hardcoded placeholder entry, purpose unclear | `data/ipos.ts` |
| `GmpTable.tsx` and `GmpSearch.tsx` may be superseded/unused | No observable importer confirmed |
| `AdminStats.tsx` and `AdminBrokerForm.tsx` usage not confirmed | Components directory |
| `gmp_history` table DDL not in repository | No migration found |
| `get_ipos_page` RPC definition not in repository | Called in `lib/ipoFeed.ts` |
| No CI/CD configuration present | Directory inspection |
| No test files present | Directory inspection |
| Google Analytics ID and canonical domain hardcoded | `app/layout.tsx`, `lib/site-url.ts` |
| `priority` set on footer logo image, not navbar logo | `app/layout.tsx` line 104 |
| Settings tab is a placeholder | `components/AdminDashboard.tsx` lines 591-598 |

### Production Readiness

**Confidence: Medium**

Observable indicators of a deployed/production-ready application:
- Live Supabase credentials in `.env.local`
- Hardcoded production domain (`https://ipocraft.com`)
- Google Analytics measurement ID present
- Google Search Console verification file in `/public`
- `llms.txt` in `/public`
- Social media profiles linked in footer with real URLs

Observable gaps relative to production readiness:
- Admin route protection is not confirmed at the middleware level
- No automated tests in the repository
- No CI/CD configuration
- Two stub API endpoints (`/api/fetch-gmp` returns random data)
- `vercel.json` is empty (no custom headers, rewrites, or redirects)
- README is boilerplate Next.js starter documentation

### Unknown Areas That Cannot Be Verified

1. Supabase RLS (Row Level Security) policies on `ipos`, `brokers`, `gmp_history` tables
2. Definition of the `get_ipos_page` stored procedure
3. Full DDL of `ipos` and `gmp_history` tables
4. Vercel project configuration (environment variables, custom headers, edge config)
5. Whether `AdminSessionGuard`, `AdminStats`, `AdminBrokerForm`, `GmpTable`, `GmpSearch` are mounted/used in parts of the codebase not read
6. Content of educational guide pages (about, contact, privacy, terms, learning articles) beyond their file existence
7. Whether production deployment has any security headers
8. Prior database migrations (the one migration present uses `ALTER TABLE IF EXISTS`, implying earlier migrations exist outside this repository)

---

*This report reflects the repository state as of 2026-07-17. All observations are directly traceable to specific files and line numbers in `/Users/sarth/ipocraft`.*
