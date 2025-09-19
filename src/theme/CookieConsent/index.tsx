import React, { useEffect, useState } from 'react';
import CookieConsentBanner from '../../components/CookieConsentBanner';

declare global {
  interface Window {
    __COOKIE_CONSENT_CONFIG__?: any;
  }
}

export default function CookieConsent(): JSX.Element | null {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setConfig(window.__COOKIE_CONSENT_CONFIG__);
    }
  }, []);

  if (!config) {
    return null;
  }


  return (
    <div id="cookie-consent-banner">
      <CookieConsentBanner config={config} />
    </div>
  );
}