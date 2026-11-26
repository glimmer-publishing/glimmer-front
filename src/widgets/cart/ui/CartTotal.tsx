"use client";
import { ReactNode } from "react";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import { useCartQuote } from "@/entities/cart/api/useCartQuote";
import { formatHryvnia } from "@/entities/cart/lib/money";
import { FREE_DELIVERY_FROM } from "@/entities/cart/model/constants";

interface CartTotalProps {
  /* "cart" pads the block for the modal; "checkout" sits in the form. */
  variant?: "cart" | "checkout";
  /* The next step: the checkout link, or the form's submit button. */
  action?: ReactNode;
}

/**
 * The server's total and promo saving for the current cart, with the next
 * step passed in as action.
 */
export default function CartTotal({
  variant = "cart",
  action,
}: CartTotalProps) {
  const { quote } = useCartQuote();
  const total = quote?.total ?? 0;

  return (
    <>
      <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-visible">
        <MarqueeLine />
      </div>
      <div
        className={`flex flex-col gap-4 py-4 ${variant === "cart" ? "px-6" : ""}`}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-[12px] lg:text-[15px] font-medium leading-[120%]">
            Загальна вартість
          </p>
          <p className="text-[12px] lg:text-[15px] font-medium leading-[120%]">
            {formatHryvnia(total)}&nbsp;грн
          </p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="">Загальна сума знижки</p>
          <p className="text-[12px] lg:text-[15px] font-medium leading-[120%] text-accent">
            {formatHryvnia(quote?.promoDiscountTotal ?? 0)}&nbsp;грн
          </p>
        </div>
        <p className="text-[10px] lg:text-[12px] font-normal leading-[120%] text-black/60">
          Безкоштовна доставка від {formatHryvnia(FREE_DELIVERY_FROM)} грн
        </p>
        {action}
      </div>
    </>
  );
}
