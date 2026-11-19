import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The font variable sits on <html>: the Dashboard shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const DESCRIPTION = "The most visited pages over 24 hours, 7 days or 30 days: visits, share and change. Fixed sample numbers, no analytics connection.";

export const metadata: Metadata = {
  title: "Popular Pages | Bookchaowalit",
  description: DESCRIPTION,
  keywords: ["popular pages", "sample analytics", "page visits"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE_URL),
  openGraph: { type: "website", title: "Popular Pages | Bookchaowalit", description: DESCRIPTION, siteName: "Bookchaowalit" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
