import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/entities/product/api/getRecommendations";
import { readListParam } from "@/shared/lib/searchParams/urlParams";

/**
 * Product suggestions for a cart: ?slug=<cart slugs, first leads>&genre=<the
 * first product's genres>.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  return NextResponse.json(
    await getRecommendations(
      readListParam(searchParams, "slug"),
      readListParam(searchParams, "genre")
    )
  );
}
