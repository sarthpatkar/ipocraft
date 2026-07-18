import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ipoId: string }> }
) {
  try {
    const { ipoId } = await params;
    
    if (!ipoId || isNaN(Number(ipoId))) {
      return NextResponse.json(
        { error: "Invalid IPO ID" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from("subscription_history")
      .select("*")
      .eq("ipo_id", Number(ipoId))
      .order("day", { ascending: true });

    if (error) {
      console.error(`Database error fetching subscriptions for IPO ID ${ipoId}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch subscription history" },
        { status: 500 }
      );
    }
    
    const sanitizedData = (data || []).map((row: any) => ({
      ...row,
      day: row.day != null ? String(row.day) : null,
      qib: row.qib != null ? String(row.qib) : null,
      nii: row.nii != null ? String(row.nii) : null,
      shni: row.shni != null ? String(row.shni) : null,
      bhni: row.bhni != null ? String(row.bhni) : null,
      rii: row.rii != null ? String(row.rii) : null,
      total: row.total != null ? String(row.total) : null,
    }));
    
    return NextResponse.json(sanitizedData);
  } catch (error) {
    console.error("Failed to load subscription history:", error);
    return NextResponse.json(
      { error: "Unable to load subscription history" },
      { status: 500 }
    );
  }
}
