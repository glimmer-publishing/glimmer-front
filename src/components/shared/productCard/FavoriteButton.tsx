"use client";
import { useState, useEffect } from "react";
import EmptyHeartIcon from "../icons/EmptyHeartIcon";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Product } from "@/types/product";

interface FavoriteButtonProps {
  currentProduct: Product;
  className?: string;
}

export default function FavoriteButton({
  currentProduct,
  className = "",
}: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const toggleFavorite = () => {
    if (isFavorite(currentProduct.slug)) {
      removeFavorite(currentProduct.slug);
    } else {
      addFavorite(currentProduct);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      aria-label="add to favorites"
      className={`group cursor-pointer flex items-center justify-center shrink-0 active:scale-95 will-change-transform transition duration-300 ease-in-out ${className}`}
    >
      <EmptyHeartIcon
        className={`w-auto h-5 lg:h-[25px] ${
          isFavorite(currentProduct.slug)
            ? "text-main xl:hover:brightness-110 focus-visible:brightness-110"
            : "text-white xl:group-hover:text-main focus-visible:text-main"
        } transition duration-300 ease-in-out`}
      />
    </button>
  );
}
