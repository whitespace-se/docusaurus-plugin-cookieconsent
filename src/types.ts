export interface CookieConsentConfig {
  /** Position of the cookie consent banner */
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Cookie expiration in days (default: 365) */
  cookieExpiration?: number;

  /** Cookie name for storing consent (default: 'cookie_consent_accepted') */
  consentCookieName?: string;

  /** Cookie name for storing denial (default: 'cookie_consent_denied') */
  deniedCookieName?: string;

  /** Auto-hide banner after consent/denial (default: true) */
  autoHide?: boolean;


  /** Localized content */
  content: {
    [locale: string]: {
      title: string;
      description: string;
      allowText: string;
      denyText: string;
      linkText?: string;
      linkUrl?: string;
    };
  };

}

export interface CookieConsentPluginOptions extends CookieConsentConfig {
  /** Enable/disable the plugin (default: true, disabled in development unless debug is true) */
  enabled?: boolean;

  /** Enable debug mode for development testing (default: false) */
  debug?: boolean;
}

declare global {
  interface Window {
    _paq?: any[][];
    _mtm?: any[];
    cookieConsent?: {
      accept: () => void;
      deny: () => void;
      isAccepted: () => boolean;
      isDenied: () => boolean;
      checkVisibility: () => void;
    };
  }
}