import type { CatalogBanner } from "@/entities/banner/model/types";
import type { CategoryGenre } from "@/entities/category/model/types";
import type { ProductListing } from "@/entities/product/model/types";

/* Everything a category page renders, from loadCategoryView. */
export type CategoryViewProps = {
  /* Path of the category page; every tab, dropdown and page link points to it. */
  pathname: string;
  /**
   * Requested genre tab, kept in the dropdown and page links even when the
   * category has no such genre.
   */
  subcategory?: string;
  /* Category name, for the breadcrumbs. */
  title: string;
  /* The filtered, sorted current page of products. */
  listing: ProductListing;
  /* Genres of the category, shown as tabs. */
  genres?: CategoryGenre[];
  /* Slug of the selected genre tab; none is highlighted when it is missing. */
  activeGenre?: string;
  /* Tall banner left of the grid. */
  banner?: CatalogBanner;
  /* Text shown when no product matches. */
  emptyMessage?: string;
};
