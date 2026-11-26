import "server-only";
import {
  allRecommendedProductsQuery,
  manualRecommendationsBySlugsQuery,
  type ManualRecommendationsBySlug,
} from "@/lib/queries";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import { Product } from "@/types/product";
import {
  mergeRecommendedProducts,
  orderManualRecommendations,
} from "@/utils/mergeRecommendedProducts";

/**
 * Suggestions for a cart: the curated picks of every cart product, the first
 * one's leading, then products sharing a genre with the first. Cached like
 * every server read; a Sanity failure only empties the list.
 */
export const getCartRecommendations = async (
  slugs: string[],
  genreSlugs: string[]
): Promise<Product[]> => {
  const [currentSlug] = slugs;
  if (!currentSlug) return [];

  const [genreBased, manual]: [
    Product[] | undefined,
    ManualRecommendationsBySlug[] | undefined,
  ] = await Promise.all([
    genreSlugs.length
      ? fetchSanityDataServer(
          allRecommendedProductsQuery,
          { genreSlugs, currentSlug },
          { throwError: false }
        )
      : undefined,
    fetchSanityDataServer(
      manualRecommendationsBySlugsQuery,
      { slugs },
      { throwError: false }
    ),
  ]);

  return mergeRecommendedProducts(
    orderManualRecommendations(manual, slugs),
    genreBased
  );
};
