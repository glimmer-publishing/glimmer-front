"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* Most books remembered; the oldest is dropped first. */
const MAX_REVIEWED = 20;

interface ReviewedState {
  /* Slugs of viewed books, most recent first. */
  slugs: string[];
  /* True once the slugs are read from localStorage. */
  hydrated: boolean;
  addReviewed: (slug: string) => void;
}

export const useReviewedStore = create<ReviewedState>()(
  persist(
    (set) => ({
      slugs: [],
      hydrated: false,

      addReviewed: (slug) =>
        set((state) => ({
          slugs: [slug, ...state.slugs.filter((seen) => seen !== slug)].slice(
            0,
            MAX_REVIEWED
          ),
        })),
    }),
    {
      name: "glimmer-reviewed-products-storage",
      version: 1,
      /**
       * Read on mount (hydrateReviewed), not when the module loads: the
       * first client render must match the server's, which has no history.
       */
      skipHydration: true,
      partialize: ({ slugs }) => ({ slugs }),
      onRehydrateStorage: () => () =>
        useReviewedStore.setState({ hydrated: true }),
      /**
       * Version 0 kept whole product snapshots, newest first. Only their
       * slugs are carried over, in the same order.
       */
      migrate: (persisted, version) => {
        if (version >= 1) return persisted as Pick<ReviewedState, "slugs">;

        const products = (persisted as { reviewedProducts?: unknown })
          ?.reviewedProducts;
        const slugs = Array.isArray(products)
          ? products
              .map((product) => (product as { slug?: unknown })?.slug)
              .filter((slug): slug is string => typeof slug === "string")
          : [];

        return { slugs: [...new Set(slugs)].slice(0, MAX_REVIEWED) };
      },
    }
  )
);

/* Reads the history from localStorage once; safe to call from every user. */
export const hydrateReviewed = () => {
  if (!useReviewedStore.persist.hasHydrated()) {
    useReviewedStore.persist.rehydrate();
  }
};
