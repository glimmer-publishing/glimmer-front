import "server-only";
import {
  DeliveryService,
  DeliveryType,
  isOnlinePayment,
} from "@/shared/config/enums";
import { toHryvnia } from "@/entities/cart/lib/money";
import type { CartQuote, PricedLine } from "@/entities/cart/model/types";
import type { MonopayBasketItem } from "@/shared/api/monopay/client";
import { escapeHtml } from "@/shared/lib/html";
import type { UtmData } from "@/entities/utm/model/types";
import type { CheckoutValues } from "../model/schema";
import type { OrderLine, OrderSummary } from "../model/types";

/**
 * Everything createOrder sends anywhere, built from the server's quote and
 * the validated form only.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/* UTM data as plain short strings, or undefined when there is none. */
export const sanitizeUtm = (utm: unknown): UtmData | undefined => {
  if (!utm || typeof utm !== "object") return undefined;

  const entries = UTM_KEYS.map((key) => {
    const value = (utm as Record<string, unknown>)[key];
    return [key, typeof value === "string" ? value.slice(0, 200) : ""];
  });

  return entries.some(([, value]) => value)
    ? (Object.fromEntries(entries) as unknown as UtmData)
    : undefined;
};

const toOrderLine = (line: PricedLine): OrderLine => ({
  id: line.id,
  title: line.title,
  author: line.author,
  category: line.categoryTitle || line.categorySlug || "",
  mainImage: line.mainImage,
  quantity: line.quantity,
  basePrice: line.basePrice,
  unitPrice: line.unitPrice,
  lineTotal: line.lineTotal,
  preOrderShippingDate:
    line.status === "preOrder" ? line.preOrderShippingDate : null,
});

export const buildOrderSummary = (
  orderNumber: string,
  orderDate: string,
  values: CheckoutValues,
  quote: CartQuote
): OrderSummary => ({
  orderNumber,
  orderDate,
  name: values.name,
  surname: values.surname,
  email: values.email,
  phone: values.phone,
  deliveryService: values.deliveryService,
  deliveryType: values.deliveryType,
  city: values.city,
  branchNumber: values.branchNumber,
  address: values.address,
  payment: values.payment,
  lines: quote.lines.map(toOrderLine),
  total: quote.total,
});

export const buildKeyCrmOrder = (
  orderedAt: string,
  values: CheckoutValues,
  quote: CartQuote,
  utm: UtmData | undefined
) => {
  /**
   * Укрпошта addresses branches and parcel lockers by postcode, so in
   * KeyCRM the number goes into the postcode field, not the pickup point.
   */
  const isUkrposhtaPickup =
    values.deliveryService === DeliveryService.UKRPOSHTA &&
    values.deliveryType !== DeliveryType.COURIER;

  return {
    source_id: 1,
    source_uuid: "",
    orderedAt,
    promocode: quote.promo?.code ?? null,
    buyer_comment: values.message,
    buyer: {
      full_name: `${values.name} ${values.surname}`,
      phone: values.phone,
      email: values.email,
    },
    shipping: {
      delivery_service_id:
        values.deliveryService === DeliveryService.NOVA_POSHTA ? 9 : 5,
      shipping_service: values.deliveryService,
      shipping_address_city: values.city,
      shipping_secondary_line: values.address,
      ...(isUkrposhtaPickup
        ? { shipping_address_zip: values.branchNumber }
        : { shipping_receive_point: values.branchNumber }),
    },
    products: quote.lines.map((line) => ({
      price: toHryvnia(line.unitPrice),
      quantity: line.quantity,
      name: `'${line.title}' - ${line.author ?? ""}`,
      sku: line.sku,
    })),
    ...(utm && { marketing: utm }),
    ...(!isOnlinePayment(values.payment) && {
      payments: [
        {
          payment_method: values.payment,
          amount: toHryvnia(quote.total),
          status: "not_paid",
        },
      ],
    }),
  };
};

export const buildMonopayBasket = (quote: CartQuote): MonopayBasketItem[] =>
  quote.lines.map((line) => ({
    name: line.title,
    qty: line.quantity,
    sum: line.unitPrice,
    total: line.lineTotal,
    code: line.id,
    unit: "шт.",
  }));

/**
 * The operations-group message for a placed order. With invoiceFailed, it
 * leads with the alert, so the one message is enough to call the customer.
 */
export const buildTelegramOrderMessage = (
  summary: OrderSummary,
  time: string,
  values: CheckoutValues,
  quote: CartQuote,
  { invoiceFailed = false } = {}
) => {
  const e = escapeHtml;
  const products = quote.lines
    .map((line) => {
      const author = line.author ? `, ${e(line.author)}` : "";
      return `- ${e(line.title)}${author}, код товару: ${e(line.sku)} - ${line.quantity} шт.`;
    })
    .join("\n");
  const alert = invoiceFailed
    ? `⚠️ <b>Не вдалося створити рахунок MonoPay - замовлення не оплачене, зв'яжіться з клієнтом</b>\n`
    : "";

  return (
    alert +
    `<b>Замовлення #${e(summary.orderNumber)}</b>\n` +
    `<b>Дата замовлення:</b> ${summary.orderDate} ${time}\n` +
    `<b>Ім'я:</b> ${e(values.name)}\n` +
    `<b>Прізвище:</b> ${e(values.surname)}\n` +
    `<b>Телефон:</b> ${e(values.phone.replace(/[^\d+]/g, ""))}\n` +
    `<b>Email:</b> ${e(values.email)}\n` +
    `<b>Сервіс доставки:</b> ${e(values.deliveryService)}\n` +
    `<b>Тип доставки:</b> ${e(values.deliveryType)}\n` +
    `<b>Населений пункт:</b> ${e(values.city)}\n` +
    `<b>Номер відділення або поштомату:</b> ${e(values.branchNumber)}\n` +
    `<b>Адреса:</b> ${e(values.address)}\n` +
    `<b>Оплата:</b> ${e(values.payment)}\n` +
    `<b>Повідомлення:</b> ${e(values.message)}\n` +
    `<b>Промокод:</b> ${e(quote.promo?.code ?? "")}\n` +
    `<b>Розмір знижки за промокодом:</b> ${quote.promo ? `${quote.promo.discountPercent}%` : ""}\n` +
    `<b>Список товарів в замовленні:</b>\n${products}\n` +
    `<b>Сума замовлення:</b> ${toHryvnia(quote.total)} грн\n`
  );
};

/* Telegram texts for MonoPay payment callbacks; amounts in kopecks. */
export const paymentMessages = {
  succeeded: (reference: string, paid: number) =>
    `✅ Оплата через MonoPay успішна!\nСума: ${toHryvnia(paid)} грн\nЗамовлення: #${escapeHtml(reference)}`,
  mismatch: (reference: string, paid: number, expected: number) =>
    `⚠️ <b>Сума оплати MonoPay не збігається із замовленням</b>\n` +
    `Замовлення: #${escapeHtml(reference)}\nОплачено: ${toHryvnia(paid)} грн\n` +
    `Сума замовлення: ${toHryvnia(expected)} грн\nЗамовлення НЕ позначене як оплачене.`,
  unverified: (reference: string, paid: number) =>
    `⚠️ <b>Не вдалося перевірити оплату MonoPay</b>\n` +
    `Замовлення: #${escapeHtml(reference)}\nОплачено: ${toHryvnia(paid)} грн\n` +
    `KeyCRM не повернув суму замовлення. Позначте оплату вручну.`,
};
