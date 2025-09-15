"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import MainButton from "../buttons/MainButton";
import { useCartStore } from "@/store/cartStore";
import MarqueeLine from "../marquee/MarqueeLine";

interface CartTotalProps {
  isPopUpShown?: boolean;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  variant?: "cart" | "checkout";
  disabled?: boolean;
  isLoading?: boolean;
}

export default function CartTotal({
  isPopUpShown,
  setIsPopUpShown,
  variant = "cart",
  disabled = false,
  isLoading = false,
}: CartTotalProps) {
  const [total, setTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);

  const { cart, getCartTotal, getPromoDiscountTotal } = useCartStore();

  const sum = getCartTotal();
  const promodIscountTotal = getPromoDiscountTotal();

  useEffect(() => {
    setTotal(sum);
    setDiscountTotal(promodIscountTotal);
  }, [sum, promodIscountTotal]);

  return (
    <>
      {variant === "checkout" || isPopUpShown ? (
        <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-visible">
          <MarqueeLine />
        </div>
      ) : null}
      <div
        className={`flex flex-col gap-4 py-4 ${variant === "cart" ? "px-6" : ""}`}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-[12px] lg:text-[15px] font-medium leading-[120%]">
            Загальна вартість
          </p>
          <p className="text-[12px] lg:text-[15px] font-medium leading-[120%]">
            {total}&nbsp;грн
          </p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="">Загальна сума знижки</p>
          <p className="text-[12px] lg:text-[15px] font-medium leading-[120%] text-accent">
            {discountTotal}&nbsp;грн
          </p>
        </div>
        <p className="text-[10px] lg:text-[12px] font-normal leading-[120%] text-black/60">
          Безкоштовна доставка від 1500 грн
        </p>
        {variant === "cart" ? (
          <Link
            href="/checkout"
            onClick={setIsPopUpShown ? () => setIsPopUpShown(false) : undefined}
          >
            <MainButton disabled={!cart?.length} className="w-full h-[45px]">
              Оформити замовлення
            </MainButton>
          </Link>
        ) : (
          <MainButton
            type="submit"
            disabled={disabled}
            isLoading={isLoading}
            loadingText="Надсилання..."
            className="h-[45px]"
          >
            Оформити замовлення
          </MainButton>
        )}
      </div>
    </>
  );
}
