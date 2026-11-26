import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/shared/config/constants";
import { decodePathParam } from "@/shared/lib/routing/decodePathParam";
import { getSeriesHref } from "@/entities/product/lib/getSeriesInfo";

import { publicEnv } from "@/shared/config/env";

/* The canonical URL needs the site's origin. */
const SITE_URL = publicEnv.siteUrl;

/* Metadata of an author page; the defaults for an unreadable name. */
export const getAuthorMetadata = (authorParam: string): Metadata => {
  const authorName = decodePathParam(authorParam);

  if (!authorName) return DEFAULT_METADATA;

  return {
    title: `${authorName} — книги автора. Купити онлайн`,
    description: DEFAULT_METADATA.description,
  };
};

/**
 * Metadata of a series page, with its canonical URL; the defaults for an
 * unreadable name.
 */
export const getSeriesMetadata = (seriesParam: string): Metadata => {
  const name = decodePathParam(seriesParam);

  if (!name) return DEFAULT_METADATA;

  const title = `Серія «${name}» — книги серії. Купити онлайн`;
  const description = `Усі книги серії «${name}» у порядку читання. Glimmer — швидка доставка по Україні, новинки й передзамовлення.`;

  return {
    ...DEFAULT_METADATA,
    title,
    description,
    openGraph: { ...DEFAULT_METADATA.openGraph, title, description },
    ...(SITE_URL
      ? { alternates: { canonical: `${SITE_URL}${getSeriesHref(name)}` } }
      : {}),
  };
};
