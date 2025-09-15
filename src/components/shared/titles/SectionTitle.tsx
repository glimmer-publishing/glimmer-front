import { ReactNode } from "react";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface SectionTitleProps {
  children?: ReactNode;
  className?: string;
}

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
