"use client";
import { useRef, useState } from "react";
import { useCartStore } from "@/entities/cart/model/store";
import type { Product } from "@/entities/product/model/product";
import { toTrackedItem } from "@/entities/product/lib/toTrackedItem";
import { trackAddToCart } from "@/shared/lib/ecommerceTracking";

/* How long the cover flies before the product lands in the cart. */
const FLIGHT_MS = 800;

/* One flight in progress, as AddToCartAnimation draws it. */
export interface Flight {
  animationKey: number;
  startPos: { top: number; left: number };
  image: string;
}

/**
 * Adds a product to the cart with the cover flying from the button to the
 * header cart first. Every buy button uses it, so the start position and
 * timing cannot drift between them. Attach buttonRef to the button, call
 * addToCart on click, and render AddToCartAnimation while flight is set.
 */
export const useAddToCartFlight = (product: Product, quantity = 1) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const [flight, setFlight] = useState<Flight | null>(null);

  const addToCart = () => {
    const button = buttonRef.current;
    if (!button) return;

    /* AddToCartAnimation adds the scroll back, so the flight starts here. */
    const rect = button.getBoundingClientRect();
    setFlight({
      animationKey: Date.now(),
      startPos: {
        top: rect.top - window.scrollY,
        left: rect.left - window.scrollX,
      },
      image: product.mainImage,
    });

    setTimeout(() => {
      setFlight(null);
      addItem(product.id, quantity);
    }, FLIGHT_MS);

    trackAddToCart(toTrackedItem(product, quantity));
  };

  return { buttonRef, addToCart, flight };
};
