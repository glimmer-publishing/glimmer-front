"use client";
import { ReactNode } from "react";
import Link from "next/link";
import MainButton from "@/shared/ui/main-button/MainButton";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import { trackBeginCheckout } from "@/utils/ecommerceTracking";
import { useCartQuote } from "../api/useCartQuote";
import { formatHryvnia, toHryvnia } from "../lib/money";
import { toTrackedItems } from "../lib/tracking";

interface CartTotalProps {
  /* "cart" links to checkout; "checkout" shows the action slot instead. */
  variant?: "cart" | "checkout";
  /* Called when the checkout link is followed, to close the cart modal. */
  onNavigate?: () => void;
  /* The checkout variant's submit button. */
  action?: ReactNode;
}

/**
 * The server's total and promo saving for the current cart, with the next
 * step: a link to checkout, or the action the checkout form passes.
 */
export default function CartTotal({
  variant = "cart",
  onNavigate,
  action,
}: CartTotalProps) {
  const { quote, items } = useCartQuote();
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
          Безкоштовна доставка від 1500 грн
        </p>
        {variant === "cart" && (
          <Link href="/checkout" onClick={onNavigate}>
            <MainButton
              onClick={() =>
                quote &&
                trackBeginCheckout(
                  toTrackedItems(quote.lines),
                  toHryvnia(total)
                )
              }
              disabled={!items.length}
              className="w-full h-[45px]"
            >
              Оформити замовлення
            </MainButton>
          </Link>
        )}
        {variant === "checkout" && action}
      </div>
    </>
  );
}
