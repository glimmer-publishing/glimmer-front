import type { ProductStatus } from "@/entities/product/model/product";

/**
 * What the browser keeps: which products, how many. Everything else (title,
 * price, discount) comes from the server, so nothing a customer edits in
 * localStorage can change what they are charged.
 */
export type CartItem = {
  id: string;
  quantity: number;
};

/* A cart product as Sanity returns it for pricing and display. */
export type CartProduct = {
  id: string;
  slug: string;
  title: string;
  author?: string | null;
  sku: string;
  /* Hryvnia, before any discount. */
  price: number;
  /* Hryvnia; null outside the scheduled discount window. */
  discountPrice?: number | null;
  status: ProductStatus;
  preOrderShippingDate?: string | null;
  isNationalCashback?: boolean | null;
  mainImage: string;
  categorySlug: string;
  categoryTitle?: string | null;
  /* The "видавництво" feature value, matched against promo publishers. */
  publisher?: string | null;
  genreSlugs: string[];
};

/* A promo code that exists and has not expired. */
export type CartPromo = {
  code: string;
  discountPercent: number;
  /* Publisher names the promo applies to. */
  publishers: string[];
};

/* What the server made of the cart's promo code. */
export type PromoStatus = "none" | "applied" | "notFound" | "expired";

/**
 * One cart line priced on the server. Every amount is in kopecks, so sums
 * are exact integers.
 */
export type PricedLine = Omit<
  CartProduct,
  "price" | "discountPrice" | "publisher"
> & {
  quantity: number;
  /* Per unit, before the product discount and the promo. */
  basePrice: number;
  /* Per unit, after the product discount or the promo. */
  unitPrice: number;
  /* unitPrice × quantity. */
  lineTotal: number;
  promoApplied: boolean;
};

/**
 * The cart as the server prices it. missingIds are cart products that no
 * longer exist, so they cannot be ordered.
 */
export type CartQuote = {
  lines: PricedLine[];
  missingIds: string[];
  /* Kopecks: the amount an order for this cart is charged. */
  total: number;
  /* Kopecks saved by the promo code. */
  promoDiscountTotal: number;
  promo: { code: string; discountPercent: number } | null;
  promoStatus: PromoStatus;
};

/**
 * A cart line as last seen, kept in localStorage only to draw the cart
 * before the server's quote arrives. Never sent anywhere and never trusted
 * for an amount: the quote replaces it, and orders are priced on the server.
 */
export type CartLineSnapshot = Omit<PricedLine, "quantity" | "lineTotal">;

/* What the last quote made of the promo code it was asked about. */
export type CartPromoSnapshot = {
  /* The code the quote was requested with. */
  code: string;
  promo: CartQuote["promo"];
  promoStatus: PromoStatus;
};
