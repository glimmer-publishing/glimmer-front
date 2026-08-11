import { Product } from "@/types/product";

type MaybeProducts = Array<Product | null | undefined> | null | undefined;

/**
 * Merges manually curated recommendations with genre-derived ones: manual
 * items first (in their given order), genre-derived filling the rest, deduped
 * by id.
 *
 * Both arguments are treated as untrusted: GROQ yields `null` rather than `[]`
 * for an array field that is unset on the document, and a reference to a
 * deleted or unpublished product dereferences to `null` inside an otherwise
 * populated array. Both cases are dropped rather than rendered.
 */
export function mergeRecommendedProducts(
  manual: MaybeProducts,
  genreBased: MaybeProducts
): Product[] {
  const seen = new Set<string>();
  const merged: Product[] = [];

  for (const product of [...(manual ?? []), ...(genreBased ?? [])]) {
    if (!product || seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }

  return merged;
}
