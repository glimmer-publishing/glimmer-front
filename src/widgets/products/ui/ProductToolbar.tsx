"use client";

import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import {
  FILTER_OPTIONS,
  SORT_OPTION_SETS,
} from "@/entities/product/model/constants";
import {
  ListingParams,
  listingHref,
} from "@/shared/lib/searchParams/listingParams";
import { SortSet } from "@/entities/product/model/types";
import Dropdown from "@/shared/ui/dropdown/Dropdown";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

type ProductToolbarProps = {
  /* URL the new one builds on: the path plus the page's own params. */
  baseHref: string;
  /* The listing's params, kept apart from the one being changed. */
  params: ListingParams;
  /* Selected filter value. */
  filter: string;
  /* Selected sort value. */
  sort: string;
  /* Sort list the dropdown offers. */
  sortSet: SortSet;
};

/**
 * Filter and sort dropdowns above a product grid. A change replaces the
 * URL and the server renders the new list, back on page 1.
 */
export default function ProductToolbar({
  baseHref,
  params,
  filter,
  sort,
  sortSet,
}: ProductToolbarProps) {
  const router = useRouter();

  const replaceParams = (changes: ListingParams) =>
    router.replace(
      listingHref(baseHref, { ...params, ...changes, page: undefined }),
      { scroll: false }
    );

  const handleFilterChange = (value: string) =>
    replaceParams({ filter: value });
  const handleSortChange = (value: string) => replaceParams({ sort: value });

  return (
    <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between">
      {/* Higher z than sort: on narrow screens they stack and filter's list opens over sort. */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ x: -20, delay: 0.2 })}
        className="relative z-[25]"
      >
        <Dropdown
          label="Фільтр:"
          options={FILTER_OPTIONS}
          value={filter}
          onChange={handleFilterChange}
          widthClassName="w-[170px] lg:w-[190px]"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ x: 20, delay: 0.2 })}
        className="relative z-20"
      >
        <Dropdown
          label="Сортувати:"
          options={SORT_OPTION_SETS[sortSet]}
          value={sort}
          onChange={handleSortChange}
          widthClassName="w-[210px] lg:w-[230px]"
        />
      </motion.div>
    </div>
  );
}
