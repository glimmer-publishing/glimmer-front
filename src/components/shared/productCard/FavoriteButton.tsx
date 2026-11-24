"use client";
import EmptyHeartIcon from "@/components/shared/icons/EmptyHeartIcon";
import { useFavorite } from "@/entities/favorite/model/useFavorite";

interface FavoriteButtonProps {
  /* Slug of the product the heart saves. */
  slug: string;
  /* Extra classes for the button. */
  className?: string;
}

export default function FavoriteButton({
  slug,
  className = "",
}: FavoriteButtonProps) {
  const { hydrated, isFavorite, toggleFavorite } = useFavorite(slug);

  if (!hydrated) return null;

  return (
    <button
      onClick={toggleFavorite}
      aria-label="add to favorites"
      className={`group cursor-pointer flex items-center justify-center shrink-0 active:scale-95 will-change-transform transition duration-300 ease-in-out ${className}`}
    >
      <EmptyHeartIcon
        className={`w-auto h-5 lg:h-[25px] ${
          isFavorite
            ? "text-main xl:hover:brightness-110 focus-visible:brightness-110"
            : "text-white xl:group-hover:text-main focus-visible:text-main"
        } transition duration-300 ease-in-out`}
      />
    </button>
  );
}
