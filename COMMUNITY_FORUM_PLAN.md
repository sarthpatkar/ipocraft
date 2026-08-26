# IPO Craft — Community Forum Plan (Deferred)

> **Status: PARKED** — Feature deferred until Phase 2 of IPO Craft growth. Do not implement until the platform has consistent traffic and the legal/moderation infrastructure is ready.

---

## Why It's Parked

The community forum is IPO Craft's highest-disruption potential feature — no competitor has a quality, moderated IPO discussion space. However, it carries the highest legal complexity:

- Requires functioning as an IT Act 2021 "intermediary" with a Grievance Officer before launch
- Needs a moderation system running 24/7
- Significant development effort (2–3 weeks minimum)

Launch this **after** the SEO and tool features are live and generating traffic.

---

## Legal Compliance Requirements (IT Act 2021 + SEBI)

Before launch, these must be completed:

| Requirement | Action |
|-------------|--------|
| **Appoint Grievance Officer** | Name, email, phone publicly listed on site. Can be you. |
| **Publish T&C** | State what content is allowed/banned. Reference IT Act Section 79. |
| **24h complaint acknowledgement** | Build a "Report Post" flow that creates a ticket |
| **15-day takedown SLA** | Admin dashboard must surface flagged content for review |
| **180-day data retention** | User activity logs retained in Supabase for 180 days minimum |
| **Mandatory post disclaimer** | Every post shows: "Not financial advice. IPO investing carries risk." |

---

## Architecture

Self-hosted on existing Next.js/Supabase stack. No external forum platform.

### New Routes

#### `/app/community/page.tsx` — Forum home
- IPO-specific threads auto-created when admin publishes a new IPO
- General threads: "IPO News", "Market Sentiment", "Learning Zone"
- Server-rendered for SEO

#### `/app/community/[threadId]/page.tsx` — Thread detail
- Fully server-rendered — all content Google-crawlable
- Schema: `DiscussionForumPosting` JSON-LD

---

## Supabase Schema

```sql
-- community_posts
id, user_id, ipo_id (nullable), thread_type, title, body, 
upvotes, created_at, is_flagged, is_removed, is_pinned

-- community_votes
user_id, post_id, created_at
-- unique constraint (user_id, post_id) — upvote only

-- community_badges  
user_id, badge_type ('accuracy_badge'), awarded_at, criteria_met

-- community_reports
post_id, reporter_id, reason, created_at, resolved_at
```

---

## Forum Mechanics

### Upvote-Only (No Downvotes)
Upvote-only keeps discussions positive. Low-quality posts sink naturally.

### Accuracy Badge System
- After IPO lists, system checks if user's pre-listing analysis matched outcome
- Users with 7/10 accurate calls earn **📊 Accurate Analyst** badge
- Auto-computed, recalculated quarterly

### Auto-Moderation Stack
1. **Keyword filter**: blocks "guaranteed returns", "sure shot", "pump and dump"
2. **AI moderation**: OpenAI Moderation API flags financial advice phrases
3. **Community reporting**: 3 flags → auto-hidden pending review
4. **Admin queue**: flagged posts in Admin Dashboard

---

## Crowdsourced GMP

### `/app/api/gmp-report/route.ts`
- Anonymous GMP submission (no login), rate-limited 1/IP/IPO/hour
- IQR outlier filtering before showing median
- Disclaimer: "Community-reported data. Unverified. Not official."

---

## When to Revisit
- IPO Craft reaches 10,000+ monthly active users
- Grievance Officer and T&C are documented and published
- Moderation queue is operational in Admin Dashboard
