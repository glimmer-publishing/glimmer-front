import type { ProductStatus } from "@/entities/product/model/product";
import { DeliveryService, PaymentOption } from "@/shared/config/enums";

/**
 * Which payment methods an order may use. The one source of these rules:
 * the payment options shown, the form schema and createOrder all call it.
 */

/* What the rules need to know about a cart line. */
export type PaymentRuleLine = {
  status: ProductStatus;
  isNationalCashback?: boolean | null;
};

/* Why a payment method is not allowed, as the field error says it. */
const ERRORS = {
  ukrposhtaCash: "Для Укрпошти доступна лише оплата онлайн",
  preOrderCash: "Оплата під час отримання недоступна для передзамовлень",
  nationalCashback:
    "Оплата програмою «ЄКнига», Нацкешбек, ЄПідтримка доступна лише коли всі товари в кошику підтримують цю програму",
} as const;

/**
 * The reason this payment method is not allowed, or null when it is. With
 * lines null (the cart is not known yet) only the delivery rule is checked.
 */
export const paymentError = (
  payment: PaymentOption,
  deliveryService: DeliveryService,
  lines: PaymentRuleLine[] | null
): string | null => {
  if (payment === PaymentOption.CASH_ON_DELIVERY) {
    if (deliveryService === DeliveryService.UKRPOSHTA) {
      return ERRORS.ukrposhtaCash;
    }
    if (lines?.some((line) => line.status === "preOrder")) {
      return ERRORS.preOrderCash;
    }
  }

  if (
    payment === PaymentOption.NATIONAL_CASHBACK &&
    lines &&
    !(lines.length && lines.every((line) => line.isNationalCashback === true))
  ) {
    return ERRORS.nationalCashback;
  }

  return null;
};

/**
 * The methods to offer, in display order. Нацкешбек is offered only once
 * the cart is known to qualify.
 */
export const availablePayments = (
  deliveryService: DeliveryService,
  lines: PaymentRuleLine[] | null
): PaymentOption[] =>
  Object.values(PaymentOption).filter(
    (payment) =>
      !paymentError(payment, deliveryService, lines) &&
      (payment !== PaymentOption.NATIONAL_CASHBACK || !!lines)
  );
