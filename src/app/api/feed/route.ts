import { getFeedProducts } from "@/features/feed/api/getFeedProducts";
import { buildFeedXml } from "@/features/feed/lib/buildFeedXml";
import { publicEnv } from "@/shared/config/env";

export const revalidate = 3600;

/**
 * GET /api/feed: the Google Merchant Center RSS feed of books with a cover,
 * cached like every Sanity read.
 */
export async function GET() {
  const xml = buildFeedXml(await getFeedProducts(), publicEnv.siteUrl);

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
