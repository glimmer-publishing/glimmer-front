/* The UTM keys a campaign link may carry, in the order KeyCRM lists them. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/* One value per UTM key; a key missing from the URL is an empty string. */
export type UtmParams = Record<(typeof UTM_KEYS)[number], string>;

/**
 * The UTM params of a URL's query, or null when it carries none. Every key
 * is present in the result, empty when the URL leaves it out.
 */
export const parseUtmParams = (
  searchParams: URLSearchParams
): UtmParams | null => {
  const utm = Object.fromEntries(
    UTM_KEYS.map((key) => [key, searchParams.get(key) ?? ""])
  ) as UtmParams;

  return UTM_KEYS.some((key) => utm[key]) ? utm : null;
};
