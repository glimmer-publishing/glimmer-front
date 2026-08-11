import { Product } from "@/types/product";
import type { ManualRecommendationsBySlug } from "@/lib/queries";

type MaybeProducts = Array<Product | null | undefined> | null | undefined;

/**
 * Flattens the curated picks of several products into one list, following the
 * given slug order rather than the order the query happened to return rows in
 * — so on checkout the first cart item's picks lead.
 *
 * Nullish entries are left in place for `mergeRecommendedProducts` to drop.
 */
export function orderManualRecommendations(
  results: ManualRecommendationsBySlug[] | null | undefined,
  orderedSlugs: string[]
): Array<Product | null | undefined> {
  if (!results?.length) return [];

  const bySlug = new Map(
    results.map((result) => [result.slug, result.manualRecommendations ?? []])
  );

  return orderedSlugs.flatMap((slug) => bySlug.get(slug) ?? []);
}

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
