import { NextResponse } from "next/server";
import { searchFinApiIpo } from "@/lib/finapi/client";
import { parseGmpTrends, parseNumber } from "@/lib/finapi/transformer";

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

    const match = await searchFinApiIpo(companyName);

    if (!match) {
      return NextResponse.json({
        gmp: null,
        trends: [],
        source: "finapi_live",
        message: `No live GMP found for "${companyName}".`,
      });
    }

    const trends = parseGmpTrends(match.greyMarketPremium?.gmpTrends);
    const latestTrend = trends.at(-1);
    const gmpValue = latestTrend?.gmp ?? null;

    return NextResponse.json({
      gmp: gmpValue,
      trends,
      source: match.greyMarketPremium?.gmpSource || "FinAPI Live",
      message: gmpValue !== null ? "Live GMP fetched successfully" : "No active GMP quoted yet",
    });
  } catch (error: any) {
    console.error("fetch-gmp error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}