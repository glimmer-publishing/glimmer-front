import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { CatalogBannerData } from "@/types/catalog";
import { fadeInAnimation } from "@/utils/animationVariants";
import { BANNER_IMAGE_QUALITY, sanityImageUrl } from "@/utils/sanityImage";

interface CatalogBannerProps {
  /* The homepage banner marked "show on catalog" in Studio. */
  banner: CatalogBannerData;
}

interface CatalogBannerImageProps {
  /* Sanity image URL of the banner. */
  src: string;
}

/**
 * The banner image at its fixed 240px size.
 */
function CatalogBannerImage({ src }: CatalogBannerImageProps) {
  // One fixed 2x URL instead of a loader, which a server component cannot pass.
  return (
    <Image
      src={sanityImageUrl(src, { width: 480, quality: BANNER_IMAGE_QUALITY })}
      alt="banner"
      width={240}
      height={619}
      unoptimized
    />
  );
}

/**
 * Tall banner left of the category grid (xl only), wrapped in a link when it
 * has one. It fades in once on first view.
 */
export default function CatalogBanner({ banner }: CatalogBannerProps) {
  // Not keyed by genre: it stays mounted across tab switches, so it does not
  // fade in again for the same banner.
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
          <CatalogBannerImage src={banner.imageCatalog} />
        </Link>
      ) : (
        <CatalogBannerImage src={banner.imageCatalog} />
      )}
    </motion.div>
  );
}
