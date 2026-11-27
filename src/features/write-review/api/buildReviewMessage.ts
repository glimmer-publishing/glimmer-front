import "server-only";
import { getProductReference } from "@/entities/product/api/getProductReference";
import { escapeHtml as e } from "@/shared/lib/text/html";
import { writeReviewValidation } from "../model/schema";

/**
 * The operations-group message for a product review. The browser sends only
 * the product id; the title, author and code come from Sanity, so the text
 * names a real product. null when the id is not a product or the rating is
 * not 1–5; rejects with yup's ValidationError when the fields are invalid.
 */
export const buildReviewMessage = async (
  fields: unknown
): Promise<string | null> => {
  const productId = (fields as { productId?: unknown } | null)?.productId;
  if (typeof productId !== "string" || productId.length > 100) return null;

  const [{ name, email, rating, message }, product] = await Promise.all([
    writeReviewValidation().validate(fields, { stripUnknown: true }),
    getProductReference(productId),
  ]);
  if (!product || !Number.isInteger(rating) || rating > 5) return null;

  return (
    `<b>Відгук на товар "${e(product.title)}" ${e(product.author ?? "")}, код товару: ${e(product.sku)}</b>\n` +
    `<b>Ім'я:</b> ${e(name.trim())}\n` +
    `<b>Email:</b> ${e(email.trim())}\n` +
    `<b>Рейтинг:</b> ${rating}\n` +
    `<b>Текст відгуку:</b> ${e(message.trim())}\n`
  );
};
