"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_LINES, MAX_QUANTITY } from "./constants";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  /* The code as the customer typed it; the server decides whether it applies. */
  promoCode: string | null;
  /* True once the cart is read from localStorage. */
  hydrated: boolean;

  addItem: (id: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  /* Drops products the server no longer knows. */
  removeItems: (ids: string[]) => void;
  setPromoCode: (code: string | null) => void;
  clearCart: () => void;
}

const clamp = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

const changeQuantity = (items: CartItem[], id: string, delta: number) =>
  items.map((item) =>
    item.id === id ? { ...item, quantity: clamp(item.quantity + delta) } : item
  );

interface PersistedV0 {
  cart?: { product?: { id?: unknown }; quantity?: unknown }[];
  promoCode?: unknown;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      hydrated: false,

      addItem: (id, quantity = 1) => {
        /* A click before any consumer mounted must not be overwritten later. */
        hydrateCart();
        set(({ items }) => {
          if (items.some((item) => item.id === id)) {
            return { items: changeQuantity(items, id, quantity) };
          }
          if (items.length >= MAX_LINES) return {};
          return { items: [...items, { id, quantity: clamp(quantity) }] };
        });
      },

      removeItem: (id) =>
        set(({ items }) => ({ items: items.filter((item) => item.id !== id) })),

      increaseQuantity: (id) =>
        set(({ items }) => ({ items: changeQuantity(items, id, 1) })),

      decreaseQuantity: (id) =>
        set(({ items }) => ({ items: changeQuantity(items, id, -1) })),

      removeItems: (ids) =>
        set(({ items }) => ({
          items: items.filter((item) => !ids.includes(item.id)),
        })),

      setPromoCode: (promoCode) =>
        set({ promoCode: promoCode?.trim() || null }),

      clearCart: () => set({ items: [], promoCode: null }),
    }),
    {
      name: "glimmer-cart-storage",
      version: 1,
      /**
       * Read on mount (hydrateCart), not when the module loads: the first
       * client render must match the server's, which has no cart, and the
       * rehydration callback below needs useCartStore to exist already.
       */
      skipHydration: true,
      partialize: ({ items, promoCode }) => ({ items, promoCode }),
      onRehydrateStorage: () => () => useCartStore.setState({ hydrated: true }),
      /**
       * Version 0 kept whole product snapshots, prices included. Only the id
       * and quantity are carried over; the promo code is kept and
       * re-checked by the server.
       */
      migrate: (persisted, version) => {
        if (version >= 1) {
          return persisted as Pick<CartState, "items" | "promoCode">;
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
