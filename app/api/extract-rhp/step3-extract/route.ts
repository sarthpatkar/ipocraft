import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ success: true, message: "This route is deprecated. Please use step3a, step3b, and step3c instead." });
}
