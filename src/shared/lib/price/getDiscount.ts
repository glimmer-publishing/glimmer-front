/* Anything with a catalog price and an optional sale price, in hryvnia. */
type Priced = {
  price: number;
  discountPrice?: number | null;
};

/* A product's sale state, worked out once for every place that shows it. */
export type Discount = {
  /* True when the sale price is set, positive and below the catalog price. */
  hasDiscount: boolean;
  /* The price the customer pays: the sale price when on sale. */
  currentPrice: number;
  /* The change against the catalog price, e.g. -20; 0 when not on sale. */
  percent: number;
};

/**
 * The one rule for "on sale": a sale price that is set, above zero and below
 * the catalog price. A zero, missing or not-lower sale price is ignored, so
 * the storefront, the cart, the metadata and the Merchant feed always agree.
 */
export const getDiscount = ({ price, discountPrice }: Priced): Discount => {
  const hasDiscount =
    !!discountPrice && discountPrice > 0 && discountPrice < price;

  return hasDiscount
    ? {
        hasDiscount,
        currentPrice: discountPrice,
        percent: Math.round(((discountPrice - price) / price) * 100),
      }
    : { hasDiscount, currentPrice: price, percent: 0 };
};
