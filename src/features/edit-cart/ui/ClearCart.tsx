"use client";
import { useCartStore } from "@/entities/cart/model/store";

/**
 * "Видалити все": empties the cart and drops its promo code.
 */
export default function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <button
      onClick={clearCart}
      type="button"
      className="cursor-pointer text-[12px] font-light leading-[120%] text-black/60 active:text-main focus-visible:text-main 
                    xl:hover:text-main transition duration-300 ease-in-out"
    >
      Видалити все
    </button>
  );
}
