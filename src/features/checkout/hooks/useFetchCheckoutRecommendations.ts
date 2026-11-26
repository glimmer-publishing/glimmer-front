"use client";
import { useMemo } from "react";
import type { PricedLine } from "@/entities/cart/model/types";
import { useFetchCartRecommendations } from "@/entities/product/hooks/useFetchCartRecommendations";

/* How many suggestions checkout shows. */
const MAX_RECOMMENDED = 2;

/**
 * Up to two products to suggest for this cart: the cart products' curated
 * picks first, then books sharing a genre with the first cart product.
 *
 * The request is keyed on the slugs themselves, so changing a quantity does
 * not look like a new set of products and refetch. Products already in the
 * cart are filtered out here rather than by the request, so adding a
 * suggestion hides it at once instead of refetching.
 */
export const useFetchCheckoutRecommendations = (lines: PricedLine[]) => {
  const slugsKey = lines.map((line) => line.slug).join("\n");
  const genresKey = lines[0]?.genreSlugs.join("\n") ?? "";
  const slugs = useMemo(
    () => (slugsKey ? slugsKey.split("\n") : []),
    [slugsKey]
  );
  const genreSlugs = useMemo(
    () => (genresKey ? genresKey.split("\n") : []),
    [genresKey]
  );

  const { data: recommended = [] } = useFetchCartRecommendations(
    slugs,
    genreSlugs
  );

  return useMemo(() => {
    const inCart = new Set(lines.map((line) => line.id));
    return recommended
      .filter((product) => !inCart.has(product.id))
      .slice(0, MAX_RECOMMENDED);
  }, [recommended, lines]);
};
