"use client";
import { productToSnapshot } from "@/entities/cart/lib/snapshots";
import { useCartStore } from "@/entities/cart/model/store";
import type { PricedLine } from "@/entities/cart/model/types";
import { toTrackedItem } from "@/entities/product/lib/toTrackedItem";
import { trackAddToCart } from "@/shared/lib/analytics/ecommerceTracking";
import { useFetchCheckoutRecommendations } from "../hooks/useFetchCheckoutRecommendations";
import CheckoutRecommendedItem from "./CheckoutRecommendedItem";
import CheckoutSubtitle from "./CheckoutSubtitle";

type CheckoutRecommendationsProps = {
  /* The cart as the server priced it. */
  lines: PricedLine[];
};

/**
 * "Рекомендовані товари": up to two products to add from checkout, each
 * added with one click and reported to analytics. Nothing renders when
 * there is nothing to suggest.
 */
export default function CheckoutRecommendations({
  lines,
}: CheckoutRecommendationsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const products = useFetchCheckoutRecommendations(lines);

  if (!products.length) return null;

  return (
    <div className="py-3 px-2.5 md:p-6 mt-6 rounded-[12px] bg-main/40">
      <CheckoutSubtitle>Рекомендовані товари</CheckoutSubtitle>
      <ul className="flex flex-col gap-4">
        {products.map((product) => (
          <CheckoutRecommendedItem
            key={product.id}
            product={product}
            onAddToCart={() => {
              addItem(product.id, 1, productToSnapshot(product));
              trackAddToCart(toTrackedItem(product, 1));
            }}
          />
        ))}
      </ul>
    </div>
  );
}
