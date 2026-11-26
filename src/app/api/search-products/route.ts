import { NextResponse } from "next/server";
import { getSearchProducts } from "@/features/search-products/api/getSearchProducts";

/**
 * The header search's product list, loaded by the browser the first time
 * search is opened. A cached GET like /api/feed: served from Vercel's cache
 * and rebuilt when /api/revalidate invalidates the Sanity tag. Must stay
 * equal to SANITY_DATA_REVALIDATE (a literal is required here).
 */
export const revalidate = 3600;

/**
 * Failures throw rather than return an error response: Next caches whatever
 * Response the handler returns, while a thrown error keeps the previous list.
 */
export async function GET() {
  return NextResponse.json(await getSearchProducts());
}
