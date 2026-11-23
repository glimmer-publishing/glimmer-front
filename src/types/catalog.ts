import { Product } from "./product";

export interface SelectOption {
  title: string;
  value: string;
}

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

export interface CatalogQuery {
  filter?: string;
  sort?: string;
  subcategory?: string;
  page?: number;
}

export interface CatalogSubcategory {
  genreSlug: string;
  genreTitle: string;
  products: Product[];
}

export interface CatalogPage {
  products: Product[];
  currentPage: number;
  totalPages: number;
}

export interface CatalogBannerData {
  imageCatalog: string;
  link?: string;
}

export interface CatalogBooks {
  page: CatalogPage;
  totalCount: number;
  filter: string;
  sort: string;
  sortOptions: SelectOption[];
}

export interface CategoryBooks extends CatalogBooks {
  title: string;
  subcategories?: CatalogSubcategory[];
  activeSubcategory?: string;
  banner?: CatalogBannerData;
  emptyMessage?: string;
}

export type StaticCategorySlug = "promo" | "all";

export interface StaticCategory {
  title: string;
  emptyMessage?: string;
}
