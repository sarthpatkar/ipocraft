import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get ALL IPO IDs
    const { data: ipos, error } = await supabase
      .from("ipos")
      .select("id");

    if (error) {
      console.error("DB Error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!ipos || ipos.length === 0) {
      return NextResponse.json({ message: "No IPOs found" });
    }

    let updatedCount = 0;

    for (const ipo of ipos) {
      const gmp = Math.floor(Math.random() * 200);

      const { error: updateError } = await supabase
        .from("ipos")
        .update({ gmp })
        .eq("id", ipo.id);

      if (!updateError) updatedCount++;
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}