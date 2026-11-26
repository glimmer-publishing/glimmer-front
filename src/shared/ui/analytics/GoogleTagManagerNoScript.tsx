type GoogleTagManagerNoScriptProps = {
  /* The Google Tag Manager container id. */
  gtmId: string;
};

/**
 * GTM's <noscript> iframe, first in <body>. Rendered only in production.
 */
export default function GoogleTagManagerNoScript({
  gtmId,
}: GoogleTagManagerNoScriptProps) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
