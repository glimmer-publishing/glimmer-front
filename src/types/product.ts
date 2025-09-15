import { Review } from "./review";

export type Product = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number;
  mainImage: string;
  status: "inStock" | "preOrder";
  isBestseller: boolean;
  isNew: boolean;
  categorySlug: string;
  categoryTitle: string;
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
