import type { CatalogBanner } from "@/entities/banner/model/types";
import { Product } from "./product";
import { ListingParams } from "../lib/listingParams";

/* One choice of the filter or sort list. */
export type ListingOption = {
  title: string;
  value: string;
};

/* Which sort list a listing offers: series pages add "order in series". */
export type SortSet = "default" | "series";

/* Product lists shown like a category without being one. */
export type ProductSelection = "all" | "discounted";

/* A selection's products with the catalog banner its query also returns. */
export type ProductSelectionData = {
  products: Product[];
  banner?: CatalogBanner;
};

/* One page of a listing. */
export type ListingPage = {
  products: Product[];
  currentPage: number;
  totalPages: number;
};

/**
 * Products filtered, sorted and cut to one page, with the choices that
 * produced them.
 */
export type ProductListing = {
  page: ListingPage;
  totalCount: number;
  /* Resolved filter value, for the dropdown. */
  filter: string;
  /* Resolved sort value, for the dropdown. */
  sort: string;
  /* Sort list the dropdown offers. */
  sortSet: SortSet;
  /**
   * The same choices as URL params, defaults left out: links build on these,
   * so a value the listing rejected never travels on.
   */
  params: ListingParams;
};

/**
 * Body of GET /api/products. listing is null when none of the slugs is a
 * product any more.
 */
export type ProductListingResponse = {
  listing: ProductListing | null;
};

/**
 * One manualRecommendationsBySlugsQuery entry. Inner entries are null for
 * picks that no longer resolve (the reference is weak, so the target can be
 * removed).
 */
export type ManualRecommendationsBySlug = {
  slug: string;
  manualRecommendations: Array<Product | null> | null;
};
