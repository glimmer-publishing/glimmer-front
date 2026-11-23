import * as motion from "motion/react-client";
import ProductCard from "../productCard/ProductCard";
import CatalogEmpty from "./CatalogEmpty";
import CatalogPagination from "./CatalogPagination";
import { CatalogPage, CatalogSearchParams } from "@/types/catalog";
import { fadeInAnimation } from "@/utils/animationVariants";

interface CatalogListProps {
  /* Path of the listing page, used by the page links. */
  pathname: string;
  /* Current URL params, carried over into the page links. */
  searchParams: CatalogSearchParams;
  /* The current page of the filtered and sorted products. */
  page: CatalogPage;
  /* Text shown when no product matches. */
  emptyMessage?: string;
  /* Changes with tab, filter, sort or page, so the cards fade in again. */
  listKey: string;
}

/**
 * The current page of cards with the page links below, or the empty state
 * when nothing matches.
 */
export default function CatalogList({
  pathname,
  searchParams,
  page,
  emptyMessage,
  listKey,
}: CatalogListProps) {
  if (!page.products.length) return <CatalogEmpty message={emptyMessage} />;

  return (
    <div className="w-full">
      <ul
        key={listKey}
        className="flex flex-row flex-wrap gap-x-4 gap-y-8 lg:gap-y-10 xl:gap-y-15"
      >
        {page.products.map((product) => (
          <motion.li
            key={product.id}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInAnimation({ y: 20 })}
            className="h-full w-[calc(50%-8px)] sm:w-[calc(33.33%-10.67px)] md:w-[calc(25%-12px)]"
          >
            <ProductCard product={product} />
          </motion.li>
        ))}
      </ul>
      <CatalogPagination
        pathname={pathname}
        searchParams={searchParams}
        currentPage={page.currentPage}
        totalPages={page.totalPages}
      />
    </div>
  );
}
