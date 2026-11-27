"use client";
import { useEffect } from "react";
import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/shared/api/http/fetchJson";
import { cartQuoteHref } from "../lib/cartQuoteParams";
import { hydrateCart, useCartStore } from "../model/store";
import type { CartItem, CartQuote } from "../model/types";

/* The query key of a cart's quote: the cart's /api/cart URL. */
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

/**
 * The cart as the server prices it (GET /api/cart), for display. A change of
 * quantity keeps the previous quote on screen until the new one arrives.
 * quote is undefined while the cart is empty or not read yet.
 */
export const useFetchCartQuote = () => {
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const hydrated = useCartStore((state) => state.hydrated);
  const url = cartQuoteHref(items, promoCode);

  useEffect(hydrateCart, []);

  const query = useQuery({
    queryKey: cartQuoteKey(items, promoCode),
    queryFn: ({ signal }) => fetchJson<CartQuote>(url, signal),
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
