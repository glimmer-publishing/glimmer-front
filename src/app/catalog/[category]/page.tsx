import Catalog from "@/components/catalogPage/Catalog";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import {
  allDiscountedProductsQuery,
  allProductsByCategoryQuery,
  allProductsQuery,
} from "@/lib/queries";
import { notFound } from "next/navigation";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { connection } from "next/server";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Слаги, які не є категоріями в Sanity, а мають власний запит і власну назву
// в хлібних крихтах. Жанрових чіпів на них немає — запити не повертають genres.
const staticCatalogPages: Partial<
  Record<string, { query: string; label: string; emptyMessage?: string }>
> = {
  promo: {
    query: allDiscountedProductsQuery,
    label: "Акції",
  },
  all: {
    query: allProductsQuery,
    label: "Весь каталог",
    emptyMessage: "За обраним фільтром товарів не знайдено",
  },
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Rendered per request: the list for the current ?sort/filter/page/
  // subcategory is in the server HTML from the first paint. Sanity data still
  // comes from the tagged data cache, so this costs a render, not a query.
  await connection();

  const staticPage = staticCatalogPages[category];

  // Throws on a Sanity error, so an outage shows an error page rather than
  // telling visitors (and crawlers) the page does not exist.
  const res = staticPage
    ? await fetchSanityDataServer(staticPage.query)
    : await fetchSanityDataServer(allProductsByCategoryQuery, {
        categorySlug: category,
      });

  if (!staticPage && !res?.categorySlug) {
    notFound();
  }

  const currentCategory = staticPage
    ? { label: staticPage.label, href: `/catalog/${category}` }
    : { label: res?.categoryTitle, href: `/catalog/${res?.categorySlug}` };

  const crumbs = [{ label: "Головна", href: "/" }, currentCategory];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <Catalog
        catalogBanner={res?.catalogBanner}
        allProducts={res?.allProducts}
        subcategories={res?.genres}
        currentCategory={category}
        emptyMessage={staticPage?.emptyMessage}
      />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
