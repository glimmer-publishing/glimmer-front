"use client";
import { useState } from "react";
import Counter from "./Counter";
import FavoriteButton from "./FavoriteButton";
import { Product } from "@/types/product";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import AddToCartButton from "./AddToCartButton";
import { formatDate } from "@/utils/formatDate";

interface OrderProductProps {
  currentProduct: Product;
}

export default function OrderProduct({ currentProduct }: OrderProductProps) {
  const [count, setCount] = useState(1);

  const { price, discountPrice, preOrderShippingDate, status } = currentProduct;

  const formattedPreOrderShippingDate = preOrderShippingDate
    ? formatDate(preOrderShippingDate)
    : null;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ y: 20 })}
      className="py-4 lg:py-6 border-t border-b border-black/60"
    >
      <div className="flex justify-between mb-4 lg:mb-[18px]">
        {discountPrice && discountPrice < price ? (
          <div className="flex flex-col lg:gap-2 shrink-0">
            <span className="line-through">{price} грн</span>
            <div className="flex items-end gap-4">
              <span className="text-[20px] lg:text-[32px] font-semibold leading-[120%] text-accent">
                {discountPrice} грн
              </span>
              <div className="p-1 text-[18px] lg:text-[24px] font-semibold leading-[120%] text-white bg-accent rounded-[12px]">
                {Math.round(((discountPrice - price) / price) * 100)}%
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[20px] lg:text-[32px] font-semibold shrink-0 leading-none">
            {price} грн
          </p>
        )}
        <Counter count={count} setCount={setCount} />
      </div>
      <div className="flex justify-between gap-4">
        <FavoriteButton currentProduct={currentProduct} />

        <AddToCartButton
          product={currentProduct}
          count={count}
          className="h-[45px] lg:max-w-[180px]"
        />
      </div>
      {status === "preOrder" && formattedPreOrderShippingDate ? (
        <p className="mt-1 mr-2 text-[10px] font-normal leading-[120%] text-accent text-right">
          Відправка з {formattedPreOrderShippingDate}
        </p>
      ) : null}
    </motion.div>
  );
}
