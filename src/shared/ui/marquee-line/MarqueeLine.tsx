"use client";
import Marquee from "react-fast-marquee";
import * as motion from "motion/react-client";
import { headerVariants } from "@/shared/lib/animation/animationVariants";

type MarqueeLineProps = {
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * A strip of "Glimmer" scrolling endlessly across the page.
 */
export default function MarqueeLine({ className = "" }: MarqueeLineProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={headerVariants}
    >
      <Marquee
        autoFill={true}
        speed={100}
        className={`text-white bg-main h-[25px] lg:h-[35px] ${className}`}
      >
        <span className="inline-block mx-[7.5px] text-[12px] lg:text-[15px] leading-none uppercase">
          Glimmer
        </span>
        <span className="inline-block mx-[7.5px] text-[12px] lg:text-[15px] leading-none uppercase">
          Glimmer
        </span>
        <span className="inline-block mx-[7.5px] text-[12px] lg:text-[15px] leading-none uppercase">
          Glimmer
        </span>
      </Marquee>
    </motion.div>
  );
}
