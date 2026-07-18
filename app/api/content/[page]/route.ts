import { NextResponse } from "next/server";

export const dynamic = "force-static";

const contentData: Record<string, { title: string; body: string }> = {
  about: {
    title: "About IPOCraft",
    body: "IPOCraft is your data-driven platform for tracking IPO GMP, subscription status, allotment dates, and listing performance. We consolidate data from exchange disclosures and market sentiment to provide actionable insights. Our mission is to make IPO investing transparent and accessible."
  },
  privacy: {
    title: "Privacy Policy",
    body: "IPOCraft respects your privacy. We collect minimal personal data such as basic analytics to improve our services. We do not sell your personal information. Any data you provide is secured and processed in compliance with DPDP Act and GDPR where applicable. We use necessary cookies to ensure platform stability."
  },
  contact: {
    title: "Contact Us",
    body: "Have questions, feedback, or partnership inquiries? Reach out to us. We aim to respond to all queries within 24-48 business hours.\n\nEmail: contact@ipocraft.com"
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  const content = contentData[page.toLowerCase()];
  
  if (!content) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(content);
}
