import "server-only";
import type { Metadata } from "next";
import { getProductBySlug } from "@/entities/product/api/getProducts";
import { getDefaultMetadata } from "@/shared/lib/getDefaultMetadata";
import { sanityImageUrl } from "@/shared/lib/sanityImage";

/**
 * Title "<title>, <author>. Купити книгу за <price> грн" with the active
 * price, the description, and the cover as the OG image.
 */
export const buildProductMetadata = async (slug: string): Promise<Metadata> => {
  const product = await getProductBySlug(slug);

  if (!product) return getDefaultMetadata();

  const currentPrice =
    product.discountPrice && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  return {
    title: `${product.title}, ${product.author}. Купити книгу за ${currentPrice} грн`,
    description: product.description || getDefaultMetadata().description,
    openGraph: {
      images: [
        /**
         * A sized copy of the cover, with no declared size (covers are
         * portrait); the site-wide fallback's real size is declared.
         */
        product.mainImage
          ? {
              url: sanityImageUrl(product.mainImage, { width: 1200 }),
              alt: "Glimmer",
            }
          : {
              url: "/opengraph-image.jpg",
              width: 1200,
              height: 638,
              alt: "Glimmer",
            },
      ],
    },
  };
};
