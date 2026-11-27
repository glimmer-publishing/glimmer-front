import type { PaymentOption } from "@/shared/config/enums";
import type { CartItem, CartQuote } from "@/entities/cart/model/types";
import type { UtmData } from "@/entities/utm/model/types";
import type { CheckoutValues } from "./schema";

/**
 * All createOrder accepts from the browser. No price, name, recipient or
 * message text: the server derives all of it.
 */
export type CreateOrderInput = {
  items: CartItem[];
  values: CheckoutValues;
  /* Kopecks: the total the customer was shown. */
  expectedTotal: number;
  utm?: UtmData | null;
};

/* One line of a placed order; amounts in kopecks. */
export type OrderLine = {
  id: string;
  title: string;
  author?: string | null;
  category: string;
  mainImage: string;
  quantity: number;
  basePrice: number;
  unitPrice: number;
  lineTotal: number;
  preOrderShippingDate?: string | null;
};

/**
 * A placed order as the server priced it. The confirmation page, receipt
 * and analytics read only this.
 */
export type OrderSummary = {
  orderNumber: string;
  orderDate: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  deliveryService: string;
  deliveryType: string;
  city: string;
  branchNumber: string;
  address: string;
  payment: PaymentOption;
  lines: OrderLine[];
  /* Kopecks. */
  total: number;
};

/* What createOrder answers; the form handles each status (useSubmitOrder). */
export type CreateOrderResult =
  /* Placed. paymentUrl is the MonoPay page for online payment. */
  | { status: "ok"; order: OrderSummary; paymentUrl?: string }
  /* Field errors, in the form's own messages. Nothing was created. */
  | {
      status: "invalid";
      fieldErrors: Partial<Record<keyof CheckoutValues, string>>;
    }
  /**
   * The server's prices, promo or availability differ from what the customer
   * saw. Nothing was created; quote is the fresh cart.
   */
  | { status: "priceChanged"; quote: CartQuote }
  /* The order exists in KeyCRM but MonoPay refused the invoice. */
  | { status: "paymentFailed"; orderNumber: string }
  | { status: "error" };

/* Why an order was not placed, or not paid, as the checkout page tells it. */
export type CheckoutNotice =
  | { kind: "error" }
  /* removedTitles: books no longer sold, dropped from the cart. */
  | { kind: "priceChanged"; removedTitles: string[] }
  | { kind: "paymentFailed"; orderNumber: string };

/* A paid invoice as the webhook reports it. */
export type MonopayPayment = {
  /* The KeyCRM order id createOrder passed as the invoice reference. */
  reference: string;
  /* MonoPay's invoice id; marks the KeyCRM payment it produced. */
  invoiceId: string;
  /* Kopecks actually paid. */
  finalAmount: number;
};
