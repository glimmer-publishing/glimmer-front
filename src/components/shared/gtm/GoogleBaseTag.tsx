import Script from "next/script";

const GA4_ID = "G-LSKYNWW75N";
const GOOGLE_ADS_ID = "AW-18111056280";

/**
 * Loads the combined Google tag (gtag.js) for GA4 and Google Ads.
 * next/script with id ensures scripts run exactly once across all navigations.
 * GTM container is kept separately and continues to work alongside this.
 */
export default function GoogleBaseTag() {
  return (
    <>
      <Script
        id="google-base-tag-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
      <Script
        id="google-base-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      />
    </>
  );
}
