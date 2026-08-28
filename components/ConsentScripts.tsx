"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const COOKIE_KEY = "ipocraft_cookies_accepted";
const PREFS_KEY = "ipocraft_cookie_prefs";
export const CONSENT_UPDATED_EVENT = "ipocraft-consent-updated";

interface CookiePrefs {
  analytics: boolean;
  advertising: boolean;
}

function readConsent(): CookiePrefs {
  try {
    const accepted = localStorage.getItem(COOKIE_KEY);
    // No decision made yet — default to off until the user actually consents.
    if (!accepted) return { analytics: false, advertising: false };
    const saved = localStorage.getItem(PREFS_KEY);
    if (!saved) return { analytics: true, advertising: true }; // legacy "Accept All" with no stored prefs
    const parsed = JSON.parse(saved);
    return {
      analytics: parsed.analytics !== false,
      advertising: parsed.advertising !== false,
    };
  } catch {
    return { analytics: false, advertising: false };
  }
}

/**
 * Loads Google Analytics / AdSense scripts only after the user has actually
 * granted consent via CookieConsentBanner, and re-evaluates live (no reload
 * needed) when the banner dispatches CONSENT_UPDATED_EVENT.
 */
export default function ConsentScripts() {
  const [consent, setConsent] = useState<CookiePrefs>({ analytics: false, advertising: false });

  useEffect(() => {
    setConsent(readConsent());
    const handler = () => setConsent(readConsent());
    window.addEventListener(CONSENT_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  return (
    <>
      {consent.analytics && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-V2DGFHC1DY"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-V2DGFHC1DY', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {adsenseEnabled && consent.advertising && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4829097668877345"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          id="google-adsense"
        />
      )}
    </>
  );
}
