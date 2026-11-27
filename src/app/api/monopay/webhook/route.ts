import { NextRequest, NextResponse } from "next/server";
import { recordMonopayPayment } from "@/features/checkout/api/recordMonopayPayment";
import { parseMonopayWebhook } from "@/features/checkout/lib/parseMonopayWebhook";
import { verifyMonopayWebhook } from "@/shared/api/monopay/client";

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

  const result = parseMonopayWebhook(rawBody);
  if (result.kind === "invalid") {
    return new NextResponse(result.error, { status: 400 });
  }
  if (result.kind === "ignored") {
    return NextResponse.json({ ok: true, status: result.status });
  }

  try {
    await recordMonopayPayment(result.payment);
    return NextResponse.json({ ok: true, status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    /* A 5xx makes Monobank retry, which is safe: recording is idempotent. */
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
