import { Product } from "@/types/product";

/**
 * Returns all genre slugs for a product, reading the new `genres` array first
 * and falling back to the legacy single `genreSlug` during the migration.
 */
export function getProductGenreSlugs(
  product?: Pick<Product, "genres" | "genreSlug">
): string[] {
  if (product?.genres?.length) {
    return product.genres.map((genre) => genre.slug);
  }

  return product?.genreSlug ? [product.genreSlug] : [];
}
