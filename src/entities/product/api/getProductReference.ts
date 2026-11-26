import "server-only";
import { sanityFetch } from "@/shared/api/sanity/client";
import { productReferenceQuery } from "./queries";

/* How a product is named in notifications. */
export type ProductReference = {
  title: string;
  author?: string | null;
  sku: string;
};

/* How a product is named in notifications, or null when it does not exist. */
export const getProductReference = async (
  id: string
): Promise<ProductReference | null> =>
  (await sanityFetch(productReferenceQuery, { id })) ?? null;
