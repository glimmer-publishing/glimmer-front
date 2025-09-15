import { NextResponse } from "next/server";
import axios from "axios";

const MONOPAY_TOKEN = process.env.MONOPAY_TOKEN!;

export async function GET() {
  try {
    const response = await axios.get(
      "https://api.monobank.ua/api/merchant/pubkey",
      {
        headers: {
          "X-Token": MONOPAY_TOKEN,
        },
      }
    );

    return NextResponse.json({ pubkey: response.data.key });
  } catch (error) {
    console.error("Failed to fetch pubkey:", error);
    return new NextResponse("Error fetching pubkey", { status: 500 });
  }
}
