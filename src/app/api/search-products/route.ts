import { NextResponse } from "next/server";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { searchProductsQuery } from "@/lib/queries";

/* The header search's product list, loaded by the browser the first time
   search is opened. A cached GET like /api/feed: served from Vercel's cache
   and rebuilt when /api/revalidate invalidates the Sanity tag. Must stay
   equal to SANITY_DATA_REVALIDATE (a literal is required here). */
export const revalidate = 3600;

export async function GET() {
  // Failures throw rather than return an error response: Next caches whatever
  // Response the handler returns, while a thrown error keeps the previous list.
  const products = await fetchSanityDataServer(searchProductsQuery);

  if (!Array.isArray(products)) {
    throw new Error("Search products query did not return a list");
  }

  return NextResponse.json(products);
}
