import { notFound } from "next/navigation";
import { parseListingParams } from "@/shared/lib/searchParams/listingParams";
import { SearchParamsRecord } from "@/shared/lib/searchParams/urlParams";
import CategoryView from "@/views/category/ui/CategoryView";
import { parseCategoryParams } from "@/shared/lib/searchParams/categoryParams";
import { loadCategoryView } from "@/views/category/api/loadCategoryView";

type CategoryPageProps = {
  /* The route's dynamic segments. */
  params: Promise<{ category: string }>;
  /* The URL's query; parsed right away, never passed down raw. */
  searchParams: Promise<SearchParamsRecord>;
};

/**
 * /catalog/<category>: a category, or the "all" and "discounted" selections,
 * as a listing with genre tabs; 404 for an unknown slug.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  const view = await loadCategoryView(
    category,
    parseListingParams(query),
    parseCategoryParams(query)
  );

  if (!view) notFound();

  return <CategoryView {...view} />;
}
