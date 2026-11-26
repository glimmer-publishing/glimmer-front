import "server-only";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { SearchProduct } from "../model/types";
import { searchProductsQuery } from "./queries";

/**
 * Every product as a search row, for GET /api/search-products. Throws on a
 * Sanity error or a non-list result, so the cached route keeps serving the
 * previous list instead of caching a broken one.
 */
export const getSearchProducts = async (): Promise<SearchProduct[]> => {
  const products = await fetchSanityDataServer(searchProductsQuery);

  if (!Array.isArray(products)) {
    throw new Error("Search products query did not return a list");
  }

  return products;
};
