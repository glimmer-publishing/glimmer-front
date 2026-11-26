import "server-only";
import { sanityFetch } from "@/shared/api/sanity/client";

export interface ProductReference {
  title: string;
  author?: string | null;
  sku: string;
}

const productReferenceQuery = `*[_type == "product" && _id == $id][0]{
  title,
  author,
  sku
}`;

/* How a product is named in notifications, or null when it does not exist. */
export const getProductReference = async (
  id: string
): Promise<ProductReference | null> =>
  (await sanityFetch(productReferenceQuery, { id })) ?? null;
