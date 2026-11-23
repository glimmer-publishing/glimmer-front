import * as motion from "motion/react-client";
import Container from "../container/Container";
import CatalogList from "./CatalogList";
import CatalogToolbar from "./CatalogToolbar";
import {
  SelectOption,
  CatalogPage,
  CatalogSearchParams,
} from "@/types/catalog";
import { fadeInAnimation } from "@/utils/animationVariants";

interface CatalogTitledProps {
  /* Heading above the listing, e.g. the author's name. */
  title: string;
  /* Path of the page; every dropdown and page link points to it. */
  pathname: string;
  /* Current URL params, carried over into those links. */
  searchParams: CatalogSearchParams;
  /* The current page of the filtered and sorted products. */
  page: CatalogPage;
  /* Selected filter value. */
  filter: string;
  /* Selected sort value. */
  sort: string;
  /* Choices of the sort dropdown. */
  sortOptions: SelectOption[];
  /* Text shown when no product matches. */
  emptyMessage?: string;
}

/**
 * Listing under a heading, used by the author and series pages.
 */
export default function CatalogTitled({
  title,
  pathname,
  searchParams,
  page,
  filter,
  sort,
  sortOptions,
  emptyMessage,
}: CatalogTitledProps) {
  const listKey = `${filter}-${sort}-${page.currentPage}`;

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
          {title}
        </motion.h1>
        <CatalogToolbar
          pathname={pathname}
          searchParams={searchParams}
          filter={filter}
          sort={sort}
          sortOptions={sortOptions}
        />
        <div className="pt-8 lg:pt-10">
          <CatalogList
            pathname={pathname}
            searchParams={searchParams}
            page={page}
            emptyMessage={emptyMessage}
            listKey={listKey}
          />
        </div>
      </Container>
    </section>
  );
}
