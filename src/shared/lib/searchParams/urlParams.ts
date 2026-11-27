/* Search params as a page receives them. */
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/* Pages get the URL params as an object, client components as URLSearchParams. */
export type UrlParams = SearchParamsRecord | URLSearchParams;

/**
 * Either form of URL params as a fresh URLSearchParams, keeping repeated keys.
 */
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

/* Defaults of readListParam: how many values, and how long each may be. */
const LIST_PARAM_LIMITS = { maxValues: 50, maxLength: 200 };

/**
 * The non-empty values of a repeated query param (?slug=a&slug=b), capped
 * in count and length so a crafted URL cannot make a route do unbounded
 * work. Over-long values are dropped, not cut.
 */
export const readListParam = (
  params: URLSearchParams,
  name: string,
  { maxValues, maxLength } = LIST_PARAM_LIMITS
): string[] =>
  params
    .getAll(name)
    .filter((value) => value && value.length <= maxLength)
    .slice(0, maxValues);
