import { NextRequest, NextResponse } from "next/server";
import { recordMonopayPayment } from "@/features/checkout/api/recordMonopayPayment";
import { verifyMonopayWebhook } from "@/shared/api/monopay/client";

/* The fields of MonoPay's invoice status webhook the handler reads. */
type MonopayWebhook = {
  status?: string;
  invoiceId?: string;
  reference?: string;
  finalAmount?: number;
};

/**
 * MonoPay's payment status callback. The body is accepted only when X-Sign
 * verifies against one of the two accounts' public keys; a successful
 * payment is then recorded by recordMonopayPayment.
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

  const { reference, invoiceId, finalAmount } = data;
  if (
    typeof reference !== "string" ||
    !reference ||
    typeof finalAmount !== "number" ||
    !Number.isInteger(finalAmount)
  ) {
    return new NextResponse("Invalid payment data", { status: 400 });
  }

  try {
    await recordMonopayPayment({
      reference,
      invoiceId: typeof invoiceId === "string" ? invoiceId : "",
      finalAmount,
    });
    return NextResponse.json({ ok: true, status: data.status });
  } catch (error) {
    console.error("Webhook error:", error);
    /* A 5xx makes Monobank retry, which is safe: recording is idempotent. */
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
