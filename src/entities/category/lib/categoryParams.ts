import {
  toUrlSearchParams,
  UrlParams,
  withParams,
} from "@/shared/lib/searchParams/urlParams";

/* Params only a category page has, as read from the URL. */
export type CategoryParams = {
  /* Slug of the requested genre tab. */
  subcategory?: string;
};

/* The category page's own params from the URL. */
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
