"use client";
import { useEffect } from "react";
import { hydrateFavorites, useFavoritesStore } from "./store";

export const useFavorite = (slug: string) => {
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const isFavorite = useFavoritesStore((state) => state.slugs.includes(slug));
  const toggle = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(hydrateFavorites, []);

  return { hydrated, isFavorite, toggleFavorite: () => toggle(slug) };
};

/**
 * The saved slugs, read from localStorage on mount. hydrated stays false
 * until then, so a caller can tell "not read yet" from "none saved".
 */
export const useFavoriteSlugs = () => {
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const slugs = useFavoritesStore((state) => state.slugs);

  useEffect(hydrateFavorites, []);

  return { hydrated, slugs };
};
