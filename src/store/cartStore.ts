"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];

  promoCode: string | null;
  promoDiscountPercent: number;
  promoPublishers: { id: string; name: string }[];

  hydrated: boolean;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;

  applyPromoCode: (
    code: string,
    discountPercent: number,
    publishers: { id: string; name: string }[]
  ) => void;
  removePromoCode: () => void;

  getCartTotal: () => number;
  getPromoDiscountTotal: () => number;
  getItemFinalPrice: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      promoCode: null,
      promoDiscountPercent: 0,
      promoPublishers: [],
      hydrated: false,

      addToCart: (product, quantity = 1) => {
        const cart = get().cart.slice();
        const existingItem = cart.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({ product, quantity });
        }
        set({ cart });
      },

      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.product.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        const cart = get().cart.slice();
        const item = cart.find((i) => i.product.id === productId);
        if (item) {
          item.quantity = quantity;
          set({ cart });
        }
      },

      increaseQuantity: (productId) => {
        const cart = get().cart.slice();
        const item = cart.find((i) => i.product.id === productId);
        if (item) {
          item.quantity += 1;
          set({ cart });
        }
      },

      decreaseQuantity: (productId) => {
        const cart = get().cart.slice();
        const item = cart.find((i) => i.product.id === productId);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          set({ cart });
        }
      },

      clearCart: () =>
        set({
          cart: [],
          promoCode: null,
          promoDiscountPercent: 0,
          promoPublishers: [],
        }),

      applyPromoCode: (code, discountPercent, publishers) =>
        set({
          promoCode: code,
          promoDiscountPercent: discountPercent,
          promoPublishers: publishers,
        }),

      removePromoCode: () =>
        set({ promoCode: null, promoDiscountPercent: 0, promoPublishers: [] }),

      getCartTotal: () => {
        const { cart, promoCode, promoDiscountPercent, promoPublishers } =
          get();
        return cart.reduce((sum, item) => {
          const basePrice = item.product.discountPrice ?? item.product.price;
          const hasDiscount = !!item.product.discountPrice; // ❗ додано
          const publisherFeature = item.product.features?.find(
            (f) => f.featureName.toLowerCase() === "видавництво"
          );
          const publisherValue = publisherFeature?.value;
          const isEligible =
            promoCode &&
            !hasDiscount && // ❗ промо не діє, якщо товар зі знижкою
            publisherValue &&
            promoPublishers.some(
              (pub) => pub.name.toLowerCase() === publisherValue.toLowerCase()
            );
          const finalPrice = isEligible
            ? basePrice * (1 - promoDiscountPercent / 100)
            : basePrice;
          return sum + finalPrice * item.quantity;
        }, 0);
      },

      getPromoDiscountTotal: () => {
        const { cart, promoDiscountPercent, promoPublishers } = get();
        if (!promoDiscountPercent) return 0;
        return cart.reduce((sum, item) => {
          const hasDiscount = !!item.product.discountPrice; //
          if (hasDiscount) return sum; // ❗ пропускаємо товари зі знижкою
          const basePrice = item.product.discountPrice ?? item.product.price;
          const publisherFeature = item.product.features?.find(
            (f) => f.featureName.toLowerCase() === "видавництво"
          );
          const publisherValue = publisherFeature?.value;
          const isEligible =
            publisherValue &&
            promoPublishers.some(
              (pub) => pub.name.toLowerCase() === publisherValue.toLowerCase()
            );
          if (!isEligible) return sum;
          return sum + basePrice * (promoDiscountPercent / 100) * item.quantity;
        }, 0);
      },

      getItemFinalPrice: (productId) => {
        const { cart, promoDiscountPercent, promoPublishers } = get();
        const item = cart.find((i) => i.product.id === productId);
        if (!item) return 0;
        const basePrice = item.product.discountPrice ?? item.product.price;
        const hasDiscount = !!item.product.discountPrice; //
        const publisherFeature = item.product.features?.find(
          (f) => f.featureName.toLowerCase() === "видавництво"
        );
        const publisherValue = publisherFeature?.value;
        const isEligible =
          !hasDiscount && // ❗ промо не діє, якщо товар зі знижкою
          publisherValue &&
          promoPublishers.some(
            (pub) => pub.name.toLowerCase() === publisherValue.toLowerCase()
          );
        return isEligible
          ? basePrice * (1 - promoDiscountPercent / 100)
          : basePrice;
      },
    }),
    {
      name: "glimmer-cart-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
