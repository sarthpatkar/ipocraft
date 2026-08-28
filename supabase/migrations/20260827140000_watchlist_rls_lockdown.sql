-- Fixes an IDOR on public.watchlists: the original policy
-- (USING (true) WITH CHECK (true)) let anyone with the public anon key
-- read or overwrite *any* device's watchlist directly via PostgREST
-- (e.g. GET .../rest/v1/watchlists dumps every user's saved IPO list),
-- since device_id was never validated as anything more than a client-
-- supplied string.
--
-- Fix: drop the permissive anon policy so RLS default-denies the anon
-- role entirely. All access now goes exclusively through
-- app/api/watchlist/route.ts using the service-role key (bypasses RLS,
-- server-side only, never exposed to the browser). The device_id itself
-- was also upgraded from Date.now()+Math.random() to crypto.randomUUID()
-- (lib/hooks/useWatchlist.ts) so it can no longer be brute-forced even
-- through the API route.

drop policy if exists "Allow all access by device_id" on public.watchlists;

-- No replacement policy for anon/authenticated — RLS stays enabled with
-- zero policies, so PostgREST direct access is fully denied. service_role
-- (used by the API route) bypasses RLS by design and needs no policy.
