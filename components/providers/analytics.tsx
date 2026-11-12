import Script from "next/script";

/**
 * Privacy-friendly analytics. Plausible is enabled only when
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is configured; GA4 only when
 * NEXT_PUBLIC_GA_ID is configured. No cookies are set otherwise.
 */
export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {plausible ? (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
