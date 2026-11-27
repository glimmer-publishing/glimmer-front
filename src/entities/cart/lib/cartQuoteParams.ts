import { toUrlSearchParams } from "@/shared/lib/searchParams/urlParams";
import type { CartItem } from "../model/types";

/* GET /api/cart for these items and promo code: ?item=<id>:<qty>&promo=. */
export const cartQuoteHref = (items: CartItem[], promoCode: string | null) =>
  `/api/cart?${toUrlSearchParams({
    item: items.map(({ id, quantity }) => `${id}:${quantity}`),
    promo: promoCode || undefined,
  })}`;

/**
 * The inverse of cartQuoteHref, for the route. Malformed entries stay as-is
 * for normalizeCartItems to reject.
 */
export const parseCartQuoteParams = (params: URLSearchParams) => ({
  items: params.getAll("item").map((entry) => {
    const separator = entry.lastIndexOf(":");
    return {
      id: entry.slice(0, separator),
      quantity: Number(entry.slice(separator + 1)),
    };
  }),
  promoCode: params.get("promo"),
});
