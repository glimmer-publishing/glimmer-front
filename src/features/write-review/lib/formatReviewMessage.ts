import type { ProductReference } from "@/entities/product/model/types";
import { escapeHtml as e } from "@/shared/lib/text/html";
import type { WriteReviewFormValues } from "../model/schema";

/**
 * The operations-group message for a product review, from fields the review
 * schema has accepted and the product they are about. Every value is escaped
 * for Telegram's HTML mode.
 */
export const formatReviewMessage = (
  { name, email, rating, message }: WriteReviewFormValues,
  product: ProductReference
): string =>
  `<b>Відгук на товар "${e(product.title)}" ${e(product.author ?? "")}, код товару: ${e(product.sku)}</b>\n` +
  `<b>Ім'я:</b> ${e(name.trim())}\n` +
  `<b>Email:</b> ${e(email.trim())}\n` +
  `<b>Рейтинг:</b> ${rating}\n` +
  `<b>Текст відгуку:</b> ${e(message.trim())}\n`;
