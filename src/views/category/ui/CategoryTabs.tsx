import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import type { CategoryGenre } from "@/entities/category/model/types";
import {
  ListingParams,
  listingHref,
} from "@/entities/product/model/listingParams";
import { categoryHref } from "../model/categoryParams";

interface CategoryTabsProps {
  /* Path of the category page the tabs point to. */
  pathname: string;
  /* The listing's params; the links keep filter and sort. */
  params: ListingParams;
  /* Genres of the category, one tab each. */
  genres: CategoryGenre[];
  /* Slug of the selected genre; none is highlighted when it is missing. */
  activeSlug?: string;
}

/**
 * Genre tabs of a category page. Each is a link that switches the genre,
 * goes back to page 1 and keeps the scroll position.
 */
export default function CategoryTabs({
  pathname,
  params,
  genres,
  activeSlug,
}: CategoryTabsProps) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInAnimation({ x: -20 })}
      className="flex flex-wrap items-center gap-2"
    >
      {genres.map(({ genreSlug, genreTitle }) => {
        const isActive = genreSlug === activeSlug;

        return (
          <li key={genreSlug} className="w-fit leading-none">
            <Link
              href={listingHref(
                categoryHref(pathname, { subcategory: genreSlug }),
                { ...params, page: undefined }
              )}
              prefetch={false}
              scroll={false}
              aria-current={isActive ? "true" : undefined}
              className={`cursor-pointer flex items-center justify-center w-full h-7 px-4 border-[0.5px] border-black/70 rounded-full
            text-[12px] lg:text-[14px] font-light leading-none will-change-transform xl:hover:bg-main xl:hover:brightness-110
              focus-visible:bg-main transition duration-300 ease-in-out ${
                isActive ? "bg-main" : "bg-white"
              }`}
            >
              {genreTitle}
            </Link>
          </li>
        );
      })}
    </motion.ul>
  );
}
