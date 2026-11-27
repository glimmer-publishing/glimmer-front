"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_LINES, MAX_QUANTITY } from "./constants";
import { lineToSnapshot } from "../lib/snapshots";
import type {
  CartItem,
  CartLineSnapshot,
  CartPromoSnapshot,
  CartQuote,
} from "./types";

/* The cart store's state and actions. */
type CartState = {
  items: CartItem[];
  /* The code as the customer typed it; the server decides whether it applies. */
  promoCode: string | null;
  /**
   * Each item's line as last seen, by id, to draw the cart before its quote
   * arrives. Display only: never sent, never used for an amount.
   */
  snapshots: Record<string, CartLineSnapshot>;
  /* What the last quote made of the promo code. Display only. */
  promoSnapshot: CartPromoSnapshot | null;
  /* True once the cart is read from localStorage. */
  hydrated: boolean;

  /* snapshot draws the new line until its quote arrives. */
  addItem: (id: string, quantity?: number, snapshot?: CartLineSnapshot) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  /* Drops products the server no longer knows. */
  removeItems: (ids: string[]) => void;
  setPromoCode: (code: string | null) => void;
  /* Keeps a server quote's lines as the snapshots of the items still here. */
  saveQuoteSnapshot: (quote: CartQuote, promoCode: string | null) => void;
  clearCart: () => void;
};

/* A quantity forced into 1..MAX_QUANTITY. */
const clamp = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

/* The items with one item's quantity changed by delta, kept in range. */
const changeQuantity = (items: CartItem[], id: string, delta: number) =>
  items.map((item) =>
    item.id === id ? { ...item, quantity: clamp(item.quantity + delta) } : item
  );

/* The snapshots of these items only; the rest are dropped. */
const keepSnapshots = (
  snapshots: Record<string, CartLineSnapshot>,
  items: CartItem[]
) =>
  Object.fromEntries(
    items.flatMap(({ id }) => (snapshots[id] ? [[id, snapshots[id]]] : []))
  );

/* What the cart keeps in localStorage. */
type PersistedCart = Pick<
  CartState,
  "items" | "promoCode" | "snapshots" | "promoSnapshot"
>;

/* The cart as version 0 stored it: whole products. Migrated to ids. */
type PersistedV0 = {
  cart?: { product?: { id?: unknown }; quantity?: unknown }[];
  promoCode?: unknown;
};

/**
 * The cart in localStorage: ids, quantities and the promo code, plus display
 * snapshots of the last quote. Prices come from the server quote.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      snapshots: {},
      promoSnapshot: null,
      hydrated: false,

      addItem: (id, quantity = 1, snapshot) => {
        /* A click before any consumer mounted must not be overwritten later. */
        hydrateCart();
        set(({ items, snapshots }) => {
          if (items.some((item) => item.id === id)) {
            return { items: changeQuantity(items, id, quantity) };
          }
          if (items.length >= MAX_LINES) return {};
          return {
            items: [...items, { id, quantity: clamp(quantity) }],
            snapshots: snapshot ? { ...snapshots, [id]: snapshot } : snapshots,
          };
        });
      },

      removeItem: (id) =>
        set(({ items, snapshots }) => {
          const next = items.filter((item) => item.id !== id);
          return { items: next, snapshots: keepSnapshots(snapshots, next) };
        }),

      increaseQuantity: (id) =>
        set(({ items }) => ({ items: changeQuantity(items, id, 1) })),

      decreaseQuantity: (id) =>
        set(({ items }) => ({ items: changeQuantity(items, id, -1) })),

      removeItems: (ids) =>
        set(({ items, snapshots }) => {
          const next = items.filter((item) => !ids.includes(item.id));
          return { items: next, snapshots: keepSnapshots(snapshots, next) };
        }),

      setPromoCode: (promoCode) =>
        set({ promoCode: promoCode?.trim() || null }),

      saveQuoteSnapshot: (quote, promoCode) => {
        /**
         * Every set writes the whole cart, so re-read it first: another tab
         * may have changed it since this one last did.
         */
        useCartStore.persist.rehydrate();
        set(({ items, snapshots }) => {
          const fresh = Object.fromEntries(
            quote.lines.map((line) => [line.id, lineToSnapshot(line)])
          );
          return {
            snapshots: keepSnapshots({ ...snapshots, ...fresh }, items),
            promoSnapshot: promoCode
              ? {
                  code: promoCode,
                  promo: quote.promo,
                  promoStatus: quote.promoStatus,
                }
              : null,
          };
        });
      },

      clearCart: () =>
        set({ items: [], promoCode: null, snapshots: {}, promoSnapshot: null }),
    }),
    {
      name: "glimmer-cart-storage",
      version: 2,
      /**
       * Read on mount (hydrateCart), not when the module loads: the first
       * client render must match the server's, which has no cart, and the
       * rehydration callback below needs useCartStore to exist already.
       */
      skipHydration: true,
      partialize: ({ items, promoCode, snapshots, promoSnapshot }) => ({
        items,
        promoCode,
        snapshots,
        promoSnapshot,
      }),
      onRehydrateStorage: () => () => useCartStore.setState({ hydrated: true }),
      /**
       * Version 0 kept whole product snapshots, prices included. Only the id
       * and quantity are carried over; the promo code is kept and
       * re-checked by the server. Version 1 had no snapshots; the next
       * quote fills them.
       */
      migrate: (persisted, version) => {
        if (version >= 2) return persisted as PersistedCart;
        if (version === 1) {
          return {
            ...(persisted as Pick<CartState, "items" | "promoCode">),
            snapshots: {},
            promoSnapshot: null,
          };
        }

        const { cart, promoCode } = (persisted ?? {}) as PersistedV0;
        const merged = new Map<string, number>();
        (Array.isArray(cart) ? cart : []).forEach(
          ({ product, quantity } = {}) => {
            if (typeof product?.id !== "string") return;
            if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
              return;
            }
            merged.set(
              product.id,
              clamp((merged.get(product.id) ?? 0) + quantity)
            );
          }
        );
        const items = [...merged].map(([id, quantity]) => ({ id, quantity }));

        return {
          items: items.slice(0, MAX_LINES),
          promoCode: typeof promoCode === "string" ? promoCode : null,
          snapshots: {},
          promoSnapshot: null,
        };
      },
    }
  )
);

/* Reads the cart from localStorage once; safe to call from every consumer. */
export const hydrateCart = () => {
  if (!useCartStore.persist.hasHydrated()) {
    useCartStore.persist.rehydrate();
  }
};
