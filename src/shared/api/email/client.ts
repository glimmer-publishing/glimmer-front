import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/shared/config/serverEnv";

/* The sender every email goes out from. */
const FROM = "Glimmer.com.ua <hello@glimmer.com.ua>";

/* One email to send. */
type EmailMessage = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Sends one email through Resend. Resend is shared by every environment, so
 * preview sends real email too. Throws when Resend refuses it.
 */
export const sendEmail = async ({ to, subject, html }: EmailMessage) => {
  const apiKey = serverEnv.resendApiKey;

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
