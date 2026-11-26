import { ReactNode } from "react";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

type SectionTitleProps = {
  /* The content. */
  children?: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * A section's <h2>.
 */
export default function SectionTitle({
  children,
  className,
}: SectionTitleProps) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.8 }}
      variants={fadeInAnimation({ x: -30 })}
      className={`text-[20px] lg:text-[32px] leading-[120%] font-semibold uppercase text-main ${className}`}
    >
      {children}
    </motion.h2>
  );
}
