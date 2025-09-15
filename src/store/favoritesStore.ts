import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) =>
        set((state) => {
          const exists = state.favorites.some(
            (fav) => fav.slug === product.slug
          );
          return exists ? state : { favorites: [...state.favorites, product] };
        }),

      removeFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.slug !== slug),
        })),

      isFavorite: (slug) => get().favorites.some((fav) => fav.slug === slug),
    }),
    {
      name: "glimmer-favorites-storage",
    }
  )
);
