import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseListingParams } from "@/shared/lib/searchParams/listingParams";
import { SearchParamsRecord } from "@/shared/lib/searchParams/urlParams";
import CollectionView from "@/views/collection/ui/CollectionView";
import { getAuthorMetadata } from "@/views/collection/api/metadata";
import { loadAuthorView } from "@/views/collection/api/loadAuthorView";

type AuthorPageProps = {
  /* The route's dynamic segments. */
  params: Promise<{ authorName: string }>;
  /* The URL's query; parsed right away, never passed down raw. */
  searchParams: Promise<SearchParamsRecord>;
};

/* Title and description naming the author. */
export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  return getAuthorMetadata((await params).authorName);
}

/**
 * /author/<name>: every book by one author as a listing; 404 when there are
 * none.
 */
export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const [{ authorName }, query] = await Promise.all([params, searchParams]);
  const view = await loadAuthorView(authorName, parseListingParams(query));

  if (!view) notFound();

  return <CollectionView {...view} />;
}
