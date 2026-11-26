import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseListingParams } from "@/shared/lib/searchParams/listingParams";
import { SearchParamsRecord } from "@/shared/lib/searchParams/urlParams";
import CollectionView from "@/views/collection/ui/CollectionView";
import { getSeriesMetadata } from "@/views/collection/api/metadata";
import { loadSeriesView } from "@/views/collection/api/loadSeriesView";

type SeriesPageProps = {
  /* The route's dynamic segments. */
  params: Promise<{ seriesName: string }>;
  /* The URL's query; parsed right away, never passed down raw. */
  searchParams: Promise<SearchParamsRecord>;
};

/* Title, description and canonical URL naming the series. */
export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  return getSeriesMetadata((await params).seriesName);
}

/**
 * /series/<name>: the books of one series, in reading order by default; 404
 * when there are none.
 */
export default async function SeriesPage({
  params,
  searchParams,
}: SeriesPageProps) {
  const [{ seriesName }, query] = await Promise.all([params, searchParams]);
  const view = await loadSeriesView(seriesName, parseListingParams(query));

  if (!view) notFound();

  return <CollectionView {...view} />;
}
