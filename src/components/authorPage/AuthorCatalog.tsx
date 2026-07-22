"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import Container from "@/components/shared/container/Container";
import FiltersSortPanel from "@/components/shared/filtersSortPanel/FiltersSortPanel";
import CatalogList from "@/components/catalogPage/CatalogList";
import NoItems from "@/components/catalogPage/NoItems";
import { filterProducts } from "@/utils/filterProducts";
import { sortProducts } from "@/utils/sortProducts";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface AuthorCatalogProps {
  authorName: string;
  products: Product[];
}

export default function AuthorCatalog({
  authorName,
  products,
}: AuthorCatalogProps) {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";
  const sortParam = searchParams.get("sort") || "rating";

  const filteredProducts = useMemo(
    () => filterProducts(products, filterParam),
    [products, filterParam]
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortParam),
    [filteredProducts, sortParam]
  );

  return (
    <section className="pb-8 lg:pb-10">
      <Container>
        <motion.h1
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ y: 10 })}
          className="text-[22px] lg:text-[32px] font-semibold leading-[120%] mb-4 lg:mb-6"
        >
          {authorName}
        </motion.h1>
        <FiltersSortPanel />
        <div className="pt-8 lg:pt-10">
          {sortedProducts.length ? (
            <CatalogList currentProducts={sortedProducts} />
          ) : (
            <NoItems />
          )}
        </div>
      </Container>
    </section>
  );
}
