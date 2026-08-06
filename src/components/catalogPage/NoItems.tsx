import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface NoItemsProps {
  message?: string;
}

export default function NoItems({
  message = "В даній категорії ще немає товарів",
}: NoItemsProps) {
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
