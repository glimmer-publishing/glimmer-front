"use client";
import { useEffect } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/shared/api/http/fetchJson";
import { cartQuoteHref } from "../lib/cartQuoteParams";
import { snapshotQuote } from "../lib/snapshots";
import { hydrateCart, useCartStore } from "../model/store";
import type { CartItem, CartQuote } from "../model/types";

/* The query key of a cart's quote: the cart's /api/cart URL. */
const cartQuoteKey = (items: CartItem[], promoCode: string | null) => [
  "cart-quote",
  cartQuoteHref(items, promoCode),
];

/**
 * Stores a quote the server returned elsewhere (createOrder's "prices
 * changed") as the current quote for this cart, without a refetch, and as
 * the cart's snapshot.
 */
export const setCartQuote = (
  queryClient: QueryClient,
  items: CartItem[],
  promoCode: string | null,
  quote: CartQuote
) => {
  queryClient.setQueryData(cartQuoteKey(items, promoCode), quote);
  useCartStore.getState().saveQuoteSnapshot(quote, promoCode);
};

/* GET /api/cart, kept as the cart's snapshot for the next visit. */
const fetchCartQuote = async (
  url: string,
  promoCode: string | null,
  signal: AbortSignal
) => {
  const quote = await fetchJson<CartQuote>(url, signal);
  useCartStore.getState().saveQuoteSnapshot(quote, promoCode);
  return quote;
};

/**
 * The cart as the server prices it (GET /api/cart), for display. Until the
 * quote arrives, the cart is drawn from its snapshots (the last quote's
 * lines, at current quantities), or else the previous quote stays on screen;
 * isPlaceholderData is true meanwhile. quote is undefined while the cart is
 * empty, not read yet, or has nothing to draw it from.
 */
export const useFetchCartQuote = () => {
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const hydrated = useCartStore((state) => state.hydrated);
  const snapshots = useCartStore((state) => state.snapshots);
  const promoSnapshot = useCartStore((state) => state.promoSnapshot);
  const url = cartQuoteHref(items, promoCode);

  useEffect(hydrateCart, []);

  const query = useQuery({
    queryKey: cartQuoteKey(items, promoCode),
    queryFn: ({ signal }) => fetchCartQuote(url, promoCode, signal),
    enabled: hydrated && items.length > 0,
    placeholderData: (previous) =>
      snapshotQuote(items, snapshots, promoSnapshot, promoCode) ?? previous,
  });

  return {
    ...query,
    quote: items.length ? query.data : undefined,
    items,
    promoCode,
    hydrated,
  };
};
