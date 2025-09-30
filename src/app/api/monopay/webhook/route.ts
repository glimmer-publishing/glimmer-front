import { NextRequest, NextResponse } from "next/server";
import { createVerify } from "crypto";
import axios from "axios";
import { CRM_API_URL } from "@/constants/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
const MONOPAY_PUBKEY = process.env.MONOPAY_PUBKEY!; // Base64 ECDSA pubkey
const CRM_API_KEY = process.env.CRM_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text(); // Важливо: отримаємо тіло як рядок для перевірки підпису
    const signature = req.headers.get("x-sign");

    if (!signature) {
      return new NextResponse("Missing X-Sign header", { status: 400 });
    }

    // Перевірка підпису
    const verify = createVerify("SHA256");
    verify.write(rawBody);
    verify.end();

    const signatureBuf = Buffer.from(signature, "base64");
    const publicKeyBuf = Buffer.from(MONOPAY_PUBKEY, "base64");

    const isValid = verify.verify(publicKeyBuf, signatureBuf);

    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 403 });
    }

    const data = JSON.parse(rawBody);

    if (data.status === "success") {
      const orderId = data.reference;
      const finalAmount = data.finalAmount;

      const message = `✅ Оплата через MonoPay успішна!\nСума: ${finalAmount / 100} грн\nЗамовлення: #${orderId}`;

      await axios({
        method: "post",
        url: `${SITE_URL}api/telegram`,
        data: message,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const now = new Date();
      now.setHours(now.getHours() + 3);

      const payment_date = now.toISOString().slice(0, 19).replace("T", " ");

      // Оновлюємо статус оплати у Key CRM
      const crmResponse = await axios.post(
        `${CRM_API_URL}/order/${orderId}/payment`,
        {
          payment_method_id: 6,
          payment_method: "MonoPay",
          amount: data.finalAmount / 100,
          status: "paid",
          description: "Оплата через MonoPay",
          payment_date,
        },
        {
          headers: {
            Authorization: `Bearer ${CRM_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Логуємо відповідь від CRM
      console.log("CRM response:", crmResponse.data);
    }

    return NextResponse.json({ ok: true, status: data.status });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
