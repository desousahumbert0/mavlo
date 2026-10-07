import Script from "next/script";
import { ADSENSE_CLIENT, ADS_ENABLED } from "@/config/ads";
import { siteConfig } from "@/config/site";

/** Loads Google Analytics and the AdSense script only when configured, and only after the page is idle. */
export default function Analytics() {
  const ga = siteConfig.gaId.replace(/[^A-Za-z0-9-]/g, "");
  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload" />
          <Script id="ga-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {ADS_ENABLED && ADSENSE_CLIENT && (
        <Script
          async
          strategy="lazyOnload"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`}
        />
      )}
    </>
  );
}
