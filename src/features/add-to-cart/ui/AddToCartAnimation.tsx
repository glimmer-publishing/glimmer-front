"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import { CART_BUTTON_ID } from "@/entities/cart/model/constants";

interface AddToCartAnimationProps {
  /* Viewport position of the product image the flight starts from. */
  startPos: { top: number; left: number };
  /* Changes with every click, so a repeated add starts a new flight. */
  animationKey: number;
  /* URL of the product image that flies to the cart. */
  image: string;
}

interface FlyingImageProps extends AddToCartAnimationProps {
  /* Viewport position of the cart icon the flight ends at. */
  endPos: { top: number; left: number };
}

const OFFSET_X = -10;
const OFFSET_Y = -15;

/**
 * The product image shrinking and fading on its way to the cart icon.
 */
function FlyingImage({
  startPos,
  endPos,
  animationKey,
  image,
}: FlyingImageProps) {
  return (
    <motion.div
      key={animationKey}
      className="fixed z-[100] pointer-events-none"
      style={{
        top: startPos.top + window.scrollY,
        left: startPos.left + window.scrollX,
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        scale: 0.2,
        y: endPos.top - (startPos.top + window.scrollY),
        x: endPos.left - (startPos.left + window.scrollX),
        opacity: 0.2,
        transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.4, 1] },
      }}
    >
      <div className="relative w-[50px] lg:w-[70px] h-[50px] lg:h-[70px] overflow-hidden rounded-[12px]">
        <Image
          src={image}
          alt="product image"
          fill
          sizes="70px"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
}

/**
 * Flies the product image from the card to the header cart icon, rendered
 * into document.body. Nothing renders when the cart icon is not on screen.
 */
export default function AddToCartAnimation(props: AddToCartAnimationProps) {
  const cartRect = document
    .getElementById(CART_BUTTON_ID)
    ?.getBoundingClientRect();

  if (!cartRect) return null;

  const endPos = {
    top: cartRect.top + OFFSET_Y,
    left: cartRect.left + OFFSET_X,
  };

  return createPortal(
    <FlyingImage {...props} endPos={endPos} />,
    document.body
  );
}
