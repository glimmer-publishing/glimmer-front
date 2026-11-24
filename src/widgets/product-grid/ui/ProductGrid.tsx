import { ProductListing } from "@/entities/product/model/types";
import ProductList from "./ProductList";
import ProductToolbar from "./ProductToolbar";

interface ProductGridProps {
  /**
   * URL every dropdown and page link builds on: the path plus the page's own
   * params, such as the genre tab.
   */
  baseHref: string;
  /* The filtered, sorted current page of products. */
  listing: ProductListing;
  /* Text shown when no product matches. */
  emptyMessage?: string;
}

/**
 * Filter and sort toolbar over the cards and page links. Used by
 * the author, series and favorites pages, so it also renders in the browser:
 * keep it synchronous and free of server-only imports.
 */
export default function ProductGrid({
  baseHref,
  listing,
  emptyMessage,
}: ProductGridProps) {
  const { filter, sort, page } = listing;

  return (
    <>
      <ProductToolbar
        baseHref={baseHref}
        params={listing.params}
        filter={filter}
        sort={sort}
        sortSet={listing.sortSet}
      />
      <div className="pt-8 lg:pt-10">
        <ProductList
          baseHref={baseHref}
          listing={listing}
          emptyMessage={emptyMessage}
          listKey={`${filter}-${sort}-${page.currentPage}`}
        />
      </div>
    </>
  );
}
