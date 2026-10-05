import type { ImageLoader } from "next/image";

// Every image field comes out of GROQ as a bare `asset->url`: the original
// upload, often a multi-megabyte PNG. Never render one as-is - every byte
// counts against the Sanity bandwidth quota. Stored assets are never touched.
//
// Which pipeline a Sanity image uses:
// - <Image> that would otherwise be `unoptimized`, and banners: pass
//   `loader={sanityImageLoader}`.
// - Plain <img>, react-image-gallery, emails, metadata: `sanityImageUrl` /
//   `sanityImageSrcSet`.
// - Product cards, cart, search, genre and Instagram tiles stay on Vercel's
//   default optimizer on purpose (it caches, so Sanity sees each original
//   once). Do not add a global `images.loaderFile`: it would also reroute
//   those and every local /public image.

// Banners (hero, promo, catalog) carry text, which compression smears first.
export const BANNER_IMAGE_QUALITY = 90;
// Promo banners are mostly thin lettering at a small display size; even q90
// at display resolution reads as soft there.
export const PROMO_BANNER_IMAGE_QUALITY = 95;
export const PRODUCT_IMAGE_QUALITY = 80;

const SANITY_CDN_HOST = "cdn.sanity.io";

interface SanityImageOptions {
  width: number;
  quality?: number;
}

// Params are set, not appended, so a URL that already carries them (an old
// cart entry passed through twice, say) never ends up with `w=..&w=..`.
// Anything that is not a Sanity CDN URL - a local fallback, an empty string -
// is returned untouched.
export const sanityImageUrl = (
  url: string,
  { width, quality }: SanityImageOptions,
): string => {
  if (!url) return url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (parsed.hostname !== SANITY_CDN_HOST) return url;

  parsed.searchParams.set("w", String(width));
  if (quality) parsed.searchParams.set("q", String(quality));
  // `max` never upscales past the original; `auto=format` serves WebP/AVIF
  // to browsers that accept them.
  parsed.searchParams.set("fit", "max");
  parsed.searchParams.set("auto", "format");

  return parsed.toString();
};

// Width / height of the original, read from the asset filename Sanity
// generates (`<hash>-<width>x<height>.<ext>`). Null for anything else.
export const sanityImageAspectRatio = (url: string): number | null => {
  const match = url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? width / height : null;
};

// For next/image's `loader` prop. Applied per component rather than through
// `images.loaderFile`, so local images and the ones Vercel already optimizes
// keep their current pipeline.
export const sanityImageLoader: ImageLoader = ({ src, width, quality }) =>
  sanityImageUrl(src, { width, quality: quality ?? PRODUCT_IMAGE_QUALITY });

// A `w`-descriptor srcset for plain <img> elements outside next/image.
export const sanityImageSrcSet = (
  url: string,
  widths: number[],
  quality: number = PRODUCT_IMAGE_QUALITY,
): string =>
  widths
    .map((width) => `${sanityImageUrl(url, { width, quality })} ${width}w`)
    .join(", ");
