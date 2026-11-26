/**
 * Payment methods, as the customer sees them and as they reach KeyCRM. The
 * value is the label, so it is never compared as a raw string anywhere else.
 */
export enum PaymentOption {
  CARD = "Оплата картою онлайн Visa, Mastercard",
  NATIONAL_CASHBACK = "Оплата програмою «ЄКнига» (Дія.Картка), Нацкешбек, ЄПідтримка",
  CASH_ON_DELIVERY = "Оплата під час отримання товару",
}

export enum DeliveryService {
  NOVA_POSHTA = "Нова пошта",
  UKRPOSHTA = "Укрпошта",
}

export enum DeliveryType {
  BRANCH = "Відділення",
  COURIER = "Доставка кур’єром",
  PARCEL_LOCKER = "Поштомат",
}

/* Paid through MonoPay before the order ships. */
export const isOnlinePayment = (payment: PaymentOption) =>
  payment === PaymentOption.CARD || payment === PaymentOption.NATIONAL_CASHBACK;
