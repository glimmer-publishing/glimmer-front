import { GoogleTagManager } from "@next/third-parties/google";

type GoogleTagManagerScriptProps = {
  /* The Google Tag Manager container id. */
  gtmId: string;
};

/**
 * Loads Google Tag Manager. Rendered only in production.
 */
export default function GoogleTagManagerScript({
  gtmId,
}: GoogleTagManagerScriptProps) {
  return <GoogleTagManager gtmId={gtmId} />;
}
