import type { PaymentOption } from "@/constants/enums";
import type { CartItem, CartQuote } from "@/entities/cart/model/types";
import type { UtmData } from "@/store/utmStore";
import type { CheckoutValues } from "./schema";

/**
 * All createOrder accepts from the browser. No price, name, recipient or
 * message text: the server derives all of it.
 */
export interface CreateOrderInput {
  items: CartItem[];
  values: CheckoutValues;
  /* Kopecks: the total the customer was shown. */
  expectedTotal: number;
  utm?: UtmData | null;
}

/* One line of a placed order; amounts in kopecks. */
export interface OrderLine {
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
}

/**
 * A placed order as the server priced it. The confirmation page, receipt
 * and analytics read only this.
 */
export interface OrderSummary {
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
}

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
