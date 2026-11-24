export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/* Pages get the URL params as an object, client components as URLSearchParams. */
export type UrlParams = SearchParamsRecord | URLSearchParams;

export const toUrlSearchParams = (searchParams: UrlParams): URLSearchParams => {
  if (searchParams instanceof URLSearchParams) {
    return new URLSearchParams(searchParams);
  }

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined) return;
    (Array.isArray(value) ? value : [value]).forEach((item) =>
      params.append(key, item)
    );
  });

  return params;
};

/**
 * The href with these params set on top of its own query: a string sets a
 * key, undefined removes it.
 */
export const withParams = (
  href: string,
  changes: Record<string, string | undefined>
): string => {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);

  Object.entries(changes).forEach(([key, value]) => {
    if (value === undefined) params.delete(key);
    else params.set(key, value);
  });

  const search = params.toString();
  return search ? `${path}?${search}` : path;
};
