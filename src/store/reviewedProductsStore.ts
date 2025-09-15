import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface ReviewedProductsState {
  reviewedProducts: Product[];
  addReviewedProduct: (product: Product) => void;
  clearReviewedProducts: () => void;
}

export const useReviewedProductsStore = create<ReviewedProductsState>()(
  persist(
    (set) => ({
      reviewedProducts: [],

      addReviewedProduct: (product) =>
        set((state) => {
          let newList = state.reviewedProducts.filter(
            (p) => p.slug !== product.slug
          );

          newList = [product, ...newList];

          if (newList.length > 20) {
            newList = newList.slice(newList.length - 20);
          }

          return { reviewedProducts: newList };
        }),

      clearReviewedProducts: () => set({ reviewedProducts: [] }),
    }),
    {
      name: "glimmer-reviewed-products-storage",
    }
  )
);
