import type { CatalogBanner } from "@/entities/banner/model/types";
import type { Product } from "@/entities/product/model/product";

/* A genre of a category with its products, shown as a tab. */
export type CategoryGenre = {
  genreSlug: string;
  genreTitle: string;
  products: Product[];
};

/* A Sanity category as the menu and the category page see it. */
export type Category = {
  title: string;
  slug: string;
  genres?: CategoryGenre[];
  products: Product[];
  banner?: CatalogBanner;
};

/* A category as the header catalog menu lists it. */
export type MenuCategory = {
  id: string;
  title: string;
  slug: string;
  order: number;
  genres?: { title: string; slug: string }[];
};
