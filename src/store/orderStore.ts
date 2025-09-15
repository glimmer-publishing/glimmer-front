import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderData } from "@/types/orderData";

interface OrderStore {
  order: OrderData | null;
  setOrder: (order: OrderData) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (order) => set({ order }),
      clearOrder: () => set({ order: null }),
    }),
    {
      name: "glimmer-order-storage",
    }
  )
);
