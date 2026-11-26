import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/entities/product/api/getRecommendations";

const MAX_PARAMS = 50;

const readList = (params: URLSearchParams, name: string) =>
  params
    .getAll(name)
    .filter((value) => value && value.length <= 200)
    .slice(0, MAX_PARAMS);

/**
 * Product suggestions for a cart: ?slug=<cart slugs, first leads>&genre=<the
 * first product's genres>.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  return NextResponse.json(
    await getRecommendations(
      readList(searchParams, "slug"),
      readList(searchParams, "genre")
    )
  );
}
