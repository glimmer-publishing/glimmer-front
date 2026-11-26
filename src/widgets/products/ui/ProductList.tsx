import * as motion from "motion/react-client";
import AddToCart from "@/features/add-to-cart/ui/AddToCart";
import ToggleFavorite from "@/features/toggle-favorite/ui/ToggleFavorite";
import ProductCard from "./ProductCard";
import { ProductListing } from "@/entities/product/model/types";
import { fadeInAnimation } from "@/shared/lib/animationVariants";
import ProductPagination from "./ProductPagination";
import ProductsEmpty from "./ProductsEmpty";

interface ProductListProps {
  /* URL the page links build on: the path plus the page's own params. */
  baseHref: string;
  /* The filtered, sorted current page of products. */
  listing: ProductListing;
  /* Text shown when no product matches. */
  emptyMessage?: string;
  /* Changes with tab, filter, sort or page, so the cards fade in again. */
  listKey: string;
}

/**
 * The current page of cards with the page links below, or the empty state
 * when nothing matches.
 */
export default function ProductList({
  baseHref,
  listing,
  emptyMessage,
  listKey,
}: ProductListProps) {
  const { page } = listing;

  if (!page.products.length) return <ProductsEmpty message={emptyMessage} />;

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
            <ProductCard
              product={product}
              topAction={<ToggleFavorite slug={product.slug} />}
              action={<AddToCart product={product} />}
            />
          </motion.li>
        ))}
      </ul>
      <ProductPagination
        baseHref={baseHref}
        params={listing.params}
        currentPage={page.currentPage}
        totalPages={page.totalPages}
      />
    </div>
  );
}
