import "server-only";
import { getProductReference } from "@/entities/product/api/getProductReference";
import { formatReviewMessage } from "../lib/formatReviewMessage";
import { writeReviewSchema } from "../model/schema";

/**
 * The operations-group message for a product review. The browser sends only
 * the product id; the title, author and code come from Sanity, so the text
 * names a real product. null when the id is not a product; rejects with
 * yup's ValidationError when the fields (rating 1–5 included) are invalid.
 */
export const buildReviewMessage = async (
  fields: unknown
): Promise<string | null> => {
  const productId = (fields as { productId?: unknown } | null)?.productId;
  if (typeof productId !== "string" || productId.length > 100) return null;

  const [values, product] = await Promise.all([
    writeReviewSchema.validate(fields, { stripUnknown: true }),
    getProductReference(productId),
  ]);

  return product && formatReviewMessage(values, product);
};
