"use server";
import "server-only";
import { render } from "@react-email/render";
import { ValidationError } from "yup";
import { isOnlinePayment, PaymentOption } from "@/constants/enums";
import { quoteCart } from "@/entities/cart/api/quoteCart";
import { normalizeCartItems } from "@/entities/cart/lib/pricing";
import type { CartQuote } from "@/entities/cart/model/types";
import { sendEmail } from "@/shared/api/email/client";
import { createKeyCrmOrder } from "@/shared/api/keycrm/client";
import { createMonopayInvoice } from "@/shared/api/monopay/client";
import { notifyTelegram } from "@/shared/api/telegram/client";
import { escapeHtml } from "@/shared/lib/html";
import { getKyivDateTime } from "@/utils/getKyivDate";
import { checkoutSchema, type CheckoutValues } from "../model/schema";
import type {
  CreateOrderInput,
  CreateOrderResult,
  OrderSummary,
} from "../model/types";
import { OrderConfirmationEmail } from "../ui/OrderConfirmationEmail";
import {
  buildKeyCrmOrder,
  buildMonopayBasket,
  buildOrderSummary,
  buildTelegramOrderMessage,
  sanitizeUtm,
} from "./orderDocuments";

type FieldErrors = Extract<
  CreateOrderResult,
  { status: "invalid" }
>["fieldErrors"];

const PROMO_ERRORS = {
  notFound: "Промокод не знайдений",
  expired: "Термін дії промокоду вичерпано",
} as const;

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

/* The payment rules that depend on the cart, checked on fresh data. */
const paymentError = (payment: PaymentOption, quote: CartQuote) => {
  if (
    payment === PaymentOption.CASH_ON_DELIVERY &&
    quote.lines.some((line) => line.status === "preOrder")
  ) {
    return "Оплата під час отримання недоступна для передзамовлень";
  }

  if (
    payment === PaymentOption.NATIONAL_CASHBACK &&
    !quote.lines.every((line) => line.isNationalCashback === true)
  ) {
    return "Оплата програмою «ЄКнига», Нацкешбек, ЄПідтримка доступна лише коли всі товари в кошику підтримують цю програму";
  }

  return null;
};

const sendConfirmationEmail = async (order: OrderSummary) => {
  try {
    await sendEmail({
      to: order.email,
      subject: `Glimmer: Підтвердження замовлення №${order.orderNumber}`,
      html: await render(OrderConfirmationEmail({ order })),
    });
  } catch (error) {
    console.error(
      `Confirmation email for order ${order.orderNumber} failed:`,
      error
    );
  }
};

/**
 * Places an order. The browser sends only the cart's ids and quantities, the
 * validated form fields and the total it showed; the server validates,
 * re-prices from Sanity, checks the promo code and payment rules, and only
 * then creates the KeyCRM order, notifies Telegram, emails the customer and
 * creates the MonoPay invoice for the amount it computed itself.
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

  const ruleError = paymentError(values.payment, quote);
  if (ruleError) {
    return { status: "invalid", fieldErrors: { payment: ruleError } };
  }

  const { date, time } = getKyivDateTime();

  let orderNumber: string;
  try {
    orderNumber = String(
      await createKeyCrmOrder(
        buildKeyCrmOrder(
          "",
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

  await Promise.all([
    notifyTelegram(buildTelegramOrderMessage(order, time, values, quote)),
    sendConfirmationEmail(order),
  ]);

  if (!isOnlinePayment(values.payment)) return { status: "ok", order };

  try {
    const paymentUrl = await createMonopayInvoice({
      account:
        values.payment === PaymentOption.NATIONAL_CASHBACK
          ? "nationalCashback"
          : "main",
      amount: quote.total,
      reference: orderNumber,
      basket: buildMonopayBasket(quote),
    });

    return { status: "ok", order, paymentUrl };
  } catch (error) {
    console.error(`MonoPay invoice for order ${orderNumber} failed:`, error);
    await notifyTelegram(
      `⚠️ <b>Не вдалося створити рахунок MonoPay</b>\nЗамовлення: #${escapeHtml(orderNumber)}\nСума: ${quote.total / 100} грн\nЗамовлення створене, але не оплачене.`
    );
    return { status: "paymentFailed", orderNumber };
  }
}
