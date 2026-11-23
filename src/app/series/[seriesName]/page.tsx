import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import CatalogTitled from "@/components/shared/catalog/CatalogTitled";
import { CatalogService } from "@/services/CatalogService";
import { readCatalogQuery } from "@/utils/catalogListing";
import { CatalogSearchParams } from "@/types/catalog";
import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/constants/constants";
import { decodePathParam } from "@/utils/decodePathParam";
import { getSeriesHref } from "@/utils/getSeriesInfo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

interface SeriesPageProps {
  params: Promise<{ seriesName: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { seriesName } = await params;
  const name = decodePathParam(seriesName);

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
}

export default async function SeriesPage({
  params,
  searchParams,
}: SeriesPageProps) {
  const [{ seriesName }, query] = await Promise.all([params, searchParams]);
  const name = decodePathParam(seriesName);

  if (!name) {
    notFound();
  }

  const books = await CatalogService.getSeriesBooks(
    name,
    readCatalogQuery(query)
  );

  if (!books) {
    notFound();
  }

  const pathname = getSeriesHref(name);
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: `Серія «${name}»`, href: pathname },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <CatalogTitled
        title={`Серія «${name}»`}
        pathname={pathname}
        searchParams={query}
        page={books.page}
        filter={books.filter}
        sort={books.sort}
        sortOptions={books.sortOptions}
      />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
