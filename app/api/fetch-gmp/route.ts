import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name required" },
        { status: 400 }
      );
    }

    /**
     * GMP (Grey Market Premium) is an unofficial, unregulated market indicator.
     * It must be entered manually from verified public sources.
     * Returning null ensures no fabricated data is displayed.
     */
    return NextResponse.json({
      gmp: null,
      source: "manual_entry_required",
      message:
        "GMP must be entered manually from verified sources. Automated GMP fetching is not available.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}