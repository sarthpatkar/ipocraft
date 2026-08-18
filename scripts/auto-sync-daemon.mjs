#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Load .env.local
const envPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

// 2. Import TS Modules dynamically
let syncFinApiIpos;
try {
  const syncModule = await import("../lib/finapi/sync.ts");
  syncFinApiIpos = syncModule.syncFinApiIpos;
} catch (e) {
  // If tsx isn't running directly, try standard import
  const syncModule = await import("../lib/finapi/sync.js").catch(() => null);
  syncFinApiIpos = syncModule?.syncFinApiIpos;
}

if (!syncFinApiIpos) {
  console.log("Please run with tsx or node: npx tsx scripts/auto-sync-daemon.mjs");
}

const SUBS_INTERVAL_MS = 30 * 60 * 1000; // 30 mins
const GMP_INTERVAL_MS = 60 * 60 * 1000;  // 1 hour
const FULL_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

function log(type, msg) {
  const time = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`[${time}] [${type.toUpperCase()}] ${msg}`);
}

async function runSync(type = "all") {
  log("SYNC", `Starting ${type} synchronization...`);
  try {
    const result = await syncFinApiIpos({
      syncType: type,
      bypassCache: true,
      status: type === "subs" ? "LIVE" : undefined,
    });

    if (result.success) {
      log(
        "SUCCESS",
        `Completed ${type} sync in ${result.durationMs}ms: ${result.totalFetched} fetched | ${result.insertedCount} added | ${result.updatedCount} updated | ${result.gmpPointsCount} GMP points. Quota remaining: ${result.rateLimitRemaining ?? "N/A"}`
      );
    } else {
      log("WARN", `Sync finished with errors: ${result.errors.join(", ")}`);
    }
  } catch (err) {
    log("ERROR", `Sync execution failed: ${err?.message || err}`);
  }
}

log("DAEMON", "=======================================================");
log("DAEMON", "   IPOCraft Automated FinAPI Background Sync Daemon   ");
log("DAEMON", "=======================================================");
log("DAEMON", `• Subscriptions Interval: ${SUBS_INTERVAL_MS / 60000} mins`);
log("DAEMON", `• GMP Trend Interval:    ${GMP_INTERVAL_MS / 60000} mins`);
log("DAEMON", `• Full Ingestion Interval: ${FULL_INTERVAL_MS / 3600000} hours`);

// Initial Startup Sync
await runSync("all");

// Periodic Timers
setInterval(() => runSync("subs"), SUBS_INTERVAL_MS);
setInterval(() => runSync("gmp"), GMP_INTERVAL_MS);
setInterval(() => runSync("all"), FULL_INTERVAL_MS);

// Keep alive
process.on("SIGINT", () => {
  log("DAEMON", "Shutting down sync daemon.");
  process.exit(0);
});
