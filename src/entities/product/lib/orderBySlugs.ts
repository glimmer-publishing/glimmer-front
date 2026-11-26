import { Product } from "../model/product";

/* The products in the order of slugs; slugs without a product are skipped. */
export const orderBySlugs = (products: Product[], slugs: string[]) => {
  const bySlug = new Map(products.map((product) => [product.slug, product]));

  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
};
