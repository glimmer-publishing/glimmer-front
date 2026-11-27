"use client";
import { useFavoriteSlugs } from "@/entities/favorite/hooks/useFavorite";
import type { ListingParams } from "@/entities/product/lib/listingParams";
import { useFetchListingBySlugs } from "@/entities/product/hooks/useFetchListingBySlugs";

/**
 * The favorites listing: the slugs saved in this browser, listed with the
 * page's params. hasNone is true once the slugs are read and none is saved.
 */
export const useFetchFavoriteProducts = (params: ListingParams) => {
  const { hydrated, slugs } = useFavoriteSlugs();
  const query = useFetchListingBySlugs(slugs, params, hydrated);

  return {
    listing: query.data?.listing ?? null,
    hasNone: hydrated && !slugs.length,
    isLoading: !hydrated || (slugs.length > 0 && query.isPending),
    isError: query.isError,
  };
};
