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

    // Convert company name → domain guess
    const domain =
      companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";

    const logo = `https://logo.clearbit.com/${domain}`;

    // Placeholder description (safe)
    const description = `${companyName} is a company planning to raise capital through an Initial Public Offering (IPO). Investors should refer to official filings for complete information.`;

    return NextResponse.json({
      logo,
      industry: "To be updated",
      description,
      website: `https://${domain}`,
      gmp: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch IPO data" },
      { status: 500 }
    );
  }
}