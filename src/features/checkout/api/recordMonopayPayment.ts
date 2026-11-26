import "server-only";
import { toHryvnia, toKopecks } from "@/entities/cart/lib/money";
import { isProduction } from "@/shared/config/env";
import { addKeyCrmPayment, getKeyCrmOrder } from "@/shared/api/keycrm/client";
import { notifyTelegram } from "@/shared/api/telegram/client";
import { getKyivDateTime } from "@/shared/lib/date/getKyivDate";
import { paymentMessages } from "./orderDocuments";

/* KeyCRM's id of the MonoPay payment method. */
const KEYCRM_MONOPAY_METHOD_ID = 6;

/* A paid invoice as the webhook reports it. */
type MonopayPayment = {
  /* The KeyCRM order id createOrder passed as the invoice reference. */
  reference: string;
  /* MonoPay's invoice id; marks the KeyCRM payment it produced. */
  invoiceId: string;
  /* Kopecks actually paid. */
  finalAmount: number;
};

/**
 * Callbacks for the same order are handled one after another on this
 * instance, so a retry that arrives while the first is still running sees
 * its payment. Two instances can still race; the invoice id in the payment
 * description lets the later one notice on its re-read.
 */
const inFlight = new Map<string, Promise<void>>();

/* Whether KeyCRM already holds a payment for this invoice. */
const isRecorded = async (reference: string, invoiceId: string) => {
  const order = await getKeyCrmOrder(reference);
  if (!order) throw new Error(`KeyCRM order ${reference} not found`);

  const recorded = !!order.payments?.some(
    (payment) =>
      payment.status === "paid" ||
      (!!invoiceId && !!payment.description?.includes(invoiceId))
  );

  return { order, recorded };
};

/* Adds the payment to the KeyCRM order and notifies operations. */
const record = async ({
  reference,
  invoiceId,
  finalAmount,
}: MonopayPayment) => {
  if (!isProduction) {
    console.log(
      `KeyCRM payment update NOT sent for order ${reference}, amount ${toHryvnia(finalAmount)}`
    );
    await notifyTelegram(paymentMessages.succeeded(reference, finalAmount));
    return;
  }

  const { order, recorded } = await isRecorded(reference, invoiceId);
  if (recorded) {
    console.log(`Order ${reference} is already paid; webhook ignored`);
    return;
  }

  if (typeof order.grand_total !== "number") {
    await notifyTelegram(paymentMessages.unverified(reference, finalAmount));
    return;
  }

  const expected = toKopecks(order.grand_total);
  if (expected !== finalAmount) {
    await notifyTelegram(
      paymentMessages.mismatch(reference, finalAmount, expected)
    );
    return;
  }

  /* Re-read right before writing, to narrow the window for a racing call. */
  if ((await isRecorded(reference, invoiceId)).recorded) return;

  await addKeyCrmPayment(reference, {
    payment_method_id: KEYCRM_MONOPAY_METHOD_ID,
    payment_method: "MonoPay",
    amount: toHryvnia(finalAmount),
    status: "paid",
    description: `Оплата через MonoPay (рахунок ${invoiceId})`,
    payment_date: getKyivDateTime().sortable,
  });

  await notifyTelegram(paymentMessages.succeeded(reference, finalAmount));
};

/**
 * Records a successful MonoPay payment on its KeyCRM order: only for the
 * amount the order was placed for, and only once, since Monobank retries
 * callbacks. A mismatch or an unreadable order total raises a Telegram
 * alert instead of marking the order paid. Outside production nothing is
 * written. Throws when KeyCRM fails, so the caller can ask for a retry.
 */
export const recordMonopayPayment = async (payment: MonopayPayment) => {
  const previous = inFlight.get(payment.reference) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(() => record(payment));
  inFlight.set(payment.reference, current);

  try {
    await current;
  } finally {
    if (inFlight.get(payment.reference) === current) {
      inFlight.delete(payment.reference);
    }
  }
};
