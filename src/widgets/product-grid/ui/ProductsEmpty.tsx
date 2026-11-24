import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface ProductsEmptyProps {
  /* Text to show; defaults to the generic "no products yet" line. */
  message?: string;
}

/**
 * Empty state of a product grid, shown when no product matches.
 */
export default function ProductsEmpty({
  message = "В даній категорії ще немає товарів",
}: ProductsEmptyProps) {
  return (
    <div className="flex flex-col items-center w-full py-[174px] lg:py-[208px]">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ y: 20 })}
        className="text-[14px] lg:text-[18px] font-normal leading-[120%] text-black/50 text-center"
      >
        {message}
      </motion.h2>
    </div>
  );
}
