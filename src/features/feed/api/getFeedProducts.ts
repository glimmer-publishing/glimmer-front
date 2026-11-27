import "server-only";
import { FICTION_CATEGORY_SLUG } from "@/entities/category/model/constants";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { FeedProduct } from "../model/types";
import { allProductsForFeedQuery } from "./queries";

/**
 * The books the feed lists. Throws on a failed read rather than returning
 * an empty list: Next caches whatever Response the route returns, while a
 * thrown error keeps serving the previous feed.
 */
export const getFeedProducts = async (): Promise<FeedProduct[]> => {
  const products: FeedProduct[] | undefined = await fetchSanityDataServer(
    allProductsForFeedQuery,
    { categorySlug: FICTION_CATEGORY_SLUG }
  );

  if (!Array.isArray(products)) {
    throw new Error("Feed products query did not return a list");
  }

  return products;
};
