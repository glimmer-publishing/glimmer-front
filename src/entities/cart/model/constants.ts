/* Most copies of one product per order. */
export const MAX_QUANTITY = 99;

/* Most distinct products per order. */
export const MAX_LINES = 50;

/* Longest promo code accepted. */
export const MAX_PROMO_LENGTH = 40;

/* Kopecks: an order from this total ships free. */
export const FREE_DELIVERY_FROM = 1500_00;

/**
 * DOM id of the header cart button, rendered once. The add-to-cart flight
 * looks it up to know where to land.
 */
export const CART_BUTTON_ID = "cart-button";
