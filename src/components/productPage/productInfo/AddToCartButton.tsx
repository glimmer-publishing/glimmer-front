"use client";
import { useRef, useState } from "react";
import MainButton from "@/components/shared/buttons/MainButton";
import AddToCartAnimation from "@/components/shared/addToCartAnimation/AddToCartAnimation";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { sendGTMEvent } from "@next/third-parties/google";

interface AddToCartButtonProps {
  product: Product;
  count?: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  count = 1,
  className,
}: AddToCartButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { addToCart } = useCartStore();

  const [animationKey, setAnimationKey] = useState<number | null>(null);
  const [startPos, setStartPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [animatingImage, setAnimatingImage] = useState<string | null>(null);

  const { status } = product;

  const handleAddToCart = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setStartPos({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setAnimatingImage(product.mainImage);

    const key = Date.now();
    setAnimationKey(key);

    setTimeout(() => {
      setAnimationKey(null);
      addToCart(product, count);
    }, 800);

    sendGTMEvent({ event: "AddToCart" });
  };

  return (
    <>
      <MainButton
        ref={buttonRef}
        onClick={handleAddToCart}
        className={`h-[45px] lg:max-w-[180px] ${className || ""}`}
      >
        {status === "inStock" ? "Купити" : "Передзамовлення"}
      </MainButton>

      {animationKey && startPos && animatingImage && (
        <AddToCartAnimation
          startPos={startPos}
          animationKey={animationKey}
          image={animatingImage}
        />
      )}
    </>
  );
}
