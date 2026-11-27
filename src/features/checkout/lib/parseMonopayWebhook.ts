import type { MonopayPayment } from "../model/types";

/* The fields of MonoPay's invoice status webhook that are read. */
type MonopayWebhookBody = {
  status?: string;
  invoiceId?: string;
  reference?: string;
  finalAmount?: number;
};

/* What a verified webhook body says, and what the route does with it. */
export type MonopayWebhookResult =
  /* Not JSON, or a success without a usable order reference or amount. */
  | { kind: "invalid"; error: string }
  /* Any status but "success" (created, processing, failure…): nothing to record. */
  | { kind: "ignored"; status?: string }
  /* A completed payment to record on the KeyCRM order. */
  | { kind: "paid"; payment: MonopayPayment };

/**
 * Reads a webhook body whose signature has already been verified. Only a
 * "success" needs a reference (the KeyCRM order id) and an integer amount
 * in kopecks; a missing invoice id is recorded as empty.
 */
export const parseMonopayWebhook = (rawBody: string): MonopayWebhookResult => {
  let body: MonopayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { kind: "invalid", error: "Invalid body" };
  }

  if (body.status !== "success")
    return { kind: "ignored", status: body.status };

  const { reference, invoiceId, finalAmount } = body;
  if (
    typeof reference !== "string" ||
    !reference ||
    typeof finalAmount !== "number" ||
    !Number.isInteger(finalAmount)
  ) {
    return { kind: "invalid", error: "Invalid payment data" };
  }

  return {
    kind: "paid",
    payment: {
      reference,
      invoiceId: typeof invoiceId === "string" ? invoiceId : "",
      finalAmount,
    },
  };
};
