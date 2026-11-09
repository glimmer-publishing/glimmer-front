import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import ListingCatalog from "@/components/shared/listingCatalog/ListingCatalog";
import { productsBySeriesQuery } from "@/lib/queries";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { Product } from "@/types/product";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";
import { getSeriesHref, SERIES_FEATURE } from "@/utils/getSeriesInfo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

const SERIES_SORT_OPTION = {
  title: "За порядком у серії",
  value: "series",
};

interface SeriesPageProps {
  params: Promise<{ seriesName: string }>;
}

/* A malformed escape ("%E0%A4%A") makes decodeURIComponent throw; treat it as
   an unknown series rather than a 500. Not trimmed: the query matches the
   stored value exactly (see getSeriesInfo.ts). */
function decodeSeriesName(seriesName: string): string | null {
  try {
    const name = decodeURIComponent(seriesName);
    return name.trim() ? name : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { seriesName } = await params;
  const name = decodeSeriesName(seriesName);
  const defaultMetadata = getDefaultMetadata();

  if (!name) return defaultMetadata;

  const title = `Серія «${name}» — книги серії. Купити онлайн`;
  const description = `Усі книги серії «${name}» у порядку читання. Glimmer — швидка доставка по Україні, новинки й передзамовлення.`;

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: { ...defaultMetadata.openGraph, title, description },
    ...(SITE_URL
      ? { alternates: { canonical: `${SITE_URL}${getSeriesHref(name)}` } }
      : {}),
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { seriesName } = await params;
  const name = decodeSeriesName(seriesName);

  if (!name) {
    notFound();
  }

  const products: Product[] = await fetchSanityDataServer(
    productsBySeriesQuery,
    { seriesName: name, seriesFeature: SERIES_FEATURE }
  );

  if (!products || products.length === 0) {
    notFound();
  }

  const crumbs = [
    { label: "Головна", href: "/" },
    { label: `Серія «${name}»`, href: getSeriesHref(name) },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <ListingCatalog
        title={`Серія «${name}»`}
        products={products}
        defaultSort={SERIES_SORT_OPTION.value}
        extraSortOptions={[SERIES_SORT_OPTION]}
      />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
