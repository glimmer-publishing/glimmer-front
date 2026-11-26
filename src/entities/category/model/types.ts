import type { CatalogBanner } from "@/entities/banner/model/types";
import type { Product } from "@/entities/product/model/product";

/* A genre of a category with its products, shown as a tab. */
export interface CategoryGenre {
  genreSlug: string;
  genreTitle: string;
  products: Product[];
}

export interface Category {
  title: string;
  slug: string;
  genres?: CategoryGenre[];
  products: Product[];
  banner?: CatalogBanner;
}

/* A category as the header catalog menu lists it. */
export interface MenuCategory {
  id: string;
  title: string;
  slug: string;
  order: number;
  genres?: { title: string; slug: string }[];
}
