import * as motion from "motion/react-client";
import {
  fadeInAnimation,
  listVariants,
  listItemVariants,
} from "@/utils/animationVariants";
import Link from "next/link";
import { getSeriesHref, SERIES_FEATURE } from "@/utils/getSeriesInfo";

interface FeaturesProps {
  features: { featureName: string; value: string }[];
}

export default function Features({ features }: FeaturesProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({})}
      className="py-4 lg:py-6 border-t border-black/60"
    >
      <motion.h3
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="mb-4 text-[14px] lg:text-[18px] font-medium leading-[120%]"
      >
        Характеристики
      </motion.h3>
      <motion.ul
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={listVariants({
          staggerChildren: 0.15,
          delayChildren: 0.15,
        })}
        className="flex flex-col gap-3"
      >
        {features.map(({ featureName, value }, idx) => (
          <motion.li
            viewport={{ once: true, amount: 0.2 }}
            variants={listItemVariants}
            key={idx}
            className="flex items-baseline"
          >
            <p className="shrink-0">{featureName}</p>
            <div className="w-full mx-0.5 border-b border-dashed border-black/60" />
            {featureName === SERIES_FEATURE && value?.trim() ? (
              /* Capped width: a long series name wraps inside it instead of
                 pushing the row off screen. */
              <Link
                href={getSeriesHref(value)}
                aria-label={`${value}: переглянути всі книги серії`}
                className="shrink-0 max-w-[60%] text-right break-words underline underline-offset-2 transition duration-300 ease-out xl:hover:text-main focus-visible:text-main active:text-main outline-none"
              >
                {value}
              </Link>
            ) : (
              <p className="shrink-0">{value}</p>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
