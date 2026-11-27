import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import Container from "@/shared/ui/container/Container";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import ProductList from "@/widgets/products/ui/ProductList";
import ProductToolbar from "@/widgets/products/ui/ProductToolbar";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import { categoryHref } from "@/entities/category/lib/categoryParams";
import CategoryBackground from "./CategoryBackground";
import CategoryBanner from "./CategoryBanner";
import CategoryTabs from "./CategoryTabs";
import type { CategoryViewProps } from "../model/types";

/**
 * A category page (/catalog/<slug>, including "all" and "promo"): genre tabs
 * and the toolbar above the grid, the banner to its left.
 */
export default function CategoryView({
  pathname,
  subcategory,
  title,
  listing,
  genres,
  activeGenre,
  banner,
  emptyMessage,
}: CategoryViewProps) {
  const { page, totalCount, filter, sort, sortSet, params } = listing;
  const baseHref = categoryHref(pathname, { subcategory });
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: title, href: pathname },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <section className="pb-8 lg:pb-10">
        <Container className="relative">
          {totalCount > 8 && <CategoryBackground />}
          <div className="xl:pl-[268px] flex flex-col gap-4">
            {!!genres?.length && (
              <CategoryTabs
                pathname={pathname}
                params={params}
                genres={genres}
                activeSlug={activeGenre}
              />
            )}
            <ProductToolbar
              baseHref={baseHref}
              params={params}
              filter={filter}
              sort={sort}
              sortSet={sortSet}
            />
          </div>
          <div className="flex xl:gap-7 pt-8 lg:pt-10">
            {banner && <CategoryBanner banner={banner} />}
            <ProductList
              baseHref={baseHref}
              listing={listing}
              emptyMessage={emptyMessage}
              listKey={`${activeGenre ?? ""}-${filter}-${sort}-${page.currentPage}`}
            />
          </div>
        </Container>
      </section>
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
