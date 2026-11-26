import { create } from "zustand";
import { persist } from "zustand/middleware";

/* The favorites store's state and actions. */
type FavoritesState = {
  slugs: string[];
  /* True once the slugs are read from localStorage. */
  hydrated: boolean;
  toggleFavorite: (slug: string) => void;
};

/**
 * Favorite book slugs in localStorage; read after hydration to avoid a
 * mismatch with the server HTML.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      slugs: [],
      hydrated: false,

      toggleFavorite: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug)
            ? state.slugs.filter((favorite) => favorite !== slug)
            : [...state.slugs, slug],
        })),
    }),
    {
      name: "glimmer-favorites-storage",
      version: 1,
      /**
       * Read on mount (hydrateFavorites), not when the module loads: the
       * first client render must match the server's, which has no slugs.
       */
      skipHydration: true,
      partialize: ({ slugs }) => ({ slugs }),
      onRehydrateStorage: () => () =>
        useFavoritesStore.setState({ hydrated: true }),
      // Version 0 kept whole products; only their slugs are carried over.
      migrate: (persisted, version) => {
        if (version >= 1) return persisted as Pick<FavoritesState, "slugs">;

        const favorites = (persisted as { favorites?: { slug?: unknown }[] })
          ?.favorites;
        const slugs = Array.isArray(favorites)
          ? favorites
              .map((product) => product?.slug)
              .filter((slug): slug is string => typeof slug === "string")
          : [];

        return { slugs };
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
