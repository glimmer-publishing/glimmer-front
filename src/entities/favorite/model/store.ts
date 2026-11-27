import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/entities/product/model/product";
import { toFavoriteSnapshot } from "../lib/toFavoriteSnapshot";

/* The favorites store's state and actions. */
type FavoritesState = {
  slugs: string[];
  /**
   * Each favorite as last seen, by slug, to draw the page before its
   * listing arrives. Display only; the listing replaces it.
   */
  snapshots: Record<string, Product>;
  /* True once the slugs are read from localStorage. */
  hydrated: boolean;
  /* Adds or removes product; a new favorite keeps it as its snapshot. */
  toggleFavorite: (product: Product) => void;
  /* Keeps a listing's products as the snapshots of the favorites still here. */
  saveSnapshots: (products: Product[]) => void;
};

/* The snapshots of these slugs only; the rest are dropped. */
const keepSnapshots = (snapshots: Record<string, Product>, slugs: string[]) =>
  Object.fromEntries(
    slugs.flatMap((slug) => (snapshots[slug] ? [[slug, snapshots[slug]]] : []))
  );

/* What the favorites keep in localStorage. */
type PersistedFavorites = Pick<FavoritesState, "slugs" | "snapshots">;

/**
 * Favorite book slugs in localStorage, with display snapshots; read after
 * hydration to avoid a mismatch with the server HTML.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      slugs: [],
      snapshots: {},
      hydrated: false,

      toggleFavorite: (product) =>
        set(({ slugs, snapshots }) => {
          const { slug } = product;
          if (slugs.includes(slug)) {
            const next = slugs.filter((favorite) => favorite !== slug);
            return { slugs: next, snapshots: keepSnapshots(snapshots, next) };
          }
          return {
            slugs: [...slugs, slug],
            snapshots: { ...snapshots, [slug]: toFavoriteSnapshot(product) },
          };
        }),

      saveSnapshots: (products) => {
        /**
         * Every set writes all favorites, so re-read them first: another
         * tab may have changed them since this one last did.
         */
        useFavoritesStore.persist.rehydrate();
        set(({ slugs, snapshots }) => {
          const fresh = Object.fromEntries(
            products.map((product) => [
              product.slug,
              toFavoriteSnapshot(product),
            ])
          );
          return {
            snapshots: keepSnapshots({ ...snapshots, ...fresh }, slugs),
          };
        });
      },
    }),
    {
      name: "glimmer-favorites-storage",
      version: 2,
      /**
       * Read on mount (hydrateFavorites), not when the module loads: the
       * first client render must match the server's, which has no slugs.
       */
      skipHydration: true,
      partialize: ({ slugs, snapshots }) => ({ slugs, snapshots }),
      onRehydrateStorage: () => () =>
        useFavoritesStore.setState({ hydrated: true }),
      /**
       * Version 0 kept whole products; only their slugs are carried over.
       * Version 1 had no snapshots; the next listing fills them.
       */
      migrate: (persisted, version) => {
        if (version >= 2) return persisted as PersistedFavorites;
        if (version === 1) {
          return {
            ...(persisted as Pick<FavoritesState, "slugs">),
            snapshots: {},
          };
        }

        const favorites = (persisted as { favorites?: { slug?: unknown }[] })
          ?.favorites;
        const slugs = Array.isArray(favorites)
          ? favorites
              .map((product) => product?.slug)
              .filter((slug): slug is string => typeof slug === "string")
          : [];

        return { slugs, snapshots: {} };
      },
    }
  )
);

/* Reads the stored favorites once, on the client. */
export const hydrateFavorites = () => {
  if (!useFavoritesStore.persist.hasHydrated()) {
    useFavoritesStore.persist.rehydrate();
  }
};
