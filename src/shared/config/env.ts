/**
 * Every environment variable the storefront reads that any bundle may see.
 * Only NEXT_PUBLIC_* values belong here: Next inlines them at build time, so
 * each one must be read as a literal `process.env.NEXT_PUBLIC_…`. Secrets
 * live in ./serverEnv.ts, which the browser can never import.
 */
export const publicEnv = {
  /* The site's origin without a trailing slash, so `${siteUrl}/path` works. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, ""),
  /**
   * Defaults to the production dataset, so a missing variable can never take
   * production offline. Preview sets it explicitly to "preview".
   */
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
} as const;

/**
 * Environment detection for the preview/production split. next-sitemap
 * .config.js repeats this check: keep the two in sync.
 *
 * Vercel sets VERCEL_ENV automatically on every deployment ("production",
 * "preview" or "development"), so production never depends on a variable
 * someone has to remember to configure. NEXT_PUBLIC_VERCEL_ENV is the same
 * value exposed to the browser bundle and is only used as a fallback for code
 * that runs client-side — prefer gating on the server where possible.
 *
 * Anything that is not explicitly "production" is treated as non-production:
 * reads still work normally, but writes to live third-party systems (KeyCRM,
 * analytics) are disabled. Locally both are unset, so `npm run dev` is safe
 * by default.
 */
const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;

/* True only on Vercel's production deployment. */
export const isProduction = vercelEnv === "production";
