import { toUrlSearchParams, UrlParams, withParams } from "@/shared/lib/url";

/**
 * filter, sort and page of a product listing as read from the URL, not yet
 * checked against the options: listProducts falls back to defaults.
 */
export interface ListingParams {
  filter?: string;
  sort?: string;
  page?: number;
}

// get() returns the first value, so ?sort=a&sort=b counts as "a".
export const parseListingParams = (searchParams: UrlParams): ListingParams => {
  const params = toUrlSearchParams(searchParams);
  const page = Number.parseInt(params.get("page") ?? "", 10);

  return {
    filter: params.get("filter") ?? undefined,
    sort: params.get("sort") ?? undefined,
    page: Number.isNaN(page) ? undefined : page,
  };
};

/**
 * The listing at baseHref with these params. baseHref may carry the page's
 * own params (a genre tab); page 1 is left out.
 */
export const listingHref = (
  baseHref: string,
  { filter, sort, page }: ListingParams
): string =>
  withParams(baseHref, {
    filter,
    sort,
    page: page && page > 1 ? String(page) : undefined,
  });
