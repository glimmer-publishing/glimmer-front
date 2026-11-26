import "server-only";
import { sanityFetch } from "@/shared/api/sanity/client";
import { priceCart } from "../lib/pricing";
import type {
  CartItem,
  CartProduct,
  CartPromo,
  CartQuote,
  PromoStatus,
} from "../model/types";
import { cartProductsQuery, promocodeQuery } from "./queries";

interface PromocodeDocument {
  code: string;
  discountPercent: number;
  expirationDate?: string | null;
  publishers: (string | null)[];
}

interface QuoteOptions {
  /**
   * Past the Sanity API CDN. Placing an order sets it, so the amount charged
   * is never a CDN copy of an old price; the cart display does not need to.
   */
  fresh?: boolean;
}

const resolvePromo = (
  document: PromocodeDocument | null,
  hasCode: boolean
): { promo: CartPromo | null; status: PromoStatus } => {
  if (!hasCode) return { promo: null, status: "none" };
  if (!document || !(document.discountPercent > 0)) {
    return { promo: null, status: "notFound" };
  }

  const expires = document.expirationDate
    ? Date.parse(document.expirationDate)
    : NaN;
  if (!Number.isNaN(expires) && expires < Date.now()) {
    return { promo: null, status: "expired" };
  }

  return {
    promo: {
      code: document.code,
      discountPercent: Math.min(document.discountPercent, 100),
      publishers: document.publishers.filter(
        (name): name is string => typeof name === "string"
      ),
    },
    status: "applied",
  };
};

/**
 * Prices the cart from Sanity: current prices, today's discounts and the
 * promo code checked against the server clock. Items must already be
 * normalized (normalizeCartItems). Throws when Sanity fails.
 */
export const quoteCart = async (
  items: CartItem[],
  promoCode: string | null,
  { fresh = false }: QuoteOptions = {}
): Promise<CartQuote> => {
  const code = promoCode?.trim() || null;

  const [products, promoDocument] = await Promise.all([
    items.length
      ? (sanityFetch(
          cartProductsQuery,
          { ids: items.map(({ id }) => id) },
          { fresh }
        ) as Promise<CartProduct[]>)
      : Promise.resolve([]),
    code
      ? (sanityFetch(
          promocodeQuery,
          { code },
          { fresh }
        ) as Promise<PromocodeDocument | null>)
      : Promise.resolve(null),
  ]);

  const { promo, status } = resolvePromo(promoDocument, !!code);

  return priceCart(items, products ?? [], promo, status);
};
