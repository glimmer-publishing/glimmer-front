"use client";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "../shared/productCard/ProductCard";
import Pagination from "../shared/pagination/Pagination";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

/* One count for every screen size: the server cannot know the viewport, and
   a breakpoint-dependent count made the grid change right after load. */
const ITEMS_PER_PAGE = 24;
const useItemsPerPage = () => ITEMS_PER_PAGE;

interface CatalogListProps {
  currentProducts: Product[];
}

export default function CatalogList({ currentProducts }: CatalogListProps) {
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "rating";
  const filter = searchParams.get("filter") || "all";

  return (
    <div className="w-full">
      <Pagination
        items={currentProducts}
        useItemsPerPage={useItemsPerPage}
        renderItems={(currentItems) => (
          <ul className="flex flex-row flex-wrap gap-x-4 gap-y-8 lg:gap-y-10 xl:gap-y-15">
            {currentItems.map((product) => (
              <motion.li
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInAnimation({ y: 20 })}
                key={`${product?.id} - ${sort} - ${filter}`}
                className="h-full w-[calc(50%-8px)] sm:w-[calc(33.33%-10.67px)] md:w-[calc(25%-12px)]"
              >
                <ProductCard product={product} />
              </motion.li>
            ))}
          </ul>
        )}
      />
    </div>
  );
}
