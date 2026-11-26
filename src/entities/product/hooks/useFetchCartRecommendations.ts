"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/shared/api/http/fetchJson";
import type { Product } from "../model/product";

/**
 * Suggestions for the cart from GET /api/recommendations, keyed on the cart's
 * slugs, so a change of quantity does not refetch.
 */
export const useFetchCartRecommendations = (
  slugs: string[],
  genreSlugs: string[]
) => {
  const params = new URLSearchParams();
  slugs.forEach((slug) => params.append("slug", slug));
  genreSlugs.forEach((genre) => params.append("genre", genre));
  const url = `/api/recommendations?${params}`;

  return useQuery({
    queryKey: ["cart-recommendations", url],
    queryFn: ({ signal }) => fetchJson<Product[]>(url, signal),
    enabled: slugs.length > 0,
  });
};
