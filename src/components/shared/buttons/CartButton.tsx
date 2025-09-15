"use client";
import CartIcon from "../icons/CartIcon";
import { useCartStore } from "@/store/cartStore";

interface CartButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function CartButton({ onClick, className }: CartButtonProps) {
  const { cart } = useCartStore();

  return (
    <>
      <button
      type="button"
        id="cart-button"
        onClick={onClick}
        className={`enabled:cursor-pointer relative flex items-center justify-center size-6 text-white
        enabled:xl:hover:text-main enabled:focus-visible:text-main enabled:active:text-main enabled:active:scale-95
         will-change-transform transition duration-300 ease-in-out ${className}`}
      >
        <CartIcon />
        {cart?.length > 0 ? (
          <div className="absolute -top-0.5 -right-1.5 flex items-center justify-center w-4 h-4 text-white rounded-full bg-main">
            <p className="text-[10px] font-medium leading-[90%]">
              {cart?.length}
            </p>
          </div>
        ) : null}
      </button>
    </>
  );
}
