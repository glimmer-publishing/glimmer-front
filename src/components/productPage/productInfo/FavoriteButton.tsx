"use client";
import { useState, useEffect } from "react";
import EmptyHeartIcon from "@/components/shared/icons/EmptyHeartIcon";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Product } from "@/types/product";

interface FavoriteButtonProps {
  currentProduct: Product;
  className?: string;
}

export default function FavoriteButton({
  currentProduct,
  className,
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
      type="button"
      onClick={toggleFavorite}
      aria-label="add to favorites"
      className={`cursor-pointer group size-[45px] rounded-[12px] border shrink-0 flex items-center justify-center active:scale-95 transition 
      duration-300 ease-in-out will-change-transform ${className}`}
    >
      <EmptyHeartIcon
        className={`w-[25px] h-auto transition duration-300 ease-in-out ${
          isFavorite(currentProduct.slug)
            ? "text-main xl:hover:brightness-110 focus-visible:brightness-110"
            : "text-white xl:group-hover:text-main focus-visible:text-main"
        } `}
      />
    </button>
  );
}
