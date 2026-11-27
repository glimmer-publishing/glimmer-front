import { toUrlSearchParams } from "@/shared/lib/searchParams/urlParams";

/**
 * GET /api/recommendations for a cart: ?slug=<in cart>&genre=<of the cart>.
 * The route reads both lists with readListParam.
 */
export const recommendationsHref = (slugs: string[], genreSlugs: string[]) =>
  `/api/recommendations?${toUrlSearchParams({ slug: slugs, genre: genreSlugs })}`;
