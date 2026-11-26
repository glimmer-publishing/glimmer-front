"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "@/shared/ui/loader/Loader";
import {
  cartItemVariants,
  fadeInAnimation,
} from "@/shared/lib/animationVariants";
import { useCartQuote } from "@/entities/cart/api/useCartQuote";
import { useCartStore } from "@/entities/cart/model/store";
import ClearCart from "@/features/edit-cart/ui/ClearCart";
import CartLine from "./CartLine";

interface CartListProps {
  /* Called when a product link is followed, to close the cart modal. */
  onNavigate?: () => void;
  /* Extra classes for the scrolling list. */
  className?: string;
  /* Where the list is shown; only spacing differs. */
  variant?: "cart" | "checkout";
}

const getProductWord = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return "товари";
  return "товарів";
};

/**
 * The cart's products as the server priced them. Products that no longer
 * exist are dropped from the cart once the server reports them.
 */
export default function CartList({
  onNavigate,
  className = "",
  variant = "cart",
}: CartListProps) {
  const { quote, items, hydrated, isError } = useCartQuote();
  const removeItems = useCartStore((state) => state.removeItems);

  const missingKey = quote?.missingIds.join("\n") ?? "";
  useEffect(() => {
    if (missingKey) removeItems(missingKey.split("\n"));
  }, [missingKey, removeItems]);

  if (!hydrated) return null;

  const count = items.length;
  const lines = quote?.lines ?? [];

  return (
    <AnimatePresence mode="wait">
      {!!count && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInAnimation({ y: 20, delay: 0.6 })}
          className="flex items-center justify-between  mb-4"
        >
          <p className="text-[12px] font-light leading-[120%] text-black/60">
            {count} {getProductWord(count)}
          </p>
          <ClearCart />
        </motion.div>
      )}
      {!!count && !quote && !isError && (
        <Loader key="loading" className={`h-[120px] ${className}`} />
      )}
      {!!count && !quote && isError && (
        <p
          key="error"
          className="py-6 text-center text-[12px] lg:text-[15px] text-black/60"
        >
          Не вдалося завантажити кошик. Спробуй оновити сторінку.
        </p>
      )}
      {!!count && !!quote && (
        <motion.ul
          layout
          key={variant}
          initial="hidden"
          animate="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInAnimation({ y: 20, delay: 0.8 })}
          className={`flex flex-col gap-y-4 py-0.5 pr-1.5 overflow-x-hidden overflow-y-auto
           scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-main/50
           scrollbar-track-transparent ${className}`}
        >
          <AnimatePresence mode="sync">
            {lines.map((line) => (
              <motion.li
                variants={cartItemVariants}
                key={`${variant}-${line.id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <CartLine line={line} onNavigate={onNavigate} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      {!count && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay: 0.4 },
          }}
          exit={{
            opacity: 0,
            y: 20,
            transition: { duration: 0.3 },
          }}
          className={`flex justify-center items-center text-[14px] lg:text-[18px] font-normal leading-[120%] text-center text-black/50  ${variant === "cart" ? "py-25" : "py-6"}`}
        >
          Твій кошик порожній
        </motion.div>
      )}
    </AnimatePresence>
  );
}
