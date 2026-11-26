import "server-only";
import { Resend } from "resend";

const FROM = "Glimmer.com.ua <hello@glimmer.com.ua>";

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends one email through Resend. Resend is shared by every environment, so
 * preview sends real email too. Throws when Resend refuses it.
 */
export const sendEmail = async ({ to, subject, html }: EmailMessage) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(`Resend is not configured; email to ${to} not sent.`);
    return;
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to,
    subject,
    html,
  });

  if (error) throw new Error(`Resend: ${error.message}`);
};
