import { sanityFetch, SanityFetchOptions } from "@/lib/sanityClient";

/* Every server-side Sanity read is cached in Next's data cache under this
   tag. /api/revalidate invalidates it when content is published (Sanity
   webhook) and at Kyiv midnight (Vercel cron), when discount windows change. */
export const SANITY_CACHE_TAG = "sanity";

/* Fallback freshness, in seconds, if a webhook is ever missed. Route segment
   config needs literals, so 3600 is repeated in src/app/layout.tsx,
   src/app/api/feed and src/app/api/search-products - keep them equal. Each
   visited page is rebuilt at most this often; on-demand revalidation does
   the rest. */
export const SANITY_DATA_REVALIDATE = 3600;

/* The tag is always kept: a caller may change the fallback freshness, but an
   entry without the tag could never be invalidated by the webhook or the
   midnight cron. Extra tags are added on top. */
const withCacheDefaults = (
  options: SanityFetchOptions = {}
): SanityFetchOptions => ({
  revalidate: options.revalidate ?? SANITY_DATA_REVALIDATE,
  tags: [SANITY_CACHE_TAG, ...(options.tags ?? [])],
});

export interface FetchSanityDataServerOptions extends SanityFetchOptions {
  /* Default true. A failed query throws, so on a cached (ISR) route a failed
     rebuild keeps serving the previous page instead of caching a broken one,
     and a page that calls notFound() on an empty result never turns a Sanity
     outage into a false 404. Pass false only for optional sections
     (Instagram, recommendations): the error is logged and undefined is
     returned, so the rest of the page still renders - and on a cached route
     that version is stored until the next revalidation. */
  throwError?: boolean;
}

/* Cached server-side Sanity read, tagged for on-demand revalidation. */
export const fetchSanityDataServer = async (
  query: string,
  params: Record<string, unknown> = {},
  { throwError = true, ...cacheOptions }: FetchSanityDataServerOptions = {}
) => {
  try {
    return await sanityFetch(query, params, withCacheDefaults(cacheOptions));
  } catch (error) {
    if (throwError) throw error;
    console.warn("Sanity fetch failed:", error);
  }
};
