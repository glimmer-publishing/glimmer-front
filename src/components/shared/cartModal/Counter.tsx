"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types/cartItem";
import MinusIcon from "../icons/MinusIcon";
import PlusIcon from "../icons/PlusIcon";

interface CounterProps {
  cartItem: CartItem;
  className?: string;
}

export default function Counter({ cartItem, className = "" }: CounterProps) {
  const { increaseQuantity, decreaseQuantity, cart } = useCartStore();
  const [count, setCount] = useState(1);

  const getItemCount = (items: CartItem[], itemId: string): number => {
    return items.find((item) => item?.product?.id === itemId)?.quantity || 0;
  };

  const { id } = cartItem?.product;

  useEffect(() => {
    setCount(getItemCount(cart, id));
  }, [cart, id]);

  const onMinusClick = () => {
    decreaseQuantity(id);
    setCount(count - 1);
  };

  const onPlusClick = () => {
    increaseQuantity(id);
    setCount(count + 1);
  };

  return (
    <div
      className={`flex items-center justify-between w-[65px] lg:w-[77px] h-fit ${className}`}
    >
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center rounded-full enabled:active:scale-95 transition duration-300 ease-out"
        onClick={onMinusClick}
        disabled={count === 1}
        aria-label="minus"
      >
        <MinusIcon
          className="size-5 lg:size-6 transition duration-300 ease-out"
          iconColor={count === 1 ? "#494949" : "white"}
          bgColor={count === 1 ? "white" : "#494949"}
        />
      </button>
      <span className="text-[12px] lg:text-[15px] font-medium leading-[120%]">
        {count}
      </span>
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center rounded-full enabled:active:scale-95 transition duration-300 ease-out"
        onClick={onPlusClick}
        disabled={count === 100}
        aria-label="plus"
      >
        <PlusIcon
          className="size-5 lg:size-6 transition duration-300 ease-out"
          iconColor={count === 100 ? "#494949" : "white"}
          bgColor={count === 100 ? "white" : "#494949"}
        />
      </button>
    </div>
  );
}
