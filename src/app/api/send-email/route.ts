import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "@/components/checkoutPage/OrderConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, subject, orderData } = body;

    // Рендеримо HTML на сервері
    const html = await render(OrderConfirmationEmail(orderData));

    // Відправка через Resend
    const data = await resend.emails.send({
      from: "Glimmer.com.ua <hello@glimmer.com.ua>",
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Помилка при відправці email:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
