import "server-only";
import { serverEnv } from "@/shared/config/serverEnv";

/**
 * Posts to the operations group in Telegram's HTML parse mode. Every value
 * interpolated into `html` must be passed through escapeHtml first. Each
 * environment has its own bot and group (TELEGRAM_BOT_ID, TELEGRAM_CHAT_ID).
 * Throws when Telegram refuses or is unreachable.
 */
export const sendTelegramMessage = async (html: string) => {
  const { botId, chatId } = serverEnv.telegram;

  if (!botId || !chatId) {
    console.warn("Telegram is not configured; message not sent:", html);
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botId}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, parse_mode: "html", text: html }),
    }
  );

  if (!response.ok) {
    throw new Error(`Telegram responded ${response.status}`);
  }
};

/* sendTelegramMessage for notifications that must not fail their caller. */
export const notifyTelegram = async (html: string) => {
  try {
    await sendTelegramMessage(html);
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }
};
