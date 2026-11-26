"use client";
import { HomepageBanner } from "@/entities/banner/model/types";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animationVariants";
import {
  PROMO_BANNER_IMAGE_QUALITY,
  sanityImageLoader,
} from "@/shared/lib/sanityImage";

interface PromoBannerProps {
  /* The banner: two image sizes and an optional link. */
  banner: HomepageBanner;
  /* Extra classes, e.g. to hide the copy rendered for another breakpoint. */
  className?: string;
  /* Which side it slides in from: "first" from the left. */
  idx: string;
}

/**
 * Rendered at full container width below md and half of it from md (the
 * container caps at 1280px minus padding). `sizes` declares twice that, so
 * the text is downscaled from a larger file the way it was from the
 * original - in practice retina screens get the full-resolution original.
 * The variant hidden by CSS is lazy, so it is never fetched.
 */
const SIZES = "(min-width: 1280px) 1180px, (min-width: 768px) 100vw, 200vw";

interface BannerImagesProps {
  /* The banner whose small and large images are shown. */
  banner: HomepageBanner;
}

/**
 * The banner's two images, each shown at its own breakpoint.
 */
function BannerImages({ banner }: BannerImagesProps) {
  return (
    <>
      <Image
        src={banner.imageSmall}
        alt="promo banner"
        width={320}
        height={268}
        loader={sanityImageLoader}
        quality={PROMO_BANNER_IMAGE_QUALITY}
        sizes={SIZES}
        className="w-full h-auto xs:hidden"
      />
      <Image
        src={banner.imageLarge}
        alt="promo banner"
        width={320}
        height={268}
        loader={sanityImageLoader}
        quality={PROMO_BANNER_IMAGE_QUALITY}
        sizes={SIZES}
        className="w-full h-auto hidden xs:block"
      />
    </>
  );
}

/**
 * A home promo banner that slides in from its side, linked when Studio sets
 * a link.
 */
export default function PromoBanner({
  banner,
  className = "",
  idx,
}: PromoBannerProps) {
  const { link } = banner;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ x: idx === "first" ? -30 : 30 })}
      className={`${className} md:w-[calc(50%-8px)]`}
    >
      {!!link && (
        <Link href={link} className={`${className} block`}>
          <BannerImages banner={banner} />
        </Link>
      )}
      {!link && <BannerImages banner={banner} />}
    </motion.div>
  );
}
