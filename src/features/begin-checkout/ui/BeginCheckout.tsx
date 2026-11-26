"use client";
import Link from "next/link";
import { useFetchCartQuote } from "@/entities/cart/hooks/useFetchCartQuote";
import { toHryvnia } from "@/entities/cart/lib/money";
import { toTrackedItems } from "@/entities/cart/lib/tracking";
import { trackBeginCheckout } from "@/shared/lib/analytics/ecommerceTracking";
import MainButton from "@/shared/ui/main-button/MainButton";

type BeginCheckoutProps = {
  /* Called when the link is followed, to close the cart modal. */
  onNavigate?: () => void;
};

/**
 * "Оформити замовлення" from the cart: goes to checkout and reports
 * begin_checkout with the server's quote. Disabled for an empty cart.
 */
export default function BeginCheckout({ onNavigate }: BeginCheckoutProps) {
  const { quote, items } = useFetchCartQuote();

  return (
    <Link href="/checkout" onClick={onNavigate}>
      <MainButton
        onClick={() =>
          quote &&
          trackBeginCheckout(
            toTrackedItems(quote.lines),
            toHryvnia(quote.total)
          )
        }
        disabled={!items.length}
        className="w-full h-[45px]"
      >
        Оформити замовлення
      </MainButton>
    </Link>
  );
}
