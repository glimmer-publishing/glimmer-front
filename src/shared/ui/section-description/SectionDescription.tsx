import { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

type SectionDescriptionProps = {
  /* The content. */
  children?: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * The short text beside a section or page title.
 */
export default function SectionDescription({
  children,
  className,
}: SectionDescriptionProps) {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.8 }}
      variants={fadeInAnimation({ x: 30 })}
      className={twMerge(
        clsx(
          `lg:max-w-[338px] text-[12px] lg:text-[15px] leading-[120%] font-light`
        ),
        className
      )}
    >
      {children}
    </motion.p>
  );
}
