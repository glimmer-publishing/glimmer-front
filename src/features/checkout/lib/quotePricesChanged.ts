import type { CartQuote } from "@/entities/cart/model/types";

/**
 * Whether the fresh quote prices the shown cart differently: a book's base
 * or unit price or its promo changed, or the server no longer sells a book.
 * Quantities and lines the customer removed meanwhile are not compared.
 */
export const quotePricesChanged = (shown: CartQuote, fresh: CartQuote) => {
  if (fresh.missingIds.length) return true;

  const freshById = new Map(fresh.lines.map((line) => [line.id, line]));

  return shown.lines.some((line) => {
    const current = freshById.get(line.id);

    return (
      !!current &&
      (current.basePrice !== line.basePrice ||
        current.unitPrice !== line.unitPrice ||
        current.promoApplied !== line.promoApplied)
    );
  });
};
