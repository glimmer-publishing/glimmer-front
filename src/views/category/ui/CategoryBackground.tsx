import Image from "next/image";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animationVariants";

/**
 * Faint decorative art behind long category lists (xl only).
 */
export default function CategoryBackground() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInAnimation({ scale: 0.9 })}
      className="hidden xl:block absolute top-[940px] left-[-536px] opacity-10 -z-10"
    >
      <Image
        src="/images/catalogPage/bgImage.svg"
        alt="background"
        width="784"
        height="739"
        className="opacity-10"
      />
    </motion.div>
  );
}
