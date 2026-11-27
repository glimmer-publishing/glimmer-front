import type { Product } from "@/entities/product/model/product";
import { getDiscount } from "@/shared/lib/price/getDiscount";
import { toKopecks } from "./money";
import type {
  CartItem,
  CartLineSnapshot,
  CartPromoSnapshot,
  CartQuote,
  PricedLine,
} from "../model/types";

/**
 * Snapshots of cart lines: what the cart last looked like, so it can be
 * drawn at once while the server's quote loads. Display only; every amount
 * that counts comes from the quote.
 */

/* A priced line without its quantity, as the cart keeps it between visits. */
export const lineToSnapshot = (line: PricedLine): CartLineSnapshot => {
  const { quantity, lineTotal, ...snapshot } = line;
  void quantity;
  void lineTotal;

  return snapshot;
};

/**
 * A product being added to the cart, priced as the catalog shows it: its own
 * discount, no promo. The next quote corrects anything else.
 */
export const productToSnapshot = (product: Product): CartLineSnapshot => ({
  id: product.id,
  slug: product.slug,
  title: product.title,
  author: product.author,
  sku: product.sku,
  status: product.status,
  preOrderShippingDate: product.preOrderShippingDate ?? null,
  isNationalCashback: product.isNationalCashback ?? null,
  mainImage: product.mainImage,
  categorySlug: product.categorySlug,
  categoryTitle: product.categoryTitle,
  genreSlugs: product.genres?.map(({ slug }) => slug) ?? [],
  basePrice: toKopecks(product.price),
  unitPrice: toKopecks(getDiscount(product).currentPrice),
  promoApplied: false,
});

/**
 * The cart drawn from snapshots, shaped like a quote: current quantities,
 * last known prices. undefined unless every item has a snapshot, so a
 * partial cart with a wrong total is never shown. A promo price is kept only
 * while the cart still has the code it was quoted with.
 */
export const snapshotQuote = (
  items: CartItem[],
  snapshots: Record<string, CartLineSnapshot>,
  promoSnapshot: CartPromoSnapshot | null,
  promoCode: string | null
): CartQuote | undefined => {
  if (!items.length || items.some(({ id }) => !snapshots[id])) return undefined;

  const promo =
    promoCode && promoSnapshot?.code === promoCode ? promoSnapshot : null;

  const lines = items.map(({ id, quantity }) => {
    const snapshot = snapshots[id];
    const promoApplied = !!promo && snapshot.promoApplied;
    const unitPrice =
      snapshot.promoApplied && !promoApplied
        ? snapshot.basePrice
        : snapshot.unitPrice;

    return {
      ...snapshot,
      promoApplied,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    };
  });

  return {
    lines,
    missingIds: [],
    total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    promoDiscountTotal: lines.reduce(
      (sum, line) =>
        line.promoApplied
          ? sum + (line.basePrice - line.unitPrice) * line.quantity
          : sum,
      0
    ),
    promo: promo?.promo ?? null,
    promoStatus: promo?.promoStatus ?? "none",
  };
};
