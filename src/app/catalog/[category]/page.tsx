import { notFound } from "next/navigation";
import { parseListingParams } from "@/entities/product/model/listingParams";
import { SearchParamsRecord } from "@/shared/lib/url";
import CategoryView from "@/views/category/ui/CategoryView";
import { parseCategoryParams } from "@/views/category/model/categoryParams";
import { loadCategoryView } from "@/views/category/api/loadCategoryView";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParamsRecord>;
}

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
