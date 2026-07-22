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
     * Company details (logo, industry, description) should be sourced from
     * the company's RHP/DRHP or entered manually by the admin.
     * 
     * The previous implementation guessed domain names and used Clearbit
     * for logos, which was unreliable and produced incorrect data.
     * 
     * With the RHP extraction feature, this endpoint becomes less needed.
     */
    return NextResponse.json({
      logo: null,
      industry: null,
      description: null,
      website: null,
      gmp: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}