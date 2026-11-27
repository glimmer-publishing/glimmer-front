"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/shared/api/http/fetchJson";
import { recommendationsHref } from "../lib/recommendationsParams";
import type { Product } from "../model/product";

/**
 * Suggestions for the cart from GET /api/recommendations, keyed on the cart's
 * slugs, so a change of quantity does not refetch.
 */
export const useFetchCartRecommendations = (
  slugs: string[],
  genreSlugs: string[]
) => {
  const url = recommendationsHref(slugs, genreSlugs);

  return useQuery({
    queryKey: ["cart-recommendations", url],
    queryFn: ({ signal }) => fetchJson<Product[]>(url, signal),
    enabled: slugs.length > 0,
  });
};
