import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import { buildCallbackMessage } from "@/features/callback/lib/buildCallbackMessage";
import { buildReviewMessage } from "@/features/write-review/api/buildReviewMessage";
import { sendTelegramMessage } from "@/shared/api/telegram/client";

/**
 * The message for one of the site's forms, by its kind; null when the
 * request is not a valid form submission.
 */
const buildMessage = async (body: unknown): Promise<string | null> => {
  const { kind, ...fields } = (body ?? {}) as { kind?: unknown };

  if (kind === "callback") return buildCallbackMessage(fields);
  if (kind === "review") return buildReviewMessage(fields);
  return null;
};

/**
 * Sends a callback request or a product review to the operations group:
 * { kind: "callback", name, email, message } or
 * { kind: "review", productId, name, email, rating, message }.
 */
export async function POST(request: NextRequest) {
  let message: string | null;
  try {
    message = await buildMessage(await request.json());
  } catch (error) {
    if (error instanceof ValidationError || error instanceof SyntaxError) {
      message = null;
    } else {
      console.error("Telegram form failed:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  if (!message) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await sendTelegramMessage(message);
    return NextResponse.json({ message: "Data sent successfully" });
  } catch (error) {
    console.error("Telegram send failed:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
}
