import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/shared/config/constants";
import { decodePathParam } from "@/shared/lib/decodePathParam";
import { getSeriesHref } from "@/entities/product/lib/getSeriesInfo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

export const getAuthorMetadata = (authorParam: string): Metadata => {
  const authorName = decodePathParam(authorParam);

  if (!authorName) return DEFAULT_METADATA;

  return {
    title: `${authorName} — книги автора. Купити онлайн`,
    description: DEFAULT_METADATA.description,
  };
};

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
