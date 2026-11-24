"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listingHref, ListingParams } from "../model/listingParams";
import { ProductListingResponse } from "../model/types";

const fetchListing = async (
  url: string,
  signal: AbortSignal
): Promise<ProductListingResponse> => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Status ${response.status}`);

  return response.json();
};

/**
 * The listing of the products with these slugs, loaded in the browser from
 * GET /api/products. Nothing is requested while enabled is false or there
 * are no slugs. A change of slugs or params keeps the previous listing on
 * screen until the new one arrives.
 */
export const useListingBySlugs = (
  slugs: string[],
  params: ListingParams,
  enabled = true
) => {
  const slugParams = new URLSearchParams();
  slugs.forEach((slug) => slugParams.append("slug", slug));
  const url = listingHref(`/api/products?${slugParams}`, params);

  return useQuery({
    queryKey: ["product-listing", url],
    queryFn: ({ signal }) => fetchListing(url, signal),
    enabled: enabled && slugs.length > 0,
    placeholderData: keepPreviousData,
  });
};
