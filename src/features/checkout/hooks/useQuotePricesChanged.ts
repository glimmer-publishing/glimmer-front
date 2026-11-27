"use client";
import { useEffect, useRef, useState } from "react";
import type { CartQuote } from "@/entities/cart/model/types";
import { quotePricesChanged } from "../lib/quotePricesChanged";

/* The quote first drawn from snapshots, and the promo code it was for. */
type ShownQuote = { quote: CartQuote; promoCode: string | null };

/**
 * True once the checkout's first server quote prices the cart differently
 * from the snapshot it opened with, and for the rest of the visit. Only that
 * first replacement counts: later quotes follow the customer's own changes
 * (quantities, promo code), and createOrder re-checks the total anyway.
 */
export const useQuotePricesChanged = (
  quote: CartQuote | undefined,
  isPlaceholderData: boolean,
  promoCode: string | null
) => {
  /* undefined: nothing seen yet; null: the first real quote is settled. */
  const shown = useRef<ShownQuote | null | undefined>(undefined);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (shown.current === null || !quote) return;

    if (isPlaceholderData) {
      shown.current ??= { quote, promoCode };
      return;
    }

    const first = shown.current;
    shown.current = null;
    if (
      first &&
      first.promoCode === promoCode &&
      quotePricesChanged(first.quote, quote)
    ) {
      setChanged(true);
    }
  }, [quote, isPlaceholderData, promoCode]);

  return changed;
};
