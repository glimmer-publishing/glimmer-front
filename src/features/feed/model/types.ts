import type { ProductStatus } from "@/entities/product/model/product";

/* A book as allProductsForFeedQuery projects it. */
export type FeedProduct = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  status: ProductStatus;
  preOrderShippingDate?: string;
  mainImage?: string;
  categorySlug?: string;
  categoryTitle?: string;
  genreTitle?: string;
  features?: { featureName: string; value: string }[];
};
