import "server-only";
import { allProductsByCategoryQuery } from "./queries";
import { fetchSanityDataServer } from "@/shared/api/sanity/fetch";
import type { Product } from "@/entities/product/model/product";
import type { CatalogBanner } from "@/entities/banner/model/types";
import { Category, CategoryGenre } from "../model/types";

/* A category as allProductsByCategoryQuery projects it. */
type CategoryData = {
  categoryTitle?: string;
  categorySlug?: string;
  genres?: CategoryGenre[];
  allProducts?: Product[];
  catalogBanner?: CatalogBanner | null;
};

/**
 * A Sanity category with its genres and products, or null when no category
 * has this slug. Throws on a Sanity error, so an outage is an error page,
 * not a false 404.
 */
export const getCategory = async (slug: string): Promise<Category | null> => {
  const data: CategoryData | null = await fetchSanityDataServer(
    allProductsByCategoryQuery,
    { categorySlug: slug }
  );

  if (!data?.categorySlug) return null;

  return {
    title: data.categoryTitle ?? "",
    slug: data.categorySlug,
    genres: data.genres,
    products: data.allProducts ?? [],
    banner: data.catalogBanner ?? undefined,
  };
};
