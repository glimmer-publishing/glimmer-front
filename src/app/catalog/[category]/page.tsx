import Catalog from "@/components/catalogPage/Catalog";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import {
  allDiscountedProductsQuery,
  allProductsByCategoryQuery,
  allProductsQuery,
} from "@/lib/queries";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";

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

  const staticPage = staticCatalogPages[category];

  const res = staticPage
    ? await fetchSanityDataServer(staticPage.query)
    : await fetchSanityDataServer(allProductsByCategoryQuery, {
        categorySlug: category,
      });

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
