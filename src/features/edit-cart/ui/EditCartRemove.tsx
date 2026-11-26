"use client";
import { useCartStore } from "@/entities/cart/model/store";
import IconButton from "@/shared/ui/icon-button/IconButton";
import TrashIcon from "@/shared/ui/icons/TrashIcon";

type EditCartRemoveProps = {
  /* The cart product removed. */
  id: string;
  /* Extra classes for the button. */
  className?: string;
};

/**
 * Trash button that removes one product from the cart.
 */
export default function EditCartRemove({ id, className }: EditCartRemoveProps) {
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <IconButton handleClick={() => removeItem(id)} className={className}>
      <TrashIcon />
    </IconButton>
  );
}
