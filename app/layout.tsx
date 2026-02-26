import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPOCraft — IPO GMP & SME IPO Updates",
  description:
    "Latest IPO GMP, SME IPO insights, subscription data, and upcoming IPO alerts for Indian investors.",
  metadataBase: new URL("https://ipocraft.com"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-[#0f172a] antialiased">
        {children}
      </body>
    </html>
  );
}