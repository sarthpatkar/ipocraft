#!/usr/bin/env node
// One-time content-translation helper for the hi/mr glossary pages.
// Usage: node scripts/sarvam-batch-translate.mjs <input.json> <hi-IN|mr-IN> <output.json>
// input.json: JSON array of English strings.
// output.json: JSON array of translated strings (acronym-normalized).

import { readFileSync, writeFileSync } from "fs";

// Minimal .env.local reader — avoids adding a dotenv dependency for a
// one-time script.
function loadEnvLocal() {
  const path = new URL("../.env.local", import.meta.url);
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2];
    }
  }
}
loadEnvLocal();

const API_KEY = process.env.SARVAM_API_KEY;
if (!API_KEY) {
  console.error("SARVAM_API_KEY not set in .env.local");
  process.exit(1);
}

const [, , inputPath, targetLang, outputPath] = process.argv;
if (!inputPath || !targetLang || !outputPath) {
  console.error("Usage: node sarvam-batch-translate.mjs <input.json> <hi-IN|mr-IN> <output.json>");
  process.exit(1);
}

// Devanagari transliterations Sarvam produces for acronyms we want kept in
// Latin script, matching how Indian financial media (Moneycontrol Hindi,
// Business Standard Hindi, Zee Business) actually writes them.
const ACRONYM_FIX = {
  "hi-IN": {
    "आईपीओक्राफ्ट": "IPOCraft",
    "आई. पी. ओ. क्राफ्ट": "IPOCraft",
    "IPOक्राफ्ट": "IPOCraft",
    "आई.पी.ओ.": "IPO",
    "आईपीओ": "IPO",
    "जी.एम.पी.": "GMP",
    "जीएमपी": "GMP",
    "से.बी.आई.": "SEBI",
    "सेबी": "SEBI",
    "क्यू.आई.बी.": "QIB",
    "क्यूआईबी": "QIB",
    "एच.एन.आई.": "HNI",
    "एचएनआई": "HNI",
    "एन.आई.आई.": "NII",
    "एनआईआई": "NII",
    "आर.आई.आई.": "RII",
    "आरआईआई": "RII",
    "डी.आर.एच.पी.": "DRHP",
    "डीआरएचपी": "DRHP",
    "आर.एच.पी.": "RHP",
    "आरएचपी": "RHP",
    "बी.एस.ई.": "BSE",
    "बीएसई": "BSE",
    "एन.एस.ई.": "NSE",
    "एनएसई": "NSE",
    "ए.एस.बी.ए.": "ASBA",
    "एएसबीए": "ASBA",
    "एस.एम.ई.": "SME",
    "एसएमई": "SME",
  },
  "mr-IN": {
    "आयपीओक्राफ्ट": "IPOCraft",
    "आईपीओक्राफ्ट": "IPOCraft",
    "IPOक्राफ्ट": "IPOCraft",
    "आय.पी.ओ.": "IPO",
    "आयपीओ": "IPO",
    "आई.पी.ओ.": "IPO",
    "आईपीओ": "IPO",
    "जी.एम.पी.": "GMP",
    "जीएमपी": "GMP",
    "सेबी": "SEBI",
    "क्यू.आय.बी.": "QIB",
    "क्यूआयबी": "QIB",
    "एच.एन.आय.": "HNI",
    "एचएनआय": "HNI",
    "एन.आय.आय.": "NII",
    "एनआयआय": "NII",
    "आर.आय.आय.": "RII",
    "आरआयआय": "RII",
    "डी.आर.एच.पी.": "DRHP",
    "डीआरएचपी": "DRHP",
    "आर.एच.पी.": "RHP",
    "आरएचपी": "RHP",
    "बी.एस.ई.": "BSE",
    "बीएसई": "BSE",
    "एन.एस.ई.": "NSE",
    "एनएसई": "NSE",
    "ए.एस.बी.ए.": "ASBA",
    "एएसबीए": "ASBA",
    "एस.एम.ई.": "SME",
    "एसएमई": "SME",
  },
};

function fixAcronyms(text, lang) {
  const map = ACRONYM_FIX[lang] || {};
  let out = text;
  for (const [dev, latin] of Object.entries(map)) {
    out = out.split(dev).join(latin);
  }
  return out;
}

// Split on sentence boundaries if a block exceeds Sarvam's 2000-char cap.
function chunk(text, max = 1800) {
  if (text.length <= max) return [text];
  const sentences = text.split(/(?<=[.!?।])\s+/);
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + " " + s).length > max) {
      if (cur) chunks.push(cur.trim());
      cur = s;
    } else {
      cur = cur ? cur + " " + s : s;
    }
  }
  if (cur) chunks.push(cur.trim());
  return chunks;
}

async function translateOne(text, targetLang) {
  if (!text || !text.trim()) return text;
  const parts = chunk(text);
  const translatedParts = [];
  for (const part of parts) {
    const res = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": API_KEY,
      },
      body: JSON.stringify({
        input: part,
        source_language_code: "en-IN",
        target_language_code: targetLang,
        model: "sarvam-translate:v1",
        mode: "formal",
        speaker_gender: "Male",
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Sarvam API error ${res.status}: ${body}`);
    }
    const data = await res.json();
    translatedParts.push(data.translated_text);
    // Stay well under the 60 req/min Starter-plan limit.
    await new Promise((r) => setTimeout(r, 1100));
  }
  return fixAcronyms(translatedParts.join(" "), targetLang);
}

async function main() {
  const input = JSON.parse(readFileSync(inputPath, "utf8"));
  if (!Array.isArray(input)) {
    console.error("Input must be a JSON array of strings");
    process.exit(1);
  }
  const output = [];
  for (let i = 0; i < input.length; i++) {
    process.stderr.write(`[${i + 1}/${input.length}] translating -> ${targetLang}...\n`);
    try {
      output.push(await translateOne(input[i], targetLang));
    } catch (err) {
      console.error(`Failed on item ${i}:`, err.message);
      output.push(null); // mark failure, don't silently keep English or crash the batch
    }
  }
  writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
  const failures = output.filter((o) => o === null).length;
  process.stderr.write(`Done. ${input.length - failures}/${input.length} succeeded -> ${outputPath}\n`);
  if (failures > 0) process.exit(2);
}

main();
