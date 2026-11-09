import { Product } from "@/types/product";

/* Series is not a field of its own: it is a characteristic row picked from the
   "Серія" dropdown in Studio, with the position typed into "Порядок у серії"
   as "N з M". These names are the only link between the two. Renaming either
   feature in Studio breaks series links and pages.

   next-sitemap.config.js mirrors SERIES_FEATURE and the getSeriesHref URL shape
   (it is plain ESM run by Node and cannot import this file). Keep the two in
   sync.

   The series name is used exactly as stored - never trimmed - because the GROQ
   filter in productsBySeriesQuery compares it exactly and GROQ cannot trim. A
   link built from a trimmed name would 404. */
export const SERIES_FEATURE = "Серія";
export const SERIES_ORDER_FEATURE = "Порядок у серії";

export interface SeriesOrder {
  position: number;
  total?: number;
}

export interface SeriesInfo {
  name: string;
  position?: number;
  total?: number;
}

export function parseSeriesOrder(value?: string | null): SeriesOrder | null {
  const match = value?.trim().match(/^(\d+)(?:\s*з\s*(\d+))?$/i);
  if (!match) return null;

  const position = Number(match[1]);
  const total = match[2] ? Number(match[2]) : undefined;

  return { position, total };
}

function findFeatureValue(
  features: Product["features"],
  featureName: string
): string | undefined {
  return features
    ?.find((feature) => feature.featureName === featureName)?.value;
}

export function getSeriesInfo(features: Product["features"]): SeriesInfo | null {
  const name = findFeatureValue(features, SERIES_FEATURE);
  if (!name?.trim()) return null;

  const order = parseSeriesOrder(
    findFeatureValue(features, SERIES_ORDER_FEATURE)
  );

  return { name, position: order?.position, total: order?.total };
}

export function getSeriesHref(name: string): string {
  return `/series/${encodeURIComponent(name)}`;
}
