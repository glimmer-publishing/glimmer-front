import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import type { CatalogBanner } from "@/entities/banner/model/types";
import { fadeInAnimation } from "@/shared/lib/animationVariants";
import { BANNER_IMAGE_QUALITY, sanityImageUrl } from "@/shared/lib/sanityImage";

interface CategoryBannerProps {
  /* The homepage banner marked "show on catalog" in Studio. */
  banner: CatalogBanner;
}

interface CategoryBannerImageProps {
  /* Sanity image URL of the banner. */
  src: string;
}

/**
 * The width the banner had before the catalog refactor. It was never set:
 * the link around it was the flex item and shrank next to the w-full grid,
 * from 240px to about 195px in the 1180px-wide xl container. Fixed here, so
 * the grid keeps the width it had then.
 */
const BANNER_WIDTH = 195;
const BANNER_HEIGHT = 503;

/**
 * The banner image at its fixed size.
 */
function CategoryBannerImage({ src }: CategoryBannerImageProps) {
  // One fixed 2x URL instead of a loader, which a server component cannot pass.
  return (
    <Image
      src={sanityImageUrl(src, {
        width: BANNER_WIDTH * 2,
        quality: BANNER_IMAGE_QUALITY,
      })}
      alt="banner"
      width={BANNER_WIDTH}
      height={BANNER_HEIGHT}
      unoptimized
    />
  );
}

/**
 * Tall banner left of the category grid (xl only), wrapped in a link when it
 * has one. It fades in once on first view.
 */
export default function CategoryBanner({ banner }: CategoryBannerProps) {
  /**
   * Not keyed by genre: it stays mounted across tab switches, so it does not
   * fade in again for the same banner.
   */
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInAnimation({ scale: 0.97, x: -10 })}
      className="hidden xl:block shrink-0"
    >
      {banner.link ? (
        <Link href={banner.link}>
          <CategoryBannerImage src={banner.imageCatalog} />
        </Link>
      ) : (
        <CategoryBannerImage src={banner.imageCatalog} />
      )}
    </motion.div>
  );
}
