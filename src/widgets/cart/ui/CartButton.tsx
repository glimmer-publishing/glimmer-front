"use client";
import CartIcon from "@/shared/ui/icons/CartIcon";
import { useEffect } from "react";
import { CART_BUTTON_ID } from "@/entities/cart/model/constants";
import { hydrateCart, useCartStore } from "@/entities/cart/model/store";

type CartButtonProps = {
  /* Called on click. */
  onClick?: () => void;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * The header's cart icon with the number of products in the cart.
 */
export default function CartButton({ onClick, className }: CartButtonProps) {
  const count = useCartStore((state) => state.items.length);

  useEffect(hydrateCart, []);

  return (
    <>
      <button
        type="button"
        id={CART_BUTTON_ID}
        onClick={onClick}
        className={`enabled:cursor-pointer relative flex items-center justify-center size-6 text-white
        enabled:xl:hover:text-main enabled:focus-visible:text-main enabled:active:text-main enabled:active:scale-95
         will-change-transform transition duration-300 ease-in-out ${className}`}
      >
        <CartIcon />
        {count > 0 ? (
          <div className="absolute -top-0.5 -right-1.5 flex items-center justify-center w-4 h-4 text-white rounded-full bg-main">
            <p className="text-[10px] font-medium leading-[90%]">{count}</p>
          </div>
        ) : null}
      </button>
    </>
  );
}
