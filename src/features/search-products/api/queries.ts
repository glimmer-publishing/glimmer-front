/**
 * Header search: only what a result row shows and links to. No prices, so
 * it does not depend on $today.
 */
export const searchProductsQuery = `
*[_type == "product"]{
  sku,
  title,
  author,
  "mainImage": gallery[0].asset->url,
  "slug": slug.current,
  "categorySlug": category->slug.current
}
`;
