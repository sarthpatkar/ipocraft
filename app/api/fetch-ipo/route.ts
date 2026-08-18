import { NextResponse } from "next/server";
import { searchFinApiIpo } from "@/lib/finapi/client";
import { transformFinApiIpo } from "@/lib/finapi/transformer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      return NextResponse.json(
        { error: "Company name or symbol required" },
        { status: 400 }
      );
    }

    const rawMatch = await searchFinApiIpo(companyName);

    if (!rawMatch) {
      return NextResponse.json({
        found: false,
        message: `No IPO matching "${companyName}" found in FinAPI live feed.`,
      });
    }

    const normalized = transformFinApiIpo(rawMatch);

    return NextResponse.json({
      found: true,
      data: normalized,
      // Backwards-compatible legacy fields
      logo: normalized.logo_url,
      industry: normalized.ipo_type === "SME" ? "SME Enterprise" : "Mainboard",
      description: normalized.about_company,
      gmp: normalized.gmp,
    });
  } catch (error: any) {
    console.error("fetch-ipo error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}