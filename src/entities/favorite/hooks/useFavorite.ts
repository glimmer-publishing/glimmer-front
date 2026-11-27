"use client";
import { useEffect } from "react";
import type { Product } from "@/entities/product/model/product";
import { hydrateFavorites, useFavoritesStore } from "../model/store";

/* Whether one book is a favorite in this browser, and a toggle for it. */
export const useFavorite = (product: Product) => {
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const isFavorite = useFavoritesStore((state) =>
    state.slugs.includes(product.slug)
  );
  const toggle = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(hydrateFavorites, []);

  return { hydrated, isFavorite, toggleFavorite: () => toggle(product) };
};

/**
 * The saved slugs and their snapshots, read from localStorage on mount.
 * hydrated stays false until then, so a caller can tell "not read yet" from
 * "none saved".
 */
export const useFavoriteSlugs = () => {
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const slugs = useFavoritesStore((state) => state.slugs);
  const snapshots = useFavoritesStore((state) => state.snapshots);
  const saveSnapshots = useFavoritesStore((state) => state.saveSnapshots);

  useEffect(hydrateFavorites, []);

  return { hydrated, slugs, snapshots, saveSnapshots };
};
