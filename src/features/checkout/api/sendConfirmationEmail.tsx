import "server-only";
import { render } from "@react-email/render";
import { sendEmail } from "@/shared/api/email/client";
import type { OrderSummary } from "../model/types";
import { CheckoutConfirmationEmail } from "../ui/CheckoutConfirmationEmail";

/* Emails the customer their order; a failure is logged, never thrown. */
export const sendConfirmationEmail = async (order: OrderSummary) => {
  try {
    await sendEmail({
      to: order.email,
      subject: `Glimmer: Підтвердження замовлення №${order.orderNumber}`,
      html: await render(<CheckoutConfirmationEmail order={order} />),
    });
  } catch (error) {
    console.error(
      `Confirmation email for order ${order.orderNumber} failed:`,
      error
    );
  }
};
