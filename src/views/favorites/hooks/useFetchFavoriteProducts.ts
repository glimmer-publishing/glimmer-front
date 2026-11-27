"use client";
import { useEffect, useMemo } from "react";
import { useFavoriteSlugs } from "@/entities/favorite/hooks/useFavorite";
import { listProducts } from "@/entities/product/lib/listProducts";
import type { ListingParams } from "@/entities/product/lib/listingParams";
import { useFetchListingBySlugs } from "@/entities/product/hooks/useFetchListingBySlugs";
import type { ProductListingResponse } from "@/entities/product/model/types";

/**
 * The favorites listing: the slugs saved in this browser, listed with the
 * page's params. Until the server's listing arrives it is drawn from the
 * saved snapshots with the same filter, sort and paging, provided every
 * favorite has one; each listing that arrives refreshes them. hasNone is
 * true once the slugs are read and none is saved.
 */
export const useFetchFavoriteProducts = (params: ListingParams) => {
  const { hydrated, slugs, snapshots, saveSnapshots } = useFavoriteSlugs();
  const { filter, sort, page } = params;

  const placeholder = useMemo<ProductListingResponse | undefined>(() => {
    if (!slugs.length || slugs.some((slug) => !snapshots[slug])) return;
    return {
      listing: listProducts(
        slugs.map((slug) => snapshots[slug]),
        { filter, sort, page }
      ),
    };
  }, [slugs, snapshots, filter, sort, page]);

  const query = useFetchListingBySlugs(slugs, params, hydrated, placeholder);

  const fresh = query.isPlaceholderData ? undefined : query.data?.listing;
  useEffect(() => {
    if (fresh) saveSnapshots(fresh.page.products);
  }, [fresh, saveSnapshots]);

  return {
    listing: query.data?.listing ?? null,
    hasNone: hydrated && !slugs.length,
    isLoading: !hydrated || (slugs.length > 0 && query.isPending),
    isError: query.isError,
  };
};
