"use client";
import { useMemo } from "react";
import { useListingBySlugs } from "@/entities/product/api/useListingBySlugs";
import { orderBySlugs } from "@/entities/product/lib/orderBySlugs";
import { useReviewedSlugs } from "@/entities/reviewed-product/model/useReviewed";

/**
 * The books viewed before this one, most recent first, with current prices
 * from GET /api/products. The listing comes back in catalog order, so the
 * viewing order is restored here. Empty until the history is read.
 */
export const useReviewedProducts = (currentSlug: string) => {
  const { hydrated, slugs } = useReviewedSlugs();
  const others = useMemo(
    () => slugs.filter((slug) => slug !== currentSlug),
    [slugs, currentSlug]
  );
  const { data } = useListingBySlugs(others, {}, hydrated);

  return useMemo(
    () => orderBySlugs(data?.listing?.page.products ?? [], others),
    [data, others]
  );
};
