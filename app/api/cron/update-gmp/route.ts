import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server secret
    );

    // Get all active IPOs
    const { data: ipos } = await supabase
      .from("ipos")
      .select("id, company_name");

    if (!ipos) {
      return NextResponse.json({ message: "No IPOs found" });
    }

    for (const ipo of ipos) {
      /**
       * SAFE:
       * Replace with legal API later
       */
      const gmp = Math.floor(Math.random() * 200);

      await supabase
        .from("ipos")
        .update({ gmp })
        .eq("id", ipo.id);
    }

    return NextResponse.json({
      success: true,
      updated: ipos.length,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}