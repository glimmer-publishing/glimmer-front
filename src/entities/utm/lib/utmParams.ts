import type { UtmData } from "../model/types";

/* The UTM keys a campaign link may carry, in the order KeyCRM lists them. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * The UTM params of a URL's query, or null when it carries none. Every key
 * is present in the result, empty when the URL leaves it out.
 */
export const parseUtmParams = (
  searchParams: URLSearchParams
): UtmData | null => {
  const utm = Object.fromEntries(
    UTM_KEYS.map((key) => [key, searchParams.get(key) ?? ""])
  ) as UtmData;

  return UTM_KEYS.some((key) => utm[key]) ? utm : null;
};
