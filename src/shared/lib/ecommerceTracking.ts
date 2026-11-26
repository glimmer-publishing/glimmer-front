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

/* One product as analytics sees it; price in hryvnia. */
export interface TrackedItem {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
}

/* A placed order as the server returned it; value in hryvnia. */
export interface TrackedOrder {
  orderNumber: string;
  value: number;
  items: TrackedItem[];
  email: string;
  phone: string;
}

const toGa4Item = ({ id, title, category, price, quantity }: TrackedItem) => ({
  item_id: id,
  item_name: title,
  currency: CURRENCY,
  item_category: category,
  price,
  quantity,
});

// ── public ────────────────────────────────────────────────────────────────────

/**
 * GA4 add_to_cart and Meta AddToCart. Callers map their domain object to a
 * TrackedItem (entities/product/lib/toTrackedItem), so analytics knows no
 * product shape.
 */
export function trackAddToCart(tracked: TrackedItem) {
  const item = toGa4Item(tracked);
  const { quantity } = tracked;
  callGtag("event", "add_to_cart", {
    currency: CURRENCY,
    value: item.price * quantity,
    items: [item],
  });
  callFbq("track", "AddToCart");
}

export function trackBeginCheckout(items: TrackedItem[], value: number) {
  callGtag("event", "begin_checkout", {
    currency: CURRENCY,
    value,
    items: items.map(toGa4Item),
  });
  callFbq("track", "InitiateCheckout");
}

/**
 * Fires GA4 purchase, Google Ads user_data + conversion.
 * Guarded by localStorage — safe to call on every page mount.
 */
export function trackPurchaseOnce(order: TrackedOrder) {
  if (typeof window === "undefined") return;

  const storageKey = `purchase_tracked_${order.orderNumber}`;
  if (localStorage.getItem(storageKey)) return;

  callGtag("event", "purchase", {
    currency: CURRENCY,
    transaction_id: order.orderNumber,
    value: order.value,
    items: order.items.map(toGa4Item),
  });

  callGtag("set", "user_data", {
    email: order.email,
    phone_number: order.phone.replace(/[^\d+]/g, ""),
  });

  callGtag("event", "conversion", {
    send_to: GOOGLE_ADS_SEND_TO,
    value: order.value,
    currency: CURRENCY,
    transaction_id: order.orderNumber,
  });

  callFbq("track", "Purchase");

  localStorage.setItem(storageKey, "true");
}
