"use client";
import { Dispatch, SetStateAction } from "react";
import MinusIcon from "@/shared/ui/icons/MinusIcon";
import PlusIcon from "@/shared/ui/icons/PlusIcon";
import { MAX_QUANTITY } from "@/entities/cart/model/constants";

interface CounterProps {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  className?: string;
}

export default function Counter({
  count,
  setCount,
  className = "",
}: CounterProps) {
  const onMinusClick = () => {
    setCount(count - 1);
  };

  const onPlusClick = () => {
    setCount(count + 1);
  };

  return (
    <div
      className={`flex items-center justify-between w-[91px] lg:w-[136px] h-fit ${className}`}
    >
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center rounded-full enabled:active:scale-95 transition duration-300 ease-out"
        onClick={onMinusClick}
        disabled={count === 1}
        aria-label="minus"
      >
        <MinusIcon
          className="size-6 lg:size-10 transition duration-300 ease-out"
          iconColor={count === 1 ? "#494949" : "white"}
          bgColor={count === 1 ? "white" : "#494949"}
        />
      </button>
      <span className="text-[18px] lg:text-[24px] font-medium leading-[120%]">
        {count}
      </span>
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center rounded-full enabled:active:scale-95 transition duration-300 ease-out"
        onClick={onPlusClick}
        disabled={count >= MAX_QUANTITY}
        aria-label="plus"
      >
        <PlusIcon
          className="size-6 lg:size-10 transition duration-300 ease-out"
          iconColor={count >= MAX_QUANTITY ? "#494949" : "white"}
          bgColor={count >= MAX_QUANTITY ? "white" : "#494949"}
        />
      </button>
    </div>
  );
}
