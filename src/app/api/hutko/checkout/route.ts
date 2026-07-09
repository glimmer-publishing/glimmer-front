import { NextRequest, NextResponse } from "next/server";
import { generateHutkoSignature } from "@/utils/hutkoSignature";

const HUTKO_MERCHANT_ID = process.env.HUTKO_MERCHANT_ID!;
const HUTKO_PASSWORD = process.env.HUTKO_PASSWORD!;
// Strip any trailing slash so we always build clean URLs (no double slashes)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/+$/, "");
const HUTKO_CALLBACK_URL = `${SITE_URL}/api/hutko/callback`;

const HUTKO_CHECKOUT_URL = "https://pay.hutko.org/api/checkout/url/";

export async function POST(req: NextRequest) {
  if (!HUTKO_MERCHANT_ID || !HUTKO_PASSWORD) {
    return NextResponse.json(
      { error: "Hutko credentials не налаштовані" },
      { status: 500 }
    );
  }

  try {
    const { amount, orderNumber, orderDescription } = await req.json();

    const params: Record<string, string> = {
      order_id: orderNumber,
      order_desc: orderDescription,
      amount: String(amount),
      currency: "UAH",
      version: "1.0.1",
      // Hutko POSTs to response_url, so we use a dedicated API route
      // that accepts POST and redirects the browser to /confirmation
      response_url: `${SITE_URL}/api/hutko/response`,
      server_callback_url: HUTKO_CALLBACK_URL,
      merchant_id: HUTKO_MERCHANT_ID,
    };

    console.log("Hutko checkout request params:", JSON.stringify(params));

    const signature = generateHutkoSignature(HUTKO_PASSWORD, params);

    const requestBody = {
      request: {
        ...params,
        signature,
      },
    };

    const response = await fetch(HUTKO_CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (
      data.response?.response_status === "success" &&
      data.response?.checkout_url
    ) {
      return NextResponse.json({ checkoutUrl: data.response.checkout_url });
    }

    console.error("Hutko checkout error:", data);
    return NextResponse.json(
      {
        error: data.response?.error_message || "Помилка при створенні платежу",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Hutko checkout error:", error);
    return NextResponse.json(
      { error: "Помилка при створенні рахунку Hutko" },
      { status: 500 }
    );
  }
}
