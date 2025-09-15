import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface DescriptionProps {
  description: string;
}

export default function Description({ description }: DescriptionProps) {
  return (
    <div>
      <motion.h3
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="mb-4 text-[14px] lg:text-[18px] font-medium leading-[120%]"
      >
        Опис
      </motion.h3>
      <motion.p
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20, delay: 0.2 })}
        className="leading-[150%]"
      >
        {description}
      </motion.p>
    </div>
  );
}
