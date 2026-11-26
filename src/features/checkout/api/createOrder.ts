"use server";
import "server-only";
import { ValidationError } from "yup";
import { isOnlinePayment, PaymentOption } from "@/constants/enums";
import { quoteCart } from "@/entities/cart/api/quoteCart";
import { normalizeCartItems } from "@/entities/cart/lib/pricing";
import type { CartQuote } from "@/entities/cart/model/types";
import { createKeyCrmOrder } from "@/shared/api/keycrm/client";
import { createMonopayInvoice } from "@/shared/api/monopay/client";
import { notifyTelegram } from "@/shared/api/telegram/client";
import { getKyivDateTime } from "@/utils/getKyivDate";
import { paymentError } from "../lib/paymentRules";
import { checkoutSchema, type CheckoutValues } from "../model/schema";
import { PROMO_ERRORS } from "../model/constants";
import type { CreateOrderInput, CreateOrderResult } from "../model/types";
import {
  buildKeyCrmOrder,
  buildMonopayBasket,
  buildOrderSummary,
  buildTelegramOrderMessage,
  sanitizeUtm,
} from "./orderDocuments";
import { sendConfirmationEmail } from "./sendConfirmationEmail";

type FieldErrors = Extract<
  CreateOrderResult,
  { status: "invalid" }
>["fieldErrors"];

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
 * Places an order. The browser sends only the cart's ids and quantities, the
 * validated form fields and the total it showed; the server validates,
 * re-prices from Sanity, checks the promo code and payment rules, and only
 * then creates the KeyCRM order and, for online payment, the MonoPay invoice
 * for the amount it computed itself. Telegram and the customer's email go
 * out only once the order can be paid.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const items = normalizeCartItems(input?.items);
  if (!items || !Number.isInteger(input?.expectedTotal)) {
    return { status: "error" };
  }

  const validation = await validateValues(input.values);
  if ("fieldErrors" in validation) {
    return { status: "invalid", fieldErrors: validation.fieldErrors };
  }
  const { values } = validation;

  let quote: CartQuote;
  try {
    quote = await quoteCart(items, values.promocode || null, { fresh: true });
  } catch (error) {
    console.error("Order pricing failed:", error);
    return { status: "error" };
  }

  if (quote.promoStatus === "notFound" || quote.promoStatus === "expired") {
    return {
      status: "invalid",
      fieldErrors: { promocode: PROMO_ERRORS[quote.promoStatus] },
    };
  }

  if (
    !quote.lines.length ||
    quote.missingIds.length ||
    quote.total !== input.expectedTotal
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

  const { date, time } = getKyivDateTime();

  let orderNumber: string;
  try {
    orderNumber = String(
      await createKeyCrmOrder(
        buildKeyCrmOrder(
          `${date} ${time}`,
          values,
          quote,
          sanitizeUtm(input.utm)
        )
      )
    );
  } catch (error) {
    console.error("KeyCRM order failed:", error);
    return { status: "error" };
  }

  const order = buildOrderSummary(orderNumber, date, values, quote);

  /**
   * The invoice comes before any notification: if it fails, the customer
   * gets no confirmation for an order they could not pay, and operations get
   * one message that says so.
   */
  let paymentUrl: string | undefined;
  if (isOnlinePayment(values.payment)) {
    try {
      paymentUrl = await createMonopayInvoice({
        account:
          values.payment === PaymentOption.NATIONAL_CASHBACK
            ? "nationalCashback"
            : "main",
        amount: quote.total,
        reference: orderNumber,
        basket: buildMonopayBasket(quote),
      });
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

  await Promise.all([
    notifyTelegram(buildTelegramOrderMessage(order, time, values, quote)),
    sendConfirmationEmail(order),
  ]);

  return { status: "ok", order, paymentUrl };
}
