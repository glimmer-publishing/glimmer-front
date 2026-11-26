"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

/**
 * Suggestions for the cart from GET /api/recommendations, keyed on the cart's
 * slugs, so a change of quantity does not refetch.
 */
export const useCartRecommendations = (
  slugs: string[],
  genreSlugs: string[]
) => {
  const params = new URLSearchParams();
  slugs.forEach((slug) => params.append("slug", slug));
  genreSlugs.forEach((genre) => params.append("genre", genre));
  const url = `/api/recommendations?${params}`;

  return useQuery({
    queryKey: ["cart-recommendations", url],
    queryFn: async ({ signal }): Promise<Product[]> => {
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return response.json();
    },
    enabled: slugs.length > 0,
  });
};
