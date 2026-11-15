import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { SANITY_CACHE_TAG } from "@/utils/fetchSanityDataServer";

/* Invalidates every cached Sanity read (pages, search data, feed). Pages
   rebuild lazily on their next visit, so a full invalidation is cheap.

   Two callers, each with its own secret. Without its secret a caller can do
   nothing, and the site falls back to the hourly time-based revalidation:
   - POST: the Sanity webhook (configured per dataset in sanity.io/manage),
     signed with SANITY_REVALIDATE_SECRET.
   - GET: Vercel Cron at Kyiv midnight (see vercel.json), which sends
     "Authorization: Bearer <CRON_SECRET>". Discount windows switch on the
     Kyiv date, and cached HTML does not roll over by itself. */

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 500 }
    );
  }

  try {
    // Waits briefly by default so the re-render reads the published data
    // rather than a stale copy from Sanity's API CDN.
    const { isValidSignature } = await parseBody(req, secret);

    if (isValidSignature !== true) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  revalidateTag(SANITY_CACHE_TAG);

  return NextResponse.json({ revalidated: true });
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG);

  return NextResponse.json({ revalidated: true });
}
