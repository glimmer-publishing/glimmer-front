"use client";
import { useFavorite } from "@/entities/favorite/hooks/useFavorite";
import type { Product } from "@/entities/product/model/product";
import EmptyHeartIcon from "@/shared/ui/icons/EmptyHeartIcon";

type ToggleFavoriteProps = {
  /* The product the heart saves; kept to draw the favorites page at once. */
  product: Product;
  /* "card": a bare heart on a product card; "large": a 45 px bordered box. */
  size?: "card" | "large";
  /* Extra classes for the button. */
  className?: string;
};

/* Button classes per size: on a product card or on the product page. */
const BUTTON_CLASSES = {
  card: "group cursor-pointer flex items-center justify-center shrink-0 active:scale-95 will-change-transform transition duration-300 ease-in-out",
  large:
    "cursor-pointer group size-[45px] rounded-[12px] border shrink-0 flex items-center justify-center active:scale-95 transition duration-300 ease-in-out will-change-transform",
};

/* Icon classes per size. */
const ICON_CLASSES = {
  card: "w-auto h-5 lg:h-[25px]",
  large: "w-[25px] h-auto",
};

/**
 * Heart that saves a product to favorites or removes it, card-sized or
 * product-page sized. Renders nothing until the saved slugs are read, so it
 * never shows the wrong state.
 */
export default function ToggleFavorite({
  product,
  size = "card",
  className = "",
}: ToggleFavoriteProps) {
  const { hydrated, isFavorite, toggleFavorite } = useFavorite(product);

  if (!hydrated) return null;

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label="add to favorites"
      className={`${BUTTON_CLASSES[size]} ${className}`}
    >
      <EmptyHeartIcon
        className={`${ICON_CLASSES[size]} ${
          isFavorite
            ? "text-main xl:hover:brightness-110 focus-visible:brightness-110"
            : "text-white xl:group-hover:text-main focus-visible:text-main"
        } transition duration-300 ease-in-out`}
      />
    </button>
  );
}
