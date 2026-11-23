import { CatalogQuery, CatalogSearchParams } from "@/types/catalog";

export const catalogHref = (
  pathname: string,
  searchParams: CatalogSearchParams,
  changes: Record<string, string | null>
): string => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key in changes || value === undefined) return;
    (Array.isArray(value) ? value : [value]).forEach((item) =>
      params.append(key, item)
    );
  });

  Object.entries(changes).forEach(([key, value]) => {
    if (value !== null) params.set(key, value);
  });

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

// A repeated key (?sort=a&sort=b) counts as its first value.
const getSearchParam = (
  searchParams: CatalogSearchParams,
  key: string
): string | undefined => {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
};

export const readCatalogQuery = (
  searchParams: CatalogSearchParams
): CatalogQuery => {
  const page = Number.parseInt(getSearchParam(searchParams, "page") ?? "", 10);

  return {
    filter: getSearchParam(searchParams, "filter"),
    sort: getSearchParam(searchParams, "sort"),
    subcategory: getSearchParam(searchParams, "subcategory"),
    page: Number.isNaN(page) ? undefined : page,
  };
};
