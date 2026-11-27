import { escapeHtml as e } from "@/shared/lib/text/html";
import { callBackValidation } from "../model/schema";

/**
 * The operations-group message for a callback request, built from the form
 * fields after the form's own schema accepts them. Every value is escaped
 * for Telegram's HTML mode. Rejects with yup's ValidationError on bad input.
 */
export const buildCallbackMessage = async (
  fields: unknown
): Promise<string> => {
  const { name, email, message } = await callBackValidation().validate(fields, {
    stripUnknown: true,
  });

  return (
    `<b>Заявка "Форма зворотнього зв'язку"</b>\n` +
    `<b>Ім'я:</b> ${e(name.trim())}\n` +
    `<b>Email:</b> ${e(email.trim())}\n` +
    `<b>Повідомлення:</b> ${e(message.trim())}\n`
  );
};
