"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cartQuoteHref } from "../model/cartHref";
import { useCartStore } from "../model/store";
import type { CartQuote } from "../model/types";

export const CART_QUOTE_KEY = "cart-quote";

const fetchQuote = async (
  url: string,
  signal: AbortSignal
): Promise<CartQuote> => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Status ${response.status}`);

  return response.json();
};

/**
 * The cart as the server prices it (GET /api/cart), for display. A change of
 * quantity keeps the previous quote on screen until the new one arrives.
 * quote is undefined while the cart is empty or not read yet.
 */
export const useCartQuote = () => {
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const hydrated = useCartStore((state) => state.hydrated);
  const url = cartQuoteHref(items, promoCode);

  const query = useQuery({
    queryKey: [CART_QUOTE_KEY, url],
    queryFn: ({ signal }) => fetchQuote(url, signal),
    enabled: hydrated && items.length > 0,
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    quote: items.length ? query.data : undefined,
    items,
    promoCode,
    hydrated,
  };
};
