import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const MONOPAY_TOKEN = process.env.MONOPAY_TOKEN;
const MONOPAY_NATIONAL_CASHBACK_TOKEN = process.env.MONOPAY_NATIONAL_CASHBACK_TOKEN;
const MONOBANK_API_URL = "https://api.monobank.ua/api/merchant/invoice/create";

export async function POST(req: NextRequest) {
  if (!MONOPAY_TOKEN)
    throw new Error("MONOPAY_TOKEN не визначено в середовищі!");

  try {
    const { amount, orderNumber, basketOrder, isNationalCashback } = await req.json();

    const token = isNationalCashback ? MONOPAY_NATIONAL_CASHBACK_TOKEN : MONOPAY_TOKEN;

    const invoicePayload = {
      amount,
      ccy: 980,
      merchantPaymInfo: {
        reference: orderNumber,
        basketOrder,
        destination: "Покупка товару",
        comment: "Покупка товару",
      },
      redirectUrl: `${SITE_URL}/confirmation`,
      webHookUrl: `${SITE_URL}/api/monopay/webhook`,
      validity: 3600,
      paymentType: "debit",
    };

    const response = await fetch(MONOBANK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": token!,
      },
      body: JSON.stringify(invoicePayload),
    });

    const data = await response.json();

    if (!response.ok || !data.pageUrl) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    // ✅ повертаємо лише pageUrl у JSON
    return NextResponse.json({ pageUrl: data.pageUrl });
  } catch (error) {
    console.error("Monopay error:", error);
    return NextResponse.json(
      { error: "Помилка при створенні рахунку" },
      { status: 500 }
    );
  }
}
