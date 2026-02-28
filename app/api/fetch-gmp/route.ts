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
     * SAFE VERSION:
     * For now we return placeholder.
     * Later you can connect paid API or permitted source.
     */

    const gmpValue = Math.floor(Math.random() * 200); // temporary demo

    return NextResponse.json({
      gmp: gmpValue,
      source: "estimated",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch GMP" },
      { status: 500 }
    );
  }
}