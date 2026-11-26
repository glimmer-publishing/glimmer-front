import { NextRequest, NextResponse } from "next/server";
import { toKopecks } from "@/entities/cart/lib/pricing";
import { isProduction } from "@/lib/env";
import { addKeyCrmPayment, getKeyCrmOrder } from "@/shared/api/keycrm/client";
import { verifyMonopayWebhook } from "@/shared/api/monopay/client";
import { notifyTelegram } from "@/shared/api/telegram/client";
import { escapeHtml } from "@/shared/lib/html";
import { getKyivDateTime } from "@/utils/getKyivDate";

interface MonopayWebhook {
  status?: string;
  /* The KeyCRM order id createOrder passed as the invoice reference. */
  reference?: string;
  /* Kopecks actually paid. */
  finalAmount?: number;
}

const hryvnia = (kopecks: number) => kopecks / 100;

/**
 * Marks the KeyCRM order paid, but only for the amount it was placed for,
 * and only once: Monobank retries callbacks, and a second "success" for an
 * order that already has a paid payment changes nothing.
 */
const recordPayment = async (reference: string, finalAmount: number) => {
  const ref = escapeHtml(reference);

  if (!isProduction) {
    console.log(
      `KeyCRM payment update NOT sent for order ${reference}, amount ${hryvnia(finalAmount)}`
    );
    await notifyTelegram(
      `✅ Оплата через MonoPay успішна!\nСума: ${hryvnia(finalAmount)} грн\nЗамовлення: #${ref}`
    );
    return;
  }

  const order = await getKeyCrmOrder(reference);
  if (!order) throw new Error(`KeyCRM order ${reference} not found`);

  if (order.payments?.some((payment) => payment.status === "paid")) {
    console.log(`Order ${reference} is already paid; webhook ignored`);
    return;
  }

  if (typeof order.grand_total !== "number") {
    await notifyTelegram(
      `⚠️ <b>Не вдалося перевірити оплату MonoPay</b>\n` +
        `Замовлення: #${ref}\nОплачено: ${hryvnia(finalAmount)} грн\n` +
        `KeyCRM не повернув суму замовлення. Позначте оплату вручну.`
    );
    return;
  }

  const expected = toKopecks(order.grand_total);
  if (expected !== finalAmount) {
    await notifyTelegram(
      `⚠️ <b>Сума оплати MonoPay не збігається із замовленням</b>\n` +
        `Замовлення: #${ref}\nОплачено: ${hryvnia(finalAmount)} грн\n` +
        `Сума замовлення: ${hryvnia(expected)} грн\nЗамовлення НЕ позначене як оплачене.`
    );
    return;
  }

  await addKeyCrmPayment(reference, {
    payment_method_id: 6,
    payment_method: "MonoPay",
    amount: hryvnia(finalAmount),
    status: "paid",
    description: "Оплата через MonoPay",
    payment_date: getKyivDateTime().sortable,
  });

  await notifyTelegram(
    `✅ Оплата через MonoPay успішна!\nСума: ${hryvnia(finalAmount)} грн\nЗамовлення: #${ref}`
  );
};

/**
 * MonoPay's payment status callback. The body is accepted only when X-Sign
 * verifies against one of the two accounts' public keys.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-sign");

  if (!signature) {
    return new NextResponse("Missing X-Sign header", { status: 400 });
  }

  if (!(await verifyMonopayWebhook(rawBody, signature))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  let data: MonopayWebhook;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid body", { status: 400 });
  }

  if (data.status !== "success") {
    return NextResponse.json({ ok: true, status: data.status });
  }

  if (
    typeof data.reference !== "string" ||
    !data.reference ||
    !Number.isInteger(data.finalAmount)
  ) {
    return new NextResponse("Invalid payment data", { status: 400 });
  }

  try {
    await recordPayment(data.reference, data.finalAmount as number);
    return NextResponse.json({ ok: true, status: data.status });
  } catch (error) {
    console.error("Webhook error:", error);
    /* A 5xx makes Monobank retry, which is safe: recording is idempotent. */
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
