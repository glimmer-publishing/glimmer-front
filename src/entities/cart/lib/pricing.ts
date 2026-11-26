import { MAX_LINES, MAX_QUANTITY } from "../model/constants";
import { toKopecks } from "./money";
import type {
  CartItem,
  CartProduct,
  CartPromo,
  CartQuote,
  PricedLine,
  PromoStatus,
} from "../model/types";

/**
 * Pricing rules, as pure functions over integer kopecks. The server prices
 * every quote and every order with them; nothing in the browser computes an
 * amount it sends anywhere.
 */

/* A product on sale never takes the promo on top of its own discount. */
const isPromoEligible = (product: CartProduct, promo: CartPromo | null) => {
  if (!promo || product.discountPrice != null) return false;

  const publisher = product.publisher?.trim().toLowerCase();

  return (
    !!publisher &&
    promo.publishers.some((name) => name.trim().toLowerCase() === publisher)
  );
};

/**
 * One cart line priced: the product discount or the promo, whichever applies,
 * in kopecks.
 */
export const priceLine = (
  product: CartProduct,
  quantity: number,
  promo: CartPromo | null
): PricedLine => {
  const { price, discountPrice, publisher: _publisher, ...display } = product;
  void _publisher;

  const basePrice = toKopecks(price);
  const promoApplied = isPromoEligible(product, promo);
  const unitPrice =
    discountPrice != null
      ? toKopecks(discountPrice)
      : promoApplied
        ? Math.round((basePrice * (100 - promo!.discountPercent)) / 100)
        : basePrice;

  return {
    ...display,
    quantity,
    basePrice,
    unitPrice,
    lineTotal: unitPrice * quantity,
    promoApplied,
  };
};

/**
 * Prices the cart in its own order. Items whose product is missing are
 * listed in missingIds and left out of the total.
 */
export const priceCart = (
  items: CartItem[],
  products: CartProduct[],
  promo: CartPromo | null,
  promoStatus: PromoStatus
): CartQuote => {
  const byId = new Map(products.map((product) => [product.id, product]));
  const lines: PricedLine[] = [];
  const missingIds: string[] = [];

  items.forEach(({ id, quantity }) => {
    const product = byId.get(id);
    if (product) lines.push(priceLine(product, quantity, promo));
    else missingIds.push(id);
  });

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const promoDiscountTotal = lines.reduce(
    (sum, line) =>
      line.promoApplied
        ? sum + (line.basePrice - line.unitPrice) * line.quantity
        : sum,
    0
  );

  return {
    lines,
    missingIds,
    total,
    promoDiscountTotal,
    promo: promo && {
      code: promo.code,
      discountPercent: promo.discountPercent,
    },
    promoStatus,
  };
};

/* A whole quantity from 1 to MAX_QUANTITY. */
const isValidQuantity = (quantity: unknown): quantity is number =>
  Number.isInteger(quantity) &&
  (quantity as number) >= 1 &&
  (quantity as number) <= MAX_QUANTITY;

/**
 * Cart items as untrusted input: duplicates merged, at most MAX_LINES.
 * Returns null when any id or quantity is invalid, including a merged
 * quantity above MAX_QUANTITY.
 */
export const normalizeCartItems = (items: unknown): CartItem[] | null => {
  if (!Array.isArray(items) || !items.length) return null;

  const merged = new Map<string, number>();

  for (const item of items) {
    const { id, quantity } = (item ?? {}) as Partial<CartItem>;
    if (typeof id !== "string" || !id || id.length > 100) return null;
    if (!isValidQuantity(quantity)) return null;
    merged.set(id, (merged.get(id) ?? 0) + quantity);
  }

  if (merged.size > MAX_LINES) return null;

  const normalized = [...merged].map(([id, quantity]) => ({ id, quantity }));

  return normalized.every(({ quantity }) => isValidQuantity(quantity))
    ? normalized
    : null;
};
