import "server-only";
import { listProducts } from "../lib/listProducts";
import { ListingParams } from "../model/listingParams";
import { ProductListingResponse } from "../model/types";
import { getProductsBySlugs } from "./getProducts";

/* The listing of the products with these slugs, for GET /api/products. */
export const getListingBySlugs = async (
  slugs: string[],
  params: ListingParams
): Promise<ProductListingResponse> => {
  const products = await getProductsBySlugs(
    [...new Set(slugs)].filter(Boolean)
  );

  return {
    listing: products.length ? listProducts(products, params) : null,
  };
};
