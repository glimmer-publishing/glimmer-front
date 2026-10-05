"use client";
import { HomepageBanner } from "@/types/promoBanner";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import {
  PROMO_BANNER_IMAGE_QUALITY,
  sanityImageLoader,
} from "@/utils/sanityImage";

interface PromoBanner {
  banner: HomepageBanner;
  className?: string;
  idx: string;
}

export default function PromoBanner({
  banner,
  className = "",
  idx,
}: PromoBanner) {
  const { imageSmall, imageLarge, link } = banner;

  /* Rendered at full container width below md and half of it from md (the
     container caps at 1280px minus padding). `sizes` declares twice that, so
     the text is downscaled from a larger file the way it was from the
     original - in practice retina screens get the full-resolution original.
     The variant hidden by CSS is lazy, so it is never fetched. */
  const sizes = "(min-width: 1280px) 1180px, (min-width: 768px) 100vw, 200vw";

  const content = (
    <>
      <Image
        src={imageSmall}
        alt="promo banner"
        width={320}
        height={268}
        loader={sanityImageLoader}
        quality={PROMO_BANNER_IMAGE_QUALITY}
        sizes={sizes}
        className="w-full h-auto xs:hidden"
      />
      <Image
        src={imageLarge}
        alt="promo banner"
        width={320}
        height={268}
        loader={sanityImageLoader}
        quality={PROMO_BANNER_IMAGE_QUALITY}
        sizes={sizes}
        className="w-full h-auto hidden xs:block"
      />
    </>
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ x: idx === "first" ? -30 : 30 })}
      className={`${className} md:w-[calc(50%-8px)]`}
    >
      {link ? (
        <Link href={link} className={`${className} block`}>
          {content}
        </Link>
      ) : (
        <>{content}</>
      )}
    </motion.div>
  );
}
