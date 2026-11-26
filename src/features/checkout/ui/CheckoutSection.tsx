import { ReactNode } from "react";
import { motion } from "framer-motion";
import { listItemVariants } from "@/shared/lib/animation/animationVariants";
import CheckoutSubtitle from "./CheckoutSubtitle";

/* The default card look; a section may replace it. */
const CARD_CLASS =
  "py-9 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm";

type CheckoutSectionProps = {
  /* The section heading. */
  title: string;
  /* The section's fields. */
  children: ReactNode;
  /* Replaces the card classes. */
  className?: string;
};

/**
 * One titled card of the checkout form, staggered in by its column.
 */
export default function CheckoutSection({
  title,
  children,
  className = CARD_CLASS,
}: CheckoutSectionProps) {
  return (
    <motion.div
      viewport={{ once: true, amount: 0.2 }}
      variants={listItemVariants}
      className={className}
    >
      <CheckoutSubtitle>{title}</CheckoutSubtitle>
      {children}
    </motion.div>
  );
}
