import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import { getProductReference } from "@/entities/product/api/getProductReference";
import { callBackValidation } from "@/schemas/callBackValidation";
import { writeReviewValidation } from "@/schemas/writeReviewValidation";
import { sendTelegramMessage } from "@/shared/api/telegram/client";
import { escapeHtml as e } from "@/shared/lib/html";

/**
 * Builds the operations-group message for one of the site's forms. The
 * browser sends typed fields only; the text is built and escaped here.
 * Returns null when the request is not a valid form submission.
 */
const buildMessage = async (body: unknown): Promise<string | null> => {
  const { kind, ...fields } = (body ?? {}) as { kind?: unknown };

  if (kind === "callback") {
    const { name, email, message } = await callBackValidation().validate(
      fields,
      { stripUnknown: true }
    );
    return (
      `<b>Заявка "Форма зворотнього зв'язку"</b>\n` +
      `<b>Ім'я:</b> ${e(name.trim())}\n` +
      `<b>Email:</b> ${e(email.trim())}\n` +
      `<b>Повідомлення:</b> ${e(message.trim())}\n`
    );
  }

  if (kind === "review") {
    const productId = (fields as { productId?: unknown }).productId;
    if (typeof productId !== "string" || productId.length > 100) return null;

    const [{ name, email, rating, message }, product] = await Promise.all([
      writeReviewValidation().validate(fields, { stripUnknown: true }),
      getProductReference(productId),
    ]);
    if (!product || !Number.isInteger(rating) || rating > 5) return null;

    return (
      `<b>Відгук на товар "${e(product.title)}" ${e(product.author ?? "")}, код товару: ${e(product.sku)}</b>\n` +
      `<b>Ім'я:</b> ${e(name.trim())}\n` +
      `<b>Email:</b> ${e(email.trim())}\n` +
      `<b>Рейтинг:</b> ${rating}\n` +
      `<b>Текст відгуку:</b> ${e(message.trim())}\n`
    );
  }

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
