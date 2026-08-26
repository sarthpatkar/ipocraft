# IPOCraft 📈

> **Real-Time Indian IPO Tracking, Allotment Analytics & Market Research Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license--disclaimer)

---

## 📌 Overview

**IPOCraft** ([ipocraft.com](https://ipocraft.com)) is an interactive financial platform designed for Indian primary market tracking (Mainboard and SME IPOs). It delivers a structured, data-first experience for tracking upcoming issues, subscription demand, allotment probabilities, and market research.

Built with Next.js (App Router), TypeScript, and Tailwind CSS v4, IPOCraft is optimized for speed, responsive multi-device navigation, and data accessibility.

---

## ✨ Features

* **IPO Directory (`/ipo` & `/sme-ipo`):** Track open, upcoming, closed, and listed issues across Mainboard and SME segments.
* **GMP Tracker (`/gmp`):** Monitor live Grey Market Premium trends, estimated listing prices, and gains.
* **Subscription Tracker (`/subscriptions`):** Real-time subscription multiples broken down by QIB, NII, and Retail categories.
* **IPO Calendar (`/ipo-calendar`):** Monthly grid and agenda views for bidding dates, allotment timelines, and listing schedules.
* **Allotment Odds Calculator (`/ipo-allotment-probability-calculator`):** Estimate allocation chances across retail and NII categories.
* **AI Research Assistant (`/chat`):** Streaming conversational interface with real-time financial data context and interactive charts.
* **DRHP Analyzer (`/drhp-analyzer`):** Key highlight summaries and risk factors from draft prospectuses.
* **Multi-IPO Comparison (`/compare`):** Compare multiple IPOs side-by-side.
* **Unified Floating Navigation:** Clean floating pill navigation that adapts across all screen sizes.
* **Command Palette (`⌘K`):** Global instant search for quick navigation across the platform.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js (App Router)](https://nextjs.org/) + [React](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [Supabase (PostgreSQL)](https://supabase.com/) |
| **AI Integration** | [OpenAI API](https://openai.com/) |
| **Cache & Rate Limiting** | [Upstash Redis](https://upstash.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📂 Project Structure

```
ipocraft/
├── app/                              # Next.js App Router (Pages, Layouts & Route Handlers)
│   ├── (legal)/                      # Legal and policy pages
│   ├── api/                          # Application API endpoints
│   ├── chat/                         # AI Research Assistant interface
│   ├── compare/                      # IPO comparison view
│   ├── gmp/                          # GMP tracker view
│   ├── ipo/                          # Mainboard IPO directory & detail views
│   ├── ipo-calendar/                 # Calendar view
│   ├── sme-ipo/                      # SME IPO directory
│   ├── subscriptions/                # Subscription tracker view
│   ├── globals.css                   # Global styling and design tokens
│   └── layout.tsx                    # Root application layout
├── components/                       # UI Components
│   ├── chat/                         # Chat interface components
│   ├── IpoCalendarGrid.tsx           # Interactive calendar component
│   ├── Navbar.tsx                    # Main navigation bar
│   ├── OpenIpoTicker.tsx             # Active issues ticker marquee
│   ├── SearchCommand.tsx             # Global search dialog
│   └── ThemeProvider.tsx             # Light & Dark theme management
├── lib/                              # Utility helpers and clients
├── public/                           # Static assets, icons, and manifest
├── next.config.ts                    # Next.js configuration
├── package.json                      # Project dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `pnpm`, or `bun`

### 1. Clone & Install
```bash
git clone https://github.com/your-username/ipocraft.git
cd ipocraft
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Assistant
OPENAI_API_KEY=your-openai-api-key

# Cache & Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-upstash-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts development server at `localhost:3000` |
| `npm run build` | Builds production bundle |
| `npm run start` | Starts built production server |
| `npm run lint` | Checks code formatting and lint rules |

---

## ⚖️ License & Disclaimer

### Legal Disclaimer
**IPOCraft is an informational research and educational platform.** It is not registered with SEBI as an investment advisor or research analyst. All information is provided strictly for educational and research purposes. Investments in financial markets are subject to market risks.

### License
Proprietary. All rights reserved © 2026 IPOCraft.
