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
  className,
}: FavoriteButtonProps) {
  const { hydrated, isFavorite, toggleFavorite } = useFavorite(slug);

  if (!hydrated) return null;

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
          isFavorite
            ? "text-main xl:hover:brightness-110 focus-visible:brightness-110"
            : "text-white xl:group-hover:text-main focus-visible:text-main"
        } `}
      />
    </button>
  );
}
