/**
 * Multi-provider AI abstraction layer.
 *
 * Implements a fallback chain:
 *   1. OpenRouter (free models)
 *   2. Groq (free tier)
 *   3. Paid APIs (optional — only if env vars are set)
 *
 * @module ai-providers
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface AiExtractionResult {
  text: string;
  provider: string;
  model: string;
}

interface AiModel {
  id: string;
  label: string;
}

interface AiProvider {
  name: string;
  models: AiModel[];
  call(model: AiModel, systemPrompt: string, userText: string): Promise<string>;
  isAvailable(): boolean;
}

// ─── OpenRouter Provider ────────────────────────────────────────────────────────

const OPENROUTER_MODELS: AiModel[] = [
  { id: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron 3 Ultra 550B" },
  { id: "google/gemma-4-31b-it:free", label: "Gemma 4 31B IT" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", label: "Nemotron 3 Super 120B" },
  { id: "google/gemma-4-26b-a4b-it:free", label: "Gemma 4 26B A4B IT" },
  { id: "nvidia/nemotron-nano-9b-v2:free", label: "Nemotron Nano 9B V2" },
  { id: "openai/gpt-oss-20b:free", label: "GPT-OSS 20B" },
];

class OpenRouterProvider implements AiProvider {
  name = "OpenRouter";
  models = OPENROUTER_MODELS;

  isAvailable(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async call(
    model: AiModel,
    systemPrompt: string,
    userText: string
  ): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://ipocraft.com",
        "X-Title": "IPOCraft RHP Extraction",
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText },
        ],
        temperature: 0.1,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `OpenRouter ${model.id} failed (${response.status}): ${errorBody.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error(`OpenRouter ${model.id}: empty response`);
    return content;
  }
}

// ─── Groq Provider ──────────────────────────────────────────────────────────────

const GROQ_MODELS: AiModel[] = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
  { id: "gemma2-9b-it", label: "Gemma 2 9B" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B" },
];

class GroqProvider implements AiProvider {
  name = "Groq";
  models = GROQ_MODELS;

  isAvailable(): boolean {
    return !!process.env.GROQ_API_KEY;
  }

  async call(
    model: AiModel,
    systemPrompt: string,
    userText: string
  ): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not set");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model.id,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText },
          ],
          temperature: 0.1,
          max_tokens: 8192,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `Groq ${model.id} failed (${response.status}): ${errorBody.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error(`Groq ${model.id}: empty response`);
    return content;
  }
}

// ─── Paid Provider (Gemini / OpenAI — optional) ─────────────────────────────────

const PAID_MODELS: AiModel[] = [];

class PaidProvider implements AiProvider {
  name = "Paid";
  models: AiModel[] = [];

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.models.push({
        id: "gemini-2.0-flash",
        label: "Gemini 2.0 Flash",
      });
    }
    if (process.env.OPENAI_API_KEY) {
      this.models.push({
        id: "gpt-4o-mini",
        label: "GPT-4o Mini",
      });
    }
  }

  isAvailable(): boolean {
    return this.models.length > 0;
  }

  async call(
    model: AiModel,
    systemPrompt: string,
    userText: string
  ): Promise<string> {
    if (model.id.startsWith("gemini")) {
      return this.callGemini(model, systemPrompt, userText);
    }
    return this.callOpenAI(model, systemPrompt, userText);
  }

  private async callGemini(
    model: AiModel,
    systemPrompt: string,
    userText: string
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\n${userText}` }] },
          ],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini failed (${response.status})`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  private async callOpenAI(
    model: AiModel,
    systemPrompt: string,
    userText: string
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model.id,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText },
          ],
          temperature: 0.1,
          max_tokens: 8192,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI failed (${response.status})`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "";
  }
}

// ─── Fallback Chain ─────────────────────────────────────────────────────────────

const providers: AiProvider[] = [
  new OpenRouterProvider(),
  new GroqProvider(),
  new PaidProvider(),
];

/**
 * Try all providers and models in priority order until one succeeds.
 * Returns the first successful response along with which provider/model was used.
 */
export async function extractWithFallback(
  systemPrompt: string,
  userText: string
): Promise<AiExtractionResult> {
  const errors: string[] = [];

  for (const provider of providers) {
    if (!provider.isAvailable()) {
      errors.push(`${provider.name}: not configured (API key missing)`);
      continue;
    }

    for (const model of provider.models) {
      try {
        console.log(`[RHP] Trying ${provider.name} / ${model.label}...`);
        const text = await provider.call(model, systemPrompt, userText);

        if (!text.trim()) {
          errors.push(`${provider.name}/${model.label}: empty response`);
          continue;
        }

        console.log(
          `[RHP] Success with ${provider.name} / ${model.label} (${text.length} chars)`
        );
        return {
          text,
          provider: provider.name,
          model: model.label,
        };
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : String(err);
        console.warn(`[RHP] ${provider.name}/${model.label} failed: ${msg}`);
        errors.push(`${provider.name}/${model.label}: ${msg}`);
      }
    }
  }

  throw new Error(
    `All AI providers failed. Errors:\n${errors.join("\n")}`
  );
}
