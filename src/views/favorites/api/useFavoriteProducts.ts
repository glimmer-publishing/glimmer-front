"use client";
import { useFavoriteSlugs } from "@/entities/favorite/model/useFavorite";
import type { ListingParams } from "@/entities/product/model/listingParams";
import { useListingBySlugs } from "@/entities/product/api/useListingBySlugs";

/**
 * The favorites listing: the slugs saved in this browser, listed with the
 * page's params. hasNone is true once the slugs are read and none is saved.
 */
export const useFavoriteProducts = (params: ListingParams) => {
  const { hydrated, slugs } = useFavoriteSlugs();
  const query = useListingBySlugs(slugs, params, hydrated);

  return {
    listing: query.data?.listing ?? null,
    hasNone: hydrated && !slugs.length,
    isLoading: !hydrated || (slugs.length > 0 && query.isPending),
    isError: query.isError,
  };
};
