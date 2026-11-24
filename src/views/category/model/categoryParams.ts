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

/* The category page with its own params; the listing params go on top. */
export const categoryHref = (
  pathname: string,
  { subcategory }: CategoryParams
): string => withParams(pathname, { subcategory });
