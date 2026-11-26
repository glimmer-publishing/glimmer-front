import type { Review } from "@/entities/review/model/types";

/* Whether a product ships now or is sold ahead of its release. */
export type ProductStatus = "inStock" | "preOrder";

/* A product as the storefront's Sanity queries project it. */
export type Product = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number | null;
  mainImage: string;
  status: ProductStatus;
  isBestseller: boolean;
  isNew: boolean;
  isNationalCashback?: boolean;
  categorySlug: string;
  categoryTitle: string;
  genres?: { slug: string; title: string }[];
  genreSlug?: string;
  genreTitle?: string;
  description?: string;
  gallery: string[];
  bookScreens?: string[];
  sku: string;
  preOrderShippingDate?: string;
  features?: {
    featureName: string;
    value: string;
  }[];
  reviews: Review[];
};
