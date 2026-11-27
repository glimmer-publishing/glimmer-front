import { NextRequest, NextResponse } from "next/server";
import { quoteCart } from "@/entities/cart/api/quoteCart";
import { normalizeCartItems } from "@/entities/cart/lib/pricing";
import { parseCartQuoteParams } from "@/entities/cart/lib/cartQuoteParams";
import { MAX_PROMO_LENGTH } from "@/entities/cart/model/constants";
import type { CartQuote } from "@/entities/cart/model/types";

/**
 * The cart priced by the server, for display: ?item=<id>:<qty>&promo=.
 * Never cached, since every visitor sends another cart. Placing the order
 * prices it again, so this answer is never what gets charged.
 */
export async function GET(request: NextRequest) {
  const { items, promoCode } = parseCartQuoteParams(
    request.nextUrl.searchParams
  );
  const normalized = normalizeCartItems(items);

  if (!normalized || (promoCode && promoCode.length > MAX_PROMO_LENGTH)) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  try {
    return NextResponse.json<CartQuote>(await quoteCart(normalized, promoCode));
  } catch (error) {
    console.error("Cart quote failed:", error);
    return NextResponse.json({ error: "Quote failed" }, { status: 502 });
  }
}
