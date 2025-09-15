"use client";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInAnimation, cartItemVariants } from "@/utils/animationVariants";
import CartListItem from "./CartListItem";

interface CartListProps {
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "cart" | "checkout";
}

export default function CartList({
  setIsPopUpShown,
  className = "",
  variant = "cart",
}: CartListProps) {
  const { cart, clearCart } = useCartStore();

  function getProductWord(count: number) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
      return "товари";
    return "товарів";
  }

  return (
    <AnimatePresence mode="wait">
      {cart?.length ? (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInAnimation({ y: 20, delay: 0.6 })}
          className="flex items-center justify-between  mb-4"
        >
          <p className="text-[12px] font-light leading-[120%] text-black/60">
            {cart?.length} {getProductWord(cart?.length)}
          </p>
          <button
            onClick={() => clearCart()}
            type="button"
            className="cursor-pointer text-[12px] font-light leading-[120%] text-black/60 active:text-main focus-visible:text-main 
                    xl:hover:text-main transition duration-300 ease-in-out"
          >
            Видалити все
          </button>
        </motion.div>
      ) : null}
      {cart.length > 0 ? (
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
            {cart.map((cartItem, idx) => (
              <motion.li
                variants={cartItemVariants}
                key={`${variant}-${cartItem?.product?.id ?? `${variant}-idx-${idx}`}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className=""
              >
                <CartListItem
                  cartItem={cartItem}
                  setIsPopUpShown={setIsPopUpShown}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
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
