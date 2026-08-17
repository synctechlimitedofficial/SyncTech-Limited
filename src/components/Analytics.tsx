import Script from "next/script";

/**
 * Optional, cookie-free page analytics.
 *
 * Renders nothing at all unless `NEXT_PUBLIC_ANALYTICS_SRC` is set, so there is
 * no third-party request — and no cookie banner obligation — by default.
 * Works with any script that takes a `data-domain` attribute, which covers
 * Plausible and Umami, self-hosted or cloud.
 *
 *   NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js
 *   NEXT_PUBLIC_ANALYTICS_DOMAIN=synctech.com
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;

  if (!src) return null;

  return (
    <Script
      src={src}
      data-domain={domain}
      // Never competes with rendering the page.
      strategy="afterInteractive"
      defer
    />
  );
}
