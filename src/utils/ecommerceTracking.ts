import { CartItem } from "@/types/cartItem";
import { Product } from "@/types/product";
import { OrderData } from "@/types/orderData";

const CURRENCY = "UAH";
const GOOGLE_ADS_SEND_TO = "AW-18111056280/9ydPCO3HyKAcEJiTg7xD";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function callGtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag(...args);
    return;
  }
  console.warn(
    "[ecommerceTracking] gtag is not available, falling back to dataLayer.push:",
    args
  );
  (window as { dataLayer?: unknown[] }).dataLayer =
    (window as { dataLayer?: unknown[] }).dataLayer || [];
  (window as { dataLayer: unknown[] }).dataLayer.push(args);
}

function callFbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq(...args);
    return;
  }
  console.warn("[ecommerceTracking] fbq is not available:", args);
}

function toGa4Item(product: Product, quantity: number) {
  return {
    item_id: product.id,
    item_name: product.title,
    currency: CURRENCY,
    item_category: product.categoryTitle || product.categorySlug || "",
    price: product.discountPrice ?? product.price,
    quantity,
  };
}

// ── public ────────────────────────────────────────────────────────────────────

export function trackAddToCart(product: Product, quantity: number) {
  const item = toGa4Item(product, quantity);
  callGtag("event", "add_to_cart", {
    currency: CURRENCY,
    value: item.price * quantity,
    items: [item],
  });
  callFbq("track", "AddToCart");
}

export function trackBeginCheckout(cart: CartItem[], value: number) {
  callGtag("event", "begin_checkout", {
    currency: CURRENCY,
    value,
    items: cart.map(({ product, quantity }) => toGa4Item(product, quantity)),
  });
  callFbq("track", "InitiateCheckout");
}

/**
 * Fires GA4 purchase, Google Ads user_data + conversion.
 * Guarded by localStorage — safe to call on every page mount.
 */
export function trackPurchaseOnce(order: OrderData) {
  if (typeof window === "undefined") return;

  const storageKey = `purchase_tracked_${order.orderNumber}`;
  if (localStorage.getItem(storageKey)) return;

  callGtag("event", "purchase", {
    currency: CURRENCY,
    transaction_id: order.orderNumber,
    value: order.totalOrderSum,
    items: order.cart.map(({ product, quantity }) =>
      toGa4Item(product, quantity)
    ),
  });

  callGtag("set", "user_data", {
    email: order.email,
    phone_number: order.phone.replace(/[^\d+]/g, ""),
  });

  callGtag("event", "conversion", {
    send_to: GOOGLE_ADS_SEND_TO,
    value: order.totalOrderSum,
    currency: CURRENCY,
    transaction_id: order.orderNumber,
  });

  callFbq("track", "Purchase");

  localStorage.setItem(storageKey, "true");
}
