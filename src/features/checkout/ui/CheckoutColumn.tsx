"use client";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { listVariants } from "@/shared/lib/animation/animationVariants";

type CheckoutColumnProps = {
  /* The column's sections, staggered in one after another. */
  children: ReactNode;
  /* Width, spacing and card classes of the column. */
  className: string;
};

/**
 * One half of the checkout form that staggers its sections in once it
 * scrolls into view.
 */
export default function CheckoutColumn({
  children,
  className,
}: CheckoutColumnProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={listVariants({ staggerChildren: 0.2, delayChildren: 0.4 })}
      className={className}
    >
      {children}
    </motion.div>
  );
}
