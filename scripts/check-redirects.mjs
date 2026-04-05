#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const MAX_REDIRECTS = 10;

function normalizePathname(pathname) {
  const compact = pathname.replace(/\/{2,}/g, "/");

  if (compact === "/" || compact === "") {
    return "/";
  }

  return compact.replace(/\/+$/, "") || "/";
}

function normalizeUrl(url) {
  const parsed = new URL(url);
  const pathname = normalizePathname(parsed.pathname);

  if (pathname === "/") {
    return `${parsed.protocol}//${parsed.host}`;
  }

  return `${parsed.protocol}//${parsed.host}${pathname}`;
}

function extractCanonical(html) {
  const linkMatch = html.match(
    /<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i
  );

  if (linkMatch?.[1]) {
    return linkMatch[1];
  }

  const reversedMatch = html.match(
    /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i
  );

  return reversedMatch?.[1] ?? "";
}

function parseInputSpec(value) {
  const match = value.match(/^(.*)@(\d{3})$/);

  if (!match) {
    return { raw: value, target: value, expectedStatus: 200 };
  }

  return {
    raw: value,
    target: match[1],
    expectedStatus: Number(match[2]),
  };
}

function resolveTarget(target, base) {
  if (/^https?:\/\//i.test(target)) {
    return target;
  }

  if (!base) {
    throw new Error(`Base URL is required for path input: ${target}`);
  }

  return new URL(target, base).toString();
}

async function loadInputs(file) {
  if (!file) {
    return [];
  }

  const content = await readFile(file, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

async function inspectUrl(inputUrl) {
  let currentUrl = inputUrl;
  let redirects = 0;

  while (redirects <= MAX_REDIRECTS) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        "user-agent": "ipocraft-seo-audit/1.0",
      },
    });

    const isRedirect =
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.has("location");

    if (isRedirect) {
      redirects += 1;
      currentUrl = new URL(response.headers.get("location"), currentUrl).toString();
      continue;
    }

    let canonical = "";
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      canonical = extractCanonical(await response.text());
    }

    const canonicalMatches =
      response.status === 200 && canonical
        ? normalizeUrl(canonical) === normalizeUrl(currentUrl)
        : null;

    return {
      finalUrl: currentUrl,
      status: response.status,
      redirects,
      canonical,
      canonicalMatches,
    };
  }

  throw new Error(`Redirect chain exceeded ${MAX_REDIRECTS} hops for ${inputUrl}`);
}

function formatCell(value, width) {
  return String(value).padEnd(width, " ");
}

async function main() {
  const args = process.argv.slice(2);
  const cliInputs = [];
  let base = "";
  let file = "";

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--base") {
      base = args[i + 1] || "";
      i += 1;
      continue;
    }

    if (arg === "--file") {
      file = args[i + 1] || "";
      i += 1;
      continue;
    }

    cliInputs.push(arg);
  }

  const fileInputs = await loadInputs(file);
  const specs = [...fileInputs, ...cliInputs].map(parseInputSpec);

  if (specs.length === 0) {
    console.error(
      "Usage: node scripts/check-redirects.mjs [--base https://ipocraft.com] [--file urls.txt] /about /contact https://ipocraft.com/ipo/sample-slug"
    );
    process.exit(1);
  }

  const results = [];

  for (const spec of specs) {
    try {
      const inputUrl = resolveTarget(spec.target, base);
      const result = await inspectUrl(inputUrl);
      results.push({
        input: inputUrl,
        expectedStatus: spec.expectedStatus,
        ...result,
        ok:
          result.redirects <= 1 &&
          result.status === spec.expectedStatus &&
          (spec.expectedStatus !== 200 || result.canonicalMatches === true),
      });
    } catch (error) {
      results.push({
        input: spec.target,
        expectedStatus: spec.expectedStatus,
        finalUrl: "ERROR",
        status: "ERR",
        redirects: "ERR",
        canonical: error instanceof Error ? error.message : "Unknown error",
        canonicalMatches: false,
        ok: false,
      });
    }
  }

  const rows = results.map((result) => ({
    input: result.input,
    finalUrl: result.finalUrl,
    status: `${result.status} (exp ${result.expectedStatus})`,
    redirects: result.redirects,
    canonical: result.canonical || "missing",
    canonicalMatches:
      result.expectedStatus === 200
        ? result.canonicalMatches === true
          ? "yes"
          : "no"
        : "n/a",
    ok: result.ok ? "pass" : "fail",
  }));

  const headers = {
    input: "Input",
    finalUrl: "Final URL",
    status: "Status",
    redirects: "Redirects",
    canonical: "Canonical",
    canonicalMatches: "Canonical Match",
    ok: "Result",
  };

  const widths = Object.fromEntries(
    Object.keys(headers).map((key) => {
      const values = rows.map((row) => row[key]);
      return [
        key,
        Math.max(headers[key].length, ...values.map((value) => String(value).length)),
      ];
    })
  );

  const orderedKeys = [
    "input",
    "finalUrl",
    "status",
    "redirects",
    "canonical",
    "canonicalMatches",
    "ok",
  ];

  console.log(
    orderedKeys.map((key) => formatCell(headers[key], widths[key])).join("  ")
  );
  console.log(
    orderedKeys.map((key) => "-".repeat(widths[key])).join("  ")
  );

  for (const row of rows) {
    console.log(
      orderedKeys.map((key) => formatCell(row[key], widths[key])).join("  ")
    );
  }

  if (results.some((result) => !result.ok)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
