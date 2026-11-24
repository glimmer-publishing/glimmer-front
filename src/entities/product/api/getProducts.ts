import "server-only";
import {
  allDiscountedProductsQuery,
  allProductsQuery,
  productsByAuthorQuery,
  productsBySeriesQuery,
} from "./queries";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { CatalogBanner } from "@/types/promoBanner";
import { SERIES_FEATURE } from "@/utils/getSeriesInfo";
import { Product } from "@/types/product";
import { ProductSelection, ProductSelectionData } from "../model/types";

/**
 * Every reader throws on a Sanity error, so an outage is an error page, not
 * a false 404 or an empty listing.
 */

const SELECTION_QUERIES: Record<ProductSelection, string> = {
  all: allProductsQuery,
  discounted: allDiscountedProductsQuery,
};

/**
 * A product selection that is not a Sanity category, with the catalog
 * banner its query also returns: the whole catalog, or what is discounted
 * today.
 */
export const getProductSelection = async (
  selection: ProductSelection
): Promise<ProductSelectionData> => {
  const data: {
    allProducts?: Product[];
    catalogBanner?: CatalogBanner | null;
  } | null = await fetchSanityDataServer(SELECTION_QUERIES[selection]);

  return {
    products: data?.allProducts ?? [],
    banner: data?.catalogBanner ?? undefined,
  };
};

/**
 * The whole catalog: the same cached read as /catalog/all, so slug listings
 * cost no Sanity read or cache entry of their own.
 */
export const getAllProducts = async (): Promise<Product[]> =>
  (await getProductSelection("all")).products;

export const getProductsByAuthor = async (
  authorName: string
): Promise<Product[]> =>
  (await fetchSanityDataServer(productsByAuthorQuery, { authorName })) ?? [];

export const getProductsBySeries = async (
  seriesName: string
): Promise<Product[]> =>
  (await fetchSanityDataServer(productsBySeriesQuery, {
    seriesName,
    seriesFeature: SERIES_FEATURE,
  })) ?? [];

/**
 * The products among the whole catalog with these slugs, in catalog order.
 * Slugs that are no longer products are skipped.
 */
export const getProductsBySlugs = async (
  slugs: string[]
): Promise<Product[]> => {
  if (!slugs.length) return [];

  const wanted = new Set(slugs);
  const products = await getAllProducts();

  return products.filter((product) => wanted.has(product.slug));
};
