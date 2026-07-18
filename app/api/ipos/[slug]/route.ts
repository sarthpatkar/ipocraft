import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { sanitizeIpoSlug } from "@/lib/ipo.server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = sanitizeIpoSlug(rawSlug);

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid IPO slug" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from("ipos")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Database error for slug ${slug}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch IPO details" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "IPO not found" },
        { status: 404 }
      );
    }

    const sanitizedData = {
      ...data,
      sub_total: data.sub_total != null ? String(data.sub_total) : null,
      sub_qib: data.sub_qib != null ? String(data.sub_qib) : null,
      sub_nii: data.sub_nii != null ? String(data.sub_nii) : null,
      sub_rii: data.sub_rii != null ? String(data.sub_rii) : null,
      sub_shni: data.sub_shni != null ? String(data.sub_shni) : null,
      sub_bhni: data.sub_bhni != null ? String(data.sub_bhni) : null,
    };
    
    return NextResponse.json(sanitizedData);
  } catch (error) {
    console.error("Failed to load IPO details:", error);
    return NextResponse.json(
      { error: "Unable to load IPO details" },
      { status: 500 }
    );
  }
}
