/**
 * app/api/chat/route.ts
 * High-speed multi-provider streaming chat route (Groq -> OpenRouter -> NVIDIA).
 * Sub-second first-token latency with zero internal technical jargon.
 */

import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/chat/rateLimit";
import { classifyIntent } from "@/lib/chat/intentClassifier";
import { fetchDataForIntent } from "@/lib/chat/dataFetcher";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

interface ProviderConfig {
  name: string;
  client: OpenAI;
  model: string;
  extra?: Record<string, unknown>;
}

function getProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // 1. Groq — Ultra-fast inference (<350ms)
  if (process.env.GROQ_API_KEY) {
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
      defaultHeaders: {
        "User-Agent": "IPOCraft-Chat/1.0 (Node.js)",
      },
    });

    providers.push({
      name: "Groq-GPT-OSS-120B",
      client: groq,
      model: "openai/gpt-oss-120b",
    });
    providers.push({
      name: "Groq-GPT-OSS-20B",
      client: groq,
      model: "openai/gpt-oss-20b",
    });
    providers.push({
      name: "Groq-Qwen-27B",
      client: groq,
      model: "qwen/qwen3.8-27b",
    });
    providers.push({
      name: "Groq-Compound",
      client: groq,
      model: "groq/compound",
    });
  }

  // 2. OpenRouter — Fast free models
  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://ipocraft.com",
        "X-Title": "IPOCraft Chatbot",
        "User-Agent": "IPOCraft-Chat/1.0",
      },
    });
    providers.push({
      name: "OpenRouter-Llama-70B",
      client: openrouter,
      model: "meta-llama/llama-3.3-70b-instruct:free",
    });
    providers.push({
      name: "OpenRouter-Gemini-Flash",
      client: openrouter,
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
    });
  }

  // 3. NVIDIA API — Direct fallback
  if (process.env.NVIDIA_API_KEY) {
    const nvidia = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
      defaultHeaders: {
        "User-Agent": "IPOCraft-Chat/1.0",
      },
    });
    providers.push({
      name: "NVIDIA-Llama-70B",
      client: nvidia,
      model: "meta/llama-3.3-70b-instruct",
    });
  }

  return providers;
}


export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // ── Rate limiting ──
  const ip = getClientIp(req);
  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "rate_limited",
        message: "You've reached the free query limit (20/hour). Please try again in a bit.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Parse body ──
  let body: { message: string; history: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { message, history = [] } = body;
  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "Empty message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Step 1: Instant 0ms Intent Classification ──
  const intent = classifyIntent(message, history);

  // ── Step 2: Fetch Live IPO Market Data ──
  const { context, timestamp, found } = await fetchDataForIntent(intent);

  // ── Step 3: Build Market Context System Prompt ──
  const systemPrompt = buildSystemPrompt(intent.intent, context, timestamp, found);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  const providers = getProviders();
  if (providers.length === 0) {
    return new Response(
      JSON.stringify({ error: "No AI provider configured in environment." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Emit metadata first
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "meta", intent: intent.intent, remaining })}\n\n`
        )
      );

      let streamCreated = false;
      let lastError: Error | null = null;
      let successfulProvider = "";

      for (const provider of providers) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const completion = await (provider.client.chat.completions.create as any)({
            model: provider.model,
            messages,
            temperature: 0.3,
            max_tokens: 1536,
            stream: true,
            ...(provider.extra || {}),
          });

          streamCreated = true;
          successfulProvider = provider.name;
          let fullBuffer = "";
          let thinkEnded = false;

          for await (const chunk of completion) {
            // @ts-ignore
            if (chunk.choices?.[0]?.delta?.reasoning_content) {
              continue;
            }

            const text: string = chunk.choices?.[0]?.delta?.content ?? "";
            if (!text) continue;

            if (thinkEnded) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "token", content: text })}\n\n`
                )
              );
            } else {
              fullBuffer += text;
              const trimmed = fullBuffer.trimStart();
              if (trimmed.startsWith("<think>")) {
                const endIdx = trimmed.indexOf("</think>");
                if (endIdx !== -1) {
                  thinkEnded = true;
                  const after = trimmed.slice(endIdx + 8).trimStart();
                  if (after) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "token", content: after })}\n\n`
                      )
                    );
                  }
                }
              } else if ("<think>".startsWith(trimmed)) {
                // Buffering initial characters to check if it's a <think> tag
              } else {
                thinkEnded = true;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "token", content: fullBuffer })}\n\n`
                  )
                );
              }
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );

          // ── Fire-and-forget query logging (no PII) ──
          try {
            const db = getSupabase();
            db.from("chat_logs").insert({
              intent: intent.intent,
              query_snippet: message.slice(0, 100),
              provider_used: successfulProvider,
              had_ipo_match: found,
              latency_ms: Date.now() - startTime,
            }).then(() => {});
          } catch { /* non-critical, never block the response */ }

          break; // Successfully streamed entire response
        } catch (err) {
          console.warn(`Provider ${provider.name} failed, trying next...`, err);
          lastError = err instanceof Error ? err : new Error(String(err));
          streamCreated = false;
        }
      }

      if (!streamCreated) {
        const errorMsg = lastError?.message || "Market assistant temporarily busy. Please retry.";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: errorMsg })}\n\n`
          )
        );
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Remaining-Requests": String(remaining),
    },
  });
}
