"use client";
import MinusIcon from "@/shared/ui/icons/MinusIcon";
import PlusIcon from "@/shared/ui/icons/PlusIcon";
import { MAX_QUANTITY } from "@/entities/cart/model/constants";
import { useCartStore } from "@/entities/cart/model/store";

type EditCartQuantityCounterProps = {
  /* The cart product whose quantity is changed. */
  id: string;
  /* Extra classes for the wrapper. */
  className?: string;
};

/**
 * Minus / count / plus for one cart product, between 1 and MAX_QUANTITY.
 */
export default function EditCartQuantityCounter({
  id,
  className = "",
}: EditCartQuantityCounterProps) {
  const count = useCartStore(
    (state) => state.items.find((item) => item.id === id)?.quantity ?? 0
  );
  const increase = useCartStore((state) => state.increaseQuantity);
  const decrease = useCartStore((state) => state.decreaseQuantity);

  const isMin = count <= 1;
  const isMax = count >= MAX_QUANTITY;

  return (
    <div
      className={`flex items-center justify-between w-[65px] lg:w-[77px] h-fit ${className}`}
    >
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center rounded-full enabled:active:scale-95 transition duration-300 ease-out"
        onClick={() => decrease(id)}
        disabled={isMin}
        aria-label="minus"
      >
        <MinusIcon
          className="size-5 lg:size-6 transition duration-300 ease-out"
          iconColor={isMin ? "#494949" : "white"}
          bgColor={isMin ? "white" : "#494949"}
        />
      </button>
      <span className="text-[12px] lg:text-[15px] font-medium leading-[120%]">
        {count}
      </span>
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center rounded-full enabled:active:scale-95 transition duration-300 ease-out"
        onClick={() => increase(id)}
        disabled={isMax}
        aria-label="plus"
      >
        <PlusIcon
          className="size-5 lg:size-6 transition duration-300 ease-out"
          iconColor={isMax ? "#494949" : "white"}
          bgColor={isMax ? "white" : "#494949"}
        />
      </button>
    </div>
  );
}
