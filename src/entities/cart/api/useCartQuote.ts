"use client";
import { useEffect } from "react";
import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import { cartQuoteHref } from "../model/cartHref";
import { hydrateCart, useCartStore } from "../model/store";
import type { CartItem, CartQuote } from "../model/types";

const cartQuoteKey = (items: CartItem[], promoCode: string | null) => [
  "cart-quote",
  cartQuoteHref(items, promoCode),
];

/**
 * Stores a quote the server returned elsewhere (createOrder's "prices
 * changed") as the current quote for this cart, without a refetch.
 */
export const setCartQuote = (
  queryClient: QueryClient,
  items: CartItem[],
  promoCode: string | null,
  quote: CartQuote
) => queryClient.setQueryData(cartQuoteKey(items, promoCode), quote);

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

  useEffect(hydrateCart, []);

  const query = useQuery({
    queryKey: cartQuoteKey(items, promoCode),
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
