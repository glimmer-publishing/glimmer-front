/**
 * The product page of a book, /catalog/<category>/<slug>. next-sitemap
 * .config.js builds the same URL shape: keep the two in sync.
 */
export const productHref = (categorySlug: string, slug: string) =>
  `/catalog/${categorySlug}/${slug}`;
