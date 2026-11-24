import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseListingParams } from "@/entities/product/model/listingParams";
import { SearchParamsRecord } from "@/shared/lib/url";
import CollectionView from "@/views/collection/ui/CollectionView";
import { getSeriesMetadata } from "@/views/collection/api/metadata";
import { loadSeriesView } from "@/views/collection/api/loadSeriesView";

interface SeriesPageProps {
  params: Promise<{ seriesName: string }>;
  searchParams: Promise<SearchParamsRecord>;
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  return getSeriesMetadata((await params).seriesName);
}

export default async function SeriesPage({
  params,
  searchParams,
}: SeriesPageProps) {
  const [{ seriesName }, query] = await Promise.all([params, searchParams]);
  const view = await loadSeriesView(seriesName, parseListingParams(query));

  if (!view) notFound();

  return <CollectionView {...view} />;
}
