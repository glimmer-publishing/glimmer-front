import "server-only";
import type { ManualRecommendationsBySlug } from "../model/types";
import {
  allRecommendedProductsQuery,
  manualRecommendationsBySlugsQuery,
} from "./queries";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import { Product } from "../model/product";
import {
  mergeRecommendedProducts,
  orderManualRecommendations,
} from "../lib/mergeRecommendedProducts";

/**
 * Suggestions for one or more books (the product page, the checkout cart):
 * the curated picks of each, the first one's leading, then products sharing
 * one of genreSlugs, excluding the first slug. Cached like every server
 * read; a Sanity failure only empties the list.
 */
export const getRecommendations = async (
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
