import type { SearchProduct } from "../model/types";

/**
 * The products whose title or author contains the query, ignoring case and
 * surrounding spaces. An empty query matches nothing, so the list stays
 * closed until the customer types.
 */
export const filterSearchProducts = (
  products: SearchProduct[],
  query: string
): SearchProduct[] => {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return products.filter(
    (product) =>
      product.title?.toLowerCase().includes(term) ||
      product.author?.toLowerCase().includes(term)
  );
};
