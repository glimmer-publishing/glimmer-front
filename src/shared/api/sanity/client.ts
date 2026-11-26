import "server-only";
import { createClient } from "next-sanity";
import { getKyivDate } from "@/shared/lib/getKyivDate";

const client = createClient({
  projectId: "us9jz0mn",
  /**
   * Defaults to the production dataset, so a missing variable can never take
   * production offline. Preview sets it explicitly to "preview".
   */
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-07",
  useCdn: true,
});

/**
 * The only Sanity client in the storefront (src/lib/sanityClient.ts only
 * re-exports it). Every query receives $today (the Kyiv calendar date),
 * which the discount-window fragments in ./fragments.ts depend on - a query
 * that uses them without $today fails.
 * The client itself is deliberately not exported so no call can bypass this.
 * $today is set after the caller's params, so no caller can override which
 * prices it is offered.
 *
 * Caching is opt-in at this level: `revalidate` and `tags` store the result in
 * Next's fetch data cache, keyed by query and params. Without them the fetch
 * is uncached, which is what the cart quote and order placement rely on for
 * current prices. Server rendering goes through fetchSanityDataServer (./fetch.ts),
 * which always passes them.
 *
 * Cached reads skip Sanity's API CDN (useCdn: false) and query the live API.
 * Next's cache already sits in front of them, so the CDN only adds staleness:
 * right after a publish, the rebuild triggered by /api/revalidate could get
 * the previous version from the API CDN and Next would then keep that stale
 * copy until the next invalidation. Uncached calls keep the CDN unless they
 * pass `fresh`, which placing an order does: the amount charged must come
 * from the live API, not from a CDN copy a few seconds old.
 */
export interface SanityFetchOptions {
  revalidate?: number;
  tags?: string[];
  /* Uncached and past the API CDN. Ignored when revalidate or tags are set. */
  fresh?: boolean;
}

export const sanityFetch = (
  query: string,
  params: Record<string, unknown> = {},
  { revalidate, tags, fresh = false }: SanityFetchOptions = {}
) =>
  client.fetch(
    query,
    { ...params, today: getKyivDate() },
    revalidate === undefined && tags === undefined
      ? { useCdn: !fresh }
      : { useCdn: false, next: { revalidate, tags } }
  );
