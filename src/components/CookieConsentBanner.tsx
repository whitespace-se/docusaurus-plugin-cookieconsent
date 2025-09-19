import React, { useState, useEffect } from 'react';
import type { CookieConsentConfig } from '../types';
import styles from './CookieConsentBanner.module.css';

// Import callbacks if they exist
let cookieCallbacks: any = null;
try {
  if (typeof window !== 'undefined') {
    cookieCallbacks = (window as any).cookieConsentCallbacks;
  }
} catch (e) {
  // Callbacks not available
}

interface CookieConsentBannerProps {
  config: CookieConsentConfig;
}

export default function CookieConsentBanner({ config }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [locale, setLocale] = useState('en');

  const {
    position = 'bottom-left',
    cookieExpiration = 365,
    consentCookieName = 'cookie_consent_accepted',
    deniedCookieName = 'cookie_consent_denied',
    content,
  } = config;

  useEffect(() => {
    const currentLocale = document.documentElement.lang || 'en';
    setLocale(currentLocale);

    if (shouldShowBanner()) {
      setIsVisible(true);
    }
  }, []);

  const getCookie = (name: string): string | null => {
    const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return v ? v[2] : null;
  };

  const setCookie = (name: string, value: string, days: number): void => {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}`;
  };

  const shouldShowBanner = (): boolean => {
    return getCookie(consentCookieName) === null && getCookie(deniedCookieName) === null;
  };

  const handleAccept = (): void => {
    setCookie(consentCookieName, 'true', cookieExpiration);

    // Call global callback if available
    if (typeof window !== 'undefined' && (window as any).cookieConsentCallbacks?.onAccept) {
      (window as any).cookieConsentCallbacks.onAccept();
    }

    setIsVisible(false);
  };

  const handleDeny = (): void => {
    setCookie(deniedCookieName, 'true', cookieExpiration);

    // Call global callback if available
    if (typeof window !== 'undefined' && (window as any).cookieConsentCallbacks?.onDeny) {
      (window as any).cookieConsentCallbacks.onDeny();
    }

    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const localeContent = content[locale] || content['en'] || content[Object.keys(content)[0]];

  if (!localeContent) {
    console.warn('Cookie consent: No content found for locale', locale);
    return null;
  }

  const getPositionClass = (position: string): string => {
    const positionMap: { [key: string]: string } = {
      'top': styles.cookieConsentPositionTop,
      'bottom': styles.cookieConsentPositionBottom,
      'top-left': styles.cookieConsentPositionTopLeft,
      'top-right': styles.cookieConsentPositionTopRight,
      'bottom-left': styles.cookieConsentPositionBottomLeft,
      'bottom-right': styles.cookieConsentPositionBottomRight,
    };
    return positionMap[position] || styles.cookieConsentPositionBottomLeft;
  };

  return (
    <div
      className={`card ${styles.cookieConsentBanner} ${getPositionClass(position)}`}
      role="region"
      aria-live="polite"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div role="document" className="card__body" tabIndex={0}>
        <h3 id="cookie-consent-title">
          {localeContent.title}
        </h3>

        <div id="cookie-consent-description">
          <p className={styles.cookieConsentDescription}>
            {localeContent.description}
            {localeContent.linkUrl && localeContent.linkText && (
              <>
                {' '}
                <a href={localeContent.linkUrl}>
                  {localeContent.linkText}
                </a>
              </>
            )}
          </p>
        </div>

        <div className={styles.cookieConsentButtonGroup}>
          <button
            className="button button--secondary button--sm"
            type="button"
            onClick={handleDeny}
          >
            {localeContent.denyText}
          </button>

          <button
            className="button button--primary button--sm"
            type="button"
            onClick={handleAccept}
          >
            {localeContent.allowText}
          </button>
        </div>
      </div>
    </div>
  );
}

function getPositionStyles(position: string): React.CSSProperties {
  const styles: { [key: string]: React.CSSProperties } = {
    'top': { top: 0, left: '50%', transform: 'translateX(-50%)' },
    'bottom': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
  };

  return styles[position] || styles['bottom-left'];
}