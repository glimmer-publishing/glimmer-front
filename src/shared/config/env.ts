/**
 * Environment detection for the preview/production split.
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

export const isProduction = vercelEnv === "production";
