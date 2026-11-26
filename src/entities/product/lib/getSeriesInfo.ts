import { Product } from "../model/product";

/**
 * Series is not a field of its own: it is a characteristic row picked from the
 * "Серія" dropdown in Studio, with the position typed into "Порядок у серії"
 * as "N з M". These names are the only link between the two. Renaming either
 * feature in Studio breaks series links and pages.
 *
 * next-sitemap.config.js mirrors SERIES_FEATURE and the getSeriesHref URL shape
 * (it is plain ESM run by Node and cannot import this file). Keep the two in
 * sync.
 *
 * The series name is used exactly as stored - never trimmed - because the GROQ
 * filter in productsBySeriesQuery compares it exactly and GROQ cannot trim. A
 * link built from a trimmed name would 404.
 */
export const SERIES_FEATURE = "Серія";
/* The characteristic holding a book's place in its series, e.g. "2 з 5". */
export const SERIES_ORDER_FEATURE = "Порядок у серії";

/* A book's place in its series, and the series length when known. */
export type SeriesOrder = {
  position: number;
  total?: number;
};

/* A book's series and its place in it, for the product page. */
export type SeriesInfo = {
  name: string;
  position?: number;
  total?: number;
};

/* Reads "2" or "2 з 5"; null for anything else. */
export function parseSeriesOrder(value?: string | null): SeriesOrder | null {
  const match = value?.trim().match(/^(\d+)(?:\s*з\s*(\d+))?$/i);
  if (!match) return null;

  const position = Number(match[1]);
  const total = match[2] ? Number(match[2]) : undefined;

  return { position, total };
}

/* The value of one characteristic, by name. */
function findFeatureValue(
  features: Product["features"],
  featureName: string
): string | undefined {
  return features?.find((feature) => feature.featureName === featureName)
    ?.value;
}

/* The book's series from its characteristics, or null when it is in none. */
export function getSeriesInfo(
  features: Product["features"]
): SeriesInfo | null {
  const name = findFeatureValue(features, SERIES_FEATURE);
  if (!name?.trim()) return null;

  const order = parseSeriesOrder(
    findFeatureValue(features, SERIES_ORDER_FEATURE)
  );

  return { name, position: order?.position, total: order?.total };
}

/* The series page of a series name. */
export function getSeriesHref(name: string): string {
  return `/series/${encodeURIComponent(name)}`;
}
