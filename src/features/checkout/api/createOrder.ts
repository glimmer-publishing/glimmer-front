"use server";
import { ValidationError } from "yup";
import { isOnlinePayment, PaymentOption } from "@/shared/config/enums";
import { quoteCart } from "@/entities/cart/api/quoteCart";
import { normalizeCartItems } from "@/entities/cart/lib/pricing";
import type { CartQuote } from "@/entities/cart/model/types";
import { createKeyCrmOrder } from "@/shared/api/keycrm/client";
import { createMonopayInvoice } from "@/shared/api/monopay/client";
import { notifyTelegram } from "@/shared/api/telegram/client";
import { getKyivDateTime } from "@/shared/lib/date/getKyivDate";
import { paymentError } from "../lib/paymentRules";
import { checkoutSchema, type CheckoutValues } from "../model/schema";
import { PROMO_ERRORS } from "../model/constants";
import type {
  CreateOrderInput,
  CreateOrderResult,
  OrderSummary,
} from "../model/types";
import {
  buildKeyCrmOrder,
  buildMonopayBasket,
  buildOrderSummary,
  buildTelegramOrderMessage,
  sanitizeUtm,
} from "./orderDocuments";
import { sendConfirmationEmail } from "./sendConfirmationEmail";

/* The field errors of an "invalid" result. */
type FieldErrors = Extract<
  CreateOrderResult,
  { status: "invalid" }
>["fieldErrors"];

/**
 * The form values through the same schema the browser uses: the cleaned
 * values, or the first error of each field in the form's own messages.
 */
const validateValues = async (
  values: unknown
): Promise<{ values: CheckoutValues } | { fieldErrors: FieldErrors }> => {
  try {
    return {
      values: await checkoutSchema.validate(values, {
        abortEarly: false,
        stripUnknown: true,
      }),
    };
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;

    const fieldErrors: FieldErrors = {};
    error.inner.forEach(({ path, message }) => {
      const field = path as keyof CheckoutValues | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = message;
    });
    return { fieldErrors };
  }
};

/**
 * Why this quote cannot be ordered as it is, or null when it can: a promo
 * code that does not exist or has expired, a cart that differs from the one
 * the customer saw (a price, discount or product changed or disappeared),
 * or a payment method the cart or delivery does not allow.
 */
const quoteProblem = (
  quote: CartQuote,
  values: CheckoutValues,
  expectedTotal: number
): CreateOrderResult | null => {
  if (quote.promoStatus === "notFound" || quote.promoStatus === "expired") {
    return {
      status: "invalid",
      fieldErrors: { promocode: PROMO_ERRORS[quote.promoStatus] },
    };
  }

  if (
    !quote.lines.length ||
    quote.missingIds.length ||
    quote.total !== expectedTotal
  ) {
    return { status: "priceChanged", quote };
  }

  const ruleError = paymentError(
    values.payment,
    values.deliveryService,
    quote.lines
  );
  if (ruleError) {
    return { status: "invalid", fieldErrors: { payment: ruleError } };
  }

  return null;
};

/**
 * Creates the MonoPay invoice for an online payment and returns its page
 * URL. MonoPay has two merchant accounts: ЄКнига / Нацкешбек / ЄПідтримка
 * goes to its own, everything else to the main one. Throws when MonoPay
 * refuses.
 */
const createInvoice = (
  orderNumber: string,
  values: CheckoutValues,
  quote: CartQuote
) =>
  createMonopayInvoice({
    account:
      values.payment === PaymentOption.NATIONAL_CASHBACK
        ? "nationalCashback"
        : "main",
    amount: quote.total,
    reference: orderNumber,
    basket: buildMonopayBasket(quote),
  });

/**
 * Places an order. The browser sends only the cart's ids and quantities, the
 * form fields and the total it showed; everything else is derived here, and
 * nothing is created until every check has passed.
 *
 * Steps, each returning early with the matching result:
 * 1. Read the input: cart items and the expected total must be well formed.
 * 2. Validate the form with the browser's schema.
 * 3. Re-price the cart from Sanity, past the API CDN.
 * 4. Check the quote: promo code, unchanged total, payment rules.
 * 5. Create the KeyCRM order; its id is the order number.
 * 6. For online payment, create the MonoPay invoice.
 * 7. Notify operations in Telegram and email the customer.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  /* 1. Input. A malformed cart or total is not something a form can fix. */
  const items = normalizeCartItems(input?.items);
  if (!items || !Number.isInteger(input?.expectedTotal)) {
    return { status: "error" };
  }

  /* 2. Form fields, with the browser's own messages on failure. */
  const validation = await validateValues(input.values);
  if ("fieldErrors" in validation) {
    return { status: "invalid", fieldErrors: validation.fieldErrors };
  }
  const { values } = validation;

  /* 3. Pricing. `fresh`: the amount charged must come from the live API. */
  let quote: CartQuote;
  try {
    quote = await quoteCart(items, values.promocode || null, { fresh: true });
  } catch (error) {
    console.error("Order pricing failed:", error);
    return { status: "error" };
  }

  /* 4. The quote must match what the customer saw and agreed to. */
  const problem = quoteProblem(quote, values, input.expectedTotal);
  if (problem) return problem;

  /* 5. KeyCRM order. From here on the order exists. */
  const { date, time } = getKyivDateTime();
  let orderNumber: string;
  try {
    const crmOrder = buildKeyCrmOrder(
      `${date} ${time}`,
      values,
      quote,
      sanitizeUtm(input.utm)
    );
    orderNumber = String(await createKeyCrmOrder(crmOrder));
  } catch (error) {
    console.error("KeyCRM order failed:", error);
    return { status: "error" };
  }

  const order: OrderSummary = buildOrderSummary(
    orderNumber,
    date,
    values,
    quote
  );

  /**
   * 6. Invoice, before any notification: if it fails, the customer gets no
   * confirmation for an order they could not pay, and operations get one
   * message that says so.
   */
  let paymentUrl: string | undefined;
  if (isOnlinePayment(values.payment)) {
    try {
      paymentUrl = await createInvoice(orderNumber, values, quote);
    } catch (error) {
      console.error(`MonoPay invoice for order ${orderNumber} failed:`, error);
      await notifyTelegram(
        buildTelegramOrderMessage(order, time, values, quote, {
          invoiceFailed: true,
        })
      );
      return { status: "paymentFailed", orderNumber };
    }
  }

  /* 7. Notifications. Neither can fail the order: both only log. */
  await Promise.all([
    notifyTelegram(buildTelegramOrderMessage(order, time, values, quote)),
    sendConfirmationEmail(order),
  ]);

  return { status: "ok", order, paymentUrl };
}
