"use client";

import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import Dropdown from "../dropdown/Dropdown";
import { fadeInAnimation } from "@/utils/animationVariants";
import { catalogHref } from "@/utils/catalogListing";
import { SelectOption, CatalogSearchParams } from "@/types/catalog";
import { FILTER_OPTIONS } from "@/constants/filter";

interface CatalogToolbarProps {
  /* Path of the listing page, kept when the URL is replaced. */
  pathname: string;
  /* Current URL params, kept apart from the one being changed. */
  searchParams: CatalogSearchParams;
  /* Selected filter value. */
  filter: string;
  /* Selected sort value. */
  sort: string;
  /* Choices of the sort dropdown. */
  sortOptions: SelectOption[];
}

/**
 * Filter and sort dropdowns above a catalog listing. A change replaces the
 * URL and the server renders the new list, back on page 1.
 */
export default function CatalogToolbar({
  pathname,
  searchParams,
  filter,
  sort,
  sortOptions,
}: CatalogToolbarProps) {
  const router = useRouter();

  const replaceParam = (key: string, value: string) =>
    router.replace(
      catalogHref(pathname, searchParams, { [key]: value, page: null }),
      { scroll: false }
    );

  const handleFilterChange = (value: string) => replaceParam("filter", value);
  const handleSortChange = (value: string) => replaceParam("sort", value);

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
          options={sortOptions}
          value={sort}
          onChange={handleSortChange}
          widthClassName="w-[210px] lg:w-[230px]"
        />
      </motion.div>
    </div>
  );
}
