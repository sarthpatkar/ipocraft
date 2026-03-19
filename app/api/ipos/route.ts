import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getIpoFeedPage } from "@/lib/ipoFeed";

export const dynamic = "force-dynamic";

function parseLimit(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createSupabaseServerClient();

    const result = await getIpoFeedPage({
      supabase,
      limit: parseLimit(searchParams.get("limit")),
      status: searchParams.get("status") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      snapshot: searchParams.get("snapshot"),
      cursor: {
        open_date: searchParams.get("cursorOpenDate"),
        created_at: searchParams.get("cursorCreatedAt"),
        slug: searchParams.get("cursorSlug"),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to load IPO feed page:", error);
    return NextResponse.json(
      { error: "Unable to load IPO feed page" },
      { status: 500 }
    );
  }
}
