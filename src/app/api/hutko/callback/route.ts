import { NextRequest, NextResponse } from "next/server";
import { verifyHutkoSignature } from "@/utils/hutkoSignature";
import axios from "axios";
import { CRM_API_URL } from "@/constants/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
const HUTKO_MERCHANT_ID = process.env.HUTKO_MERCHANT_ID!;
const HUTKO_PASSWORD = process.env.HUTKO_PASSWORD!;
const CRM_API_KEY = process.env.CRM_API_KEY;

const HUTKO_CRM_PAYMENT_METHOD_ID = 9;
const HUTKO_CRM_PAYMENT_METHOD_NAME = "Національний кешбек, єПідтримка";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, string>;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      data = body.response || body;
    } else {
      // Handle form-encoded callback (Hutko may send this format)
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries()) as Record<string, string>;
    }

    console.log("Hutko callback received:", JSON.stringify(data));

    // Verify signature
    const isValid = verifyHutkoSignature(
      HUTKO_MERCHANT_ID,
      HUTKO_PASSWORD,
      data
    );

    if (!isValid) {
      console.error("Hutko callback: invalid signature. Data:", JSON.stringify(data));
      return new NextResponse("Invalid signature", { status: 403 });
    }

    if (data.order_status === "approved") {
      const orderId = data.order_id;
      const amount = Number(data.amount) / 100; // Convert from kopecks

      // Send Telegram notification via our internal endpoint (same as MonoPay)
      const message = `✅ Оплата через Hutko успішна!\nСума: ${amount} грн\nЗамовлення: #${orderId}`;

      try {
        await axios({
          method: "post",
          url: `${SITE_URL}api/telegram`,
          data: message,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (telegramError) {
        // Log but don't fail the whole callback — CRM update is more critical
        console.error("Hutko callback: Telegram notification failed:", telegramError);
      }

      // Update payment status in KeyCRM
      const now = new Date();
      now.setHours(now.getHours() + 3);
      const payment_date = now.toISOString().slice(0, 19).replace("T", " ");

      try {
        await axios.post(
          `${CRM_API_URL}/order/${orderId}/payment`,
          {
            payment_method_id: HUTKO_CRM_PAYMENT_METHOD_ID,
            payment_method: HUTKO_CRM_PAYMENT_METHOD_NAME,
            amount,
            status: "paid",
            description: "Оплата через Hutko (Національний кешбек / єПідтримка)",
            payment_date,
          },
          {
            headers: {
              Authorization: `Bearer ${CRM_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (crmError) {
        if (axios.isAxiosError(crmError)) {
          console.error(
            "Hutko callback: CRM payment update failed:",
            crmError.response?.status,
            JSON.stringify(crmError.response?.data)
          );
        } else {
          console.error("Hutko callback: CRM payment update failed:", crmError);
        }
        // Still return 200 to Hutko so it doesn't retry endlessly
      }
    } else {
      console.log(`Hutko callback: order ${data.order_id} status = ${data.order_status}, skipping payment update`);
    }

    // Always return HTTP 200 to acknowledge receipt
    return NextResponse.json({ ok: true, status: data.order_status });
  } catch (error) {
    console.error("Hutko callback error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
