import type { Product } from "@/entities/product/model/product";

/**
 * A favorite as kept in localStorage to draw the favorites page before its
 * listing arrives: what a card, the filters and the sorts read. Long texts
 * and galleries are left out, and reviews keep only their rating.
 */
export const toFavoriteSnapshot = (product: Product): Product => ({
  ...product,
  description: undefined,
  gallery: [],
  bookScreens: undefined,
  /* Sanity returns null for a product without reviews, despite the type. */
  reviews: (product.reviews ?? []).map(({ rating }) => ({
    author: "",
    rating,
    date: "",
  })),
});
