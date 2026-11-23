import Link from "next/link";
import ArrowIcon from "../icons/ArrowIcon";
import { catalogHref } from "@/utils/catalogListing";
import { CatalogSearchParams } from "@/types/catalog";

interface CatalogPaginationProps {
  /* Path of the listing page the links point to. */
  pathname: string;
  /* Current URL params, carried over into the links. */
  searchParams: CatalogSearchParams;
  /* The page being shown, highlighted. */
  currentPage: number;
  /* Number of pages; nothing renders when there is only one. */
  totalPages: number;
}

interface CatalogPaginationArrowProps {
  /* Target page URL; missing at either end, where the arrow is greyed out. */
  href?: string;
  /* Which way the arrow points. */
  direction: "prev" | "next";
}

const MAX_VISIBLE_PAGES = 4;

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = startPage + MAX_VISIBLE_PAGES - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  const pages = [];
  for (let page = startPage; page <= endPage; page++) pages.push(page);
  return pages;
};

/**
 * Previous or next arrow of the pagination.
 */
function CatalogPaginationArrow({
  href,
  direction,
}: CatalogPaginationArrowProps) {
  const iconClassName = `size-6 lg:size-10 ${direction === "prev" ? "rotate-90" : "-rotate-90"}`;

  const arrowClassName =
    "flex justify-center items-center size-6 lg:size-10 rounded-[6px] transition duration-300 ease-in-out";

  if (!href) {
    return (
      <span aria-hidden="true" className={`${arrowClassName} text-black/30`}>
        <ArrowIcon className={iconClassName} />
      </span>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={
        direction === "prev" ? "Попередня сторінка" : "Наступна сторінка"
      }
      className={`${arrowClassName} cursor-pointer hover:bg-gray/50 active:scale-95 focus-visible:bg-gray/50`}
    >
      <ArrowIcon className={iconClassName} />
    </Link>
  );
}

/**
 * Page links under a catalog listing: arrows plus a window of page numbers.
 * Links are not prefetched, since each one would cost a server render.
 */
export default function CatalogPagination({
  pathname,
  searchParams,
  currentPage,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) =>
    catalogHref(pathname, searchParams, {
      page: page === 1 ? null : String(page),
    });

  return (
    <nav
      aria-label="Сторінки"
      className="flex justify-center items-center gap-3 xl:gap-[35px] mt-8 xl:mt-12 mx-auto"
    >
      <CatalogPaginationArrow
        direction="prev"
        href={currentPage > 1 ? pageHref(currentPage - 1) : undefined}
      />

      <div>
        {getVisiblePages(currentPage, totalPages).map((page) => (
          <Link
            key={page}
            href={pageHref(page)}
            prefetch={false}
            aria-label={`Сторінка ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`cursor-pointer px-1 xl:px-[9px] py-2 text-[12px] lg:text-[16px] font-normal leading-[120%] transition duration-300 ease-in-out
            ${page === currentPage ? "text-main" : " xl:hover:text-main"}`}
          >
            {page}
          </Link>
        ))}
      </div>

      <CatalogPaginationArrow
        direction="next"
        href={currentPage < totalPages ? pageHref(currentPage + 1) : undefined}
      />
    </nav>
  );
}
