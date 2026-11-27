import type { ProductListing } from "@/entities/product/model/types";

/* Everything an author or series page renders. */
export type CollectionViewProps = {
  /* Heading and breadcrumb label, e.g. the author's name. */
  title: string;
  /* Path of the page; every dropdown and page link points to it. */
  pathname: string;
  /* The filtered, sorted current page of products. */
  listing: ProductListing;
};
