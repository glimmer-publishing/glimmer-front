"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";

interface AddToCartAnimationProps {
  startPos: { top: number; left: number };
  animationKey: number;
  image: string;
}

export default function AddToCartAnimation({
  startPos,
  animationKey,
  image,
}: AddToCartAnimationProps) {
  const cartButton = document.getElementById("cart-button");
  const cartRect = cartButton?.getBoundingClientRect();

  if (!cartRect) return null;

  const OFFSET_X = -10;
  const OFFSET_Y = -15;

  const endTop = cartRect.top + OFFSET_Y;
  const endLeft = cartRect.left + OFFSET_X;

  const animation = (
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
        y: endTop - (startPos.top + window.scrollY),
        x: endLeft - (startPos.left + window.scrollX),
        opacity: 0.2,
        transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.4, 1] },
      }}
    >
      <div className="relative w-[50px] lg:w-[70px] h-[50px] lg:h-[70px] overflow-hidden rounded-[12px]">
        <Image
          src={image}
          alt="product image"
          fill
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );

  return createPortal(animation, document.body);
}
