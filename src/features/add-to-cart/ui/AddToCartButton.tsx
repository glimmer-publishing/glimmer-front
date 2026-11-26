"use client";
import MainButton from "@/shared/ui/main-button/MainButton";
import { Product } from "@/entities/product/model/product";
import { useAddToCartFlight } from "../model/useAddToCartFlight";
import AddToCartAnimation from "./AddToCartAnimation";

interface AddToCartButtonProps {
  /* The product added. */
  product: Product;
  /* How many copies are added. */
  count?: number;
  /* Extra classes for the button. */
  className?: string;
}

/**
 * Product-page buy button, full width: "Купити" for books in stock,
 * "Передзамовлення" otherwise. Adds count copies after the cover flies to
 * the cart.
 */
export default function AddToCartButton({
  product,
  count = 1,
  className,
}: AddToCartButtonProps) {
  const { buttonRef, addToCart, flight } = useAddToCartFlight(product, count);

  return (
    <>
      <MainButton
        ref={buttonRef}
        onClick={addToCart}
        className={`h-[45px] lg:max-w-[180px] ${className || ""}`}
      >
        {product.status === "inStock" ? "Купити" : "Передзамовлення"}
      </MainButton>

      {!!flight && <AddToCartAnimation {...flight} />}
    </>
  );
}
