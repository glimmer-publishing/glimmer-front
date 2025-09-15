import Catalog from "@/components/catalogPage/Catalog";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import {
  allDiscountedProductsQuery,
  allProductsByCategoryQuery,
} from "@/lib/queries";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  const res =
    category === "promo"
      ? await fetchSanityDataServer(allDiscountedProductsQuery)
      : await fetchSanityDataServer(allProductsByCategoryQuery, {
          categorySlug: category,
        });

  const currentCategory =
    category === "promo"
      ? { label: "Акції", href: "/catalog/promo" }
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
      />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
