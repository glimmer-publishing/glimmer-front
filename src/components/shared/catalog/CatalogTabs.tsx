import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import { catalogHref } from "@/utils/catalogListing";
import { CatalogSearchParams, CatalogSubcategory } from "@/types/catalog";

interface CatalogTabsProps {
  /* Path of the category page the tabs point to. */
  pathname: string;
  /* Current URL params, carried over into the links. */
  searchParams: CatalogSearchParams;
  /* Genres of the category, one tab each. */
  subcategories: CatalogSubcategory[];
  /* Slug of the selected genre; none is highlighted when it is missing. */
  activeSlug?: string;
}

/**
 * Genre tabs of a category page. Each is a link that switches the genre,
 * goes back to page 1 and keeps the scroll position.
 */
export default function CatalogTabs({
  pathname,
  searchParams,
  subcategories,
  activeSlug,
}: CatalogTabsProps) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInAnimation({ x: -20 })}
      className="flex flex-wrap items-center gap-2"
    >
      {subcategories.map(({ genreSlug, genreTitle }) => {
        const isActive = genreSlug === activeSlug;

        return (
          <li key={genreSlug} className="w-fit leading-none">
            <Link
              href={catalogHref(pathname, searchParams, {
                subcategory: genreSlug,
                page: null,
              })}
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
