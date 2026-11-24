import type { CatalogBanner } from "@/types/promoBanner";
import { Product } from "@/types/product";

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
