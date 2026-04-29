const GA4_ID = "G-LSKYNWW75N";
const GOOGLE_ADS_ID = "AW-18111056280";

/**
 * Loads the combined Google tag (gtag.js) for GA4 and Google Ads.
 *
 * Must be placed in <head> before GTM so that window.gtag is defined
 * synchronously before any client-side tracking code runs.
 * GTM container is kept separately and continues to work alongside this.
 */
export default function GoogleBaseTag() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      />
      <script
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
    </>
  );
}
