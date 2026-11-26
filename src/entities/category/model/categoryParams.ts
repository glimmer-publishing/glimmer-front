import { toUrlSearchParams, UrlParams, withParams } from "@/shared/lib/url";

/* Params only a category page has, as read from the URL. */
export interface CategoryParams {
  /* Slug of the requested genre tab. */
  subcategory?: string;
}

export const parseCategoryParams = (
  searchParams: UrlParams
): CategoryParams => ({
  subcategory: toUrlSearchParams(searchParams).get("subcategory") ?? undefined,
});

/**
 * The category page with its own params; the listing params go on top.
 * Every link to a category or one of its genre tabs is built here.
 */
export const categoryHref = (
  pathname: string,
  { subcategory }: CategoryParams
): string => withParams(pathname, { subcategory });

/* Link to a category, or to one of its genre tabs. */
export const categoryPageHref = (categorySlug: string, genreSlug?: string) =>
  categoryHref(`/catalog/${categorySlug}`, { subcategory: genreSlug });
