"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useFavoritesStore } from "@/store/favoritesStore";
import Loader from "../shared/loader/Loader";
import Container from "../shared/container/Container";
import NoItems from "./NoItems";
import Pagination from "../shared/pagination/Pagination";
import { useFavoritesItemsPerPage } from "@/hooks/useFavoritesItemsPerPage";
import ProductCard from "../shared/productCard/ProductCard";
import FiltersSortPanel from "../shared/filtersSortPanel/FiltersSortPanel";
import { filterProducts } from "@/utils/filterProducts";
import { sortProducts } from "@/utils/sortProducts";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function FavoritesList() {
  const { favorites } = useFavoritesStore();
  const itemsPerPage = useFavoritesItemsPerPage();
  const [hydrated, setHydrated] = useState(false);

  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";
  const sortParam = searchParams.get("sort") || "default";

  useEffect(() => {
    setHydrated(true);
  }, []);

  const filteredProducts = useMemo(() => {
    return filterProducts(favorites, filterParam);
  }, [favorites, filterParam]);

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortParam);
  }, [filteredProducts, sortParam]);

  if (!hydrated) return <Loader />;

  return (
    <Container>
      <FiltersSortPanel />
      {!sortedProducts.length ? (
        <NoItems />
      ) : (
        <div className="pt-8 lg:pt-10">
          <Pagination
            items={sortedProducts}
            useItemsPerPage={() => itemsPerPage}
            renderItems={(currentItems) => (
              <ul className="flex flex-row flex-wrap gap-x-4 gap-y-8 lg:gap-y-10">
                {currentItems.map((product) => (
                  <motion.li
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeInAnimation({ y: 20 })}
                    key={`${product?.id} - ${sortParam} - ${filterParam}`}
                    className="h-full w-[calc(50%-8px)] sm:w-[calc(33.33%-10.67px)] md:w-[calc(25%-12px)] xl:w-[calc(20%-12.8px)]"
                  >
                    <ProductCard product={product} />
                  </motion.li>
                ))}
              </ul>
            )}
          />
        </div>
      )}
    </Container>
  );
}
