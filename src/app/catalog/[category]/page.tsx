import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import CatalogCategory from "@/components/shared/catalog/CatalogCategory";
import { CatalogService } from "@/services/CatalogService";
import { readCatalogQuery } from "@/utils/catalogListing";
import { CatalogSearchParams } from "@/types/catalog";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ category }, query] = await Promise.all([params, searchParams]);

  const books = await CatalogService.getCategoryBooks(
    category,
    readCatalogQuery(query)
  );

  if (!books) {
    notFound();
  }

  const pathname = `/catalog/${category}`;
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: books.title, href: pathname },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <CatalogCategory
        pathname={pathname}
        searchParams={query}
        page={books.page}
        totalCount={books.totalCount}
        filter={books.filter}
        sort={books.sort}
        sortOptions={books.sortOptions}
        subcategories={books.subcategories}
        activeSubcategory={books.activeSubcategory}
        banner={books.banner}
        emptyMessage={books.emptyMessage}
      />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
