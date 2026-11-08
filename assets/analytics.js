/* Shared GA4 setup for the Everywhere Safety site. */
(() => {
  // Local previews, other hosts, and embedded demos must not inflate site traffic.
  if (location.hostname !== "everywheresafety.github.io" || window.self !== window.top) return;
  if (window.__everywhereSafetyAnalytics) return;
  window.__everywhereSafetyAnalytics = true;

  const measurementId = "G-91FRVY1271";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // CKA-Agent and TurnGate already load gtag.js for their own destinations.
  // Reuse that library and queue, while retaining both project configurations.
  if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')) {
    window.gtag("js", new Date());
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }
  // One config sends the initial pageview. GA4 Enhanced Measurement handles
  // History API navigation; do not also emit manual page_view events here.
  window.gtag("config", measurementId);
})();
