import type { Metadata } from "next";
import { PopularBoard } from "@/components/popular-board";
import { SAMPLES } from "@/lib/popular-pages";
import { SITE_URL } from "@/lib/site";

// The same origin as the sitemap, so a copy served on another host (the old Vercel domain) names this one as the page.
export const metadata: Metadata = { alternates: { canonical: `${SITE_URL}/` } };

export default function Home() {
  return <PopularBoard samples={SAMPLES} />;
}
