import Container from "../container/Container";
import CatalogBackground from "./CatalogBackground";
import CatalogBanner from "./CatalogBanner";
import CatalogList from "./CatalogList";
import CatalogTabs from "./CatalogTabs";
import CatalogToolbar from "./CatalogToolbar";
import {
  SelectOption,
  CatalogPage,
  CatalogSearchParams,
  CatalogSubcategory,
  CatalogBannerData,
} from "@/types/catalog";

interface CatalogCategoryProps {
  /* Path of the category page; every tab, dropdown and page link points to it. */
  pathname: string;
  /* Current URL params, carried over into those links. */
  searchParams: CatalogSearchParams;
  /* The current page of the filtered and sorted products. */
  page: CatalogPage;
  /* How many products match across all pages; the background art shows from 9. */
  totalCount: number;
  /* Selected filter value. */
  filter: string;
  /* Selected sort value. */
  sort: string;
  /* Choices of the sort dropdown. */
  sortOptions: SelectOption[];
  /* Genres of the category, shown as tabs. */
  subcategories?: CatalogSubcategory[];
  /* Slug of the selected genre tab; none is highlighted when it is missing. */
  activeSubcategory?: string;
  /* Tall banner left of the grid. */
  banner?: CatalogBannerData;
  /* Text shown when no product matches. */
  emptyMessage?: string;
}

/**
 * Listing of a category page (/catalog/<slug>, including "all" and "promo"):
 * genre tabs and the toolbar above the grid, the banner to its left.
 */
export default function CatalogCategory({
  pathname,
  searchParams,
  page,
  totalCount,
  filter,
  sort,
  sortOptions,
  subcategories,
  activeSubcategory,
  banner,
  emptyMessage,
}: CatalogCategoryProps) {
  const listKey = `${activeSubcategory ?? ""}-${filter}-${sort}-${page.currentPage}`;

  return (
    <section className="pb-8 lg:pb-10">
      <Container className="relative">
        {totalCount > 8 && <CatalogBackground />}
        <div className="xl:pl-[268px] flex flex-col gap-4">
          {!!subcategories?.length && (
            <CatalogTabs
              pathname={pathname}
              searchParams={searchParams}
              subcategories={subcategories}
              activeSlug={activeSubcategory}
            />
          )}
          <CatalogToolbar
            pathname={pathname}
            searchParams={searchParams}
            filter={filter}
            sort={sort}
            sortOptions={sortOptions}
          />
        </div>
        <div className="flex xl:gap-7 pt-8 lg:pt-10">
          {banner && <CatalogBanner banner={banner} />}
          <CatalogList
            pathname={pathname}
            searchParams={searchParams}
            page={page}
            emptyMessage={emptyMessage}
            listKey={listKey}
          />
        </div>
      </Container>
    </section>
  );
}
