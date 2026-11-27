import { NextRequest, NextResponse } from "next/server";
import { parseListingParams } from "@/entities/product/lib/listingParams";
import type { ProductListingResponse } from "@/entities/product/model/types";
import { getListingBySlugs } from "@/entities/product/api/getListingBySlugs";

/**
 * The listing of the products with these slugs, for browser-only lists such
 * as favorites: ?slug=a&slug=b plus the usual filter, sort and page. Not
 * cached as a response, since every visitor sends other slugs; the products
 * come from the whole-catalog read every visitor shares.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  return NextResponse.json<ProductListingResponse>(
    await getListingBySlugs(
      searchParams.getAll("slug"),
      parseListingParams(searchParams)
    )
  );
}
