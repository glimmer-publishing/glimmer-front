/**
 * The site's origin without a trailing slash, so `${siteUrl()}/path` is
 * right whether or not NEXT_PUBLIC_SITE_URL ends with one.
 */
export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
