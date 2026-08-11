import { Product } from "@/types/product";

/**
 * Returns all genre slugs for a product, reading the `genres` array first.
 *
 * The `genreSlug` fallback is not legacy-schema support — the deprecated single
 * `genre` field is gone from Sanity. It covers `Product` objects persisted to
 * localStorage by the cart and reviewed-products stores before `genres` existed:
 * those entries carry only `genreSlug`, and without this branch a returning
 * customer silently loses checkout recommendations. Safe to drop once such
 * carts have aged out.
 */
export function getProductGenreSlugs(
  product?: Pick<Product, "genres" | "genreSlug">
): string[] {
  if (product?.genres?.length) {
    return product.genres.map((genre) => genre.slug);
  }

  return product?.genreSlug ? [product.genreSlug] : [];
}
