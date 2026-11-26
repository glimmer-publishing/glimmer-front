"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderSummary } from "./types";

/* The last-order store's state and actions. */
type OrderState = {
  /* The last order placed in this browser, as createOrder returned it. */
  order: OrderSummary | null;
  setOrder: (order: OrderSummary) => void;
};

/**
 * Kept in localStorage because online payment leaves the site: the
 * confirmation page is reached back from MonoPay.
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (order) => set({ order }),
    }),
    {
      /* A new key: the old one held client-built orders of another shape. */
      name: "glimmer-last-order",
    }
  )
);
