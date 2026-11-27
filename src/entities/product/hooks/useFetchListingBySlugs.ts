"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsBySlugsHref, type ListingParams } from "../lib/listingParams";
import { fetchJson } from "@/shared/api/http/fetchJson";
import type { ProductListingResponse } from "../model/types";

/**
 * The listing of the products with these slugs, loaded in the browser from
 * GET /api/products. Nothing is requested while enabled is false or there
 * are no slugs. A change of slugs or params keeps the previous listing on
 * screen until the new one arrives.
 */
export const useFetchListingBySlugs = (
  slugs: string[],
  params: ListingParams,
  enabled = true
) => {
  const url = productsBySlugsHref(slugs, params);

  return useQuery({
    queryKey: ["product-listing", url],
    queryFn: ({ signal }) => fetchJson<ProductListingResponse>(url, signal),
    enabled: enabled && slugs.length > 0,
    placeholderData: keepPreviousData,
  });
};
