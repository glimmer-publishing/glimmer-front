import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseListingParams } from "@/entities/product/model/listingParams";
import { SearchParamsRecord } from "@/shared/lib/url";
import CollectionView from "@/views/collection/ui/CollectionView";
import { getAuthorMetadata } from "@/views/collection/api/metadata";
import { loadAuthorView } from "@/views/collection/api/loadAuthorView";

interface AuthorPageProps {
  params: Promise<{ authorName: string }>;
  searchParams: Promise<SearchParamsRecord>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  return getAuthorMetadata((await params).authorName);
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const [{ authorName }, query] = await Promise.all([params, searchParams]);
  const view = await loadAuthorView(authorName, parseListingParams(query));

  if (!view) notFound();

  return <CollectionView {...view} />;
}
