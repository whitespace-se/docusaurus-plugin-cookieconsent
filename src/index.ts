import type { LoadContext, Plugin } from '@docusaurus/types';
import type { CookieConsentPluginOptions } from './types';
import * as path from 'path';

export default function pluginCookieConsent(
  _context: LoadContext,
  options: CookieConsentPluginOptions
): Plugin<void> {
  const {
    position = 'bottom-left',
    cookieExpiration = 365,
    consentCookieName = 'cookie_consent_accepted',
    deniedCookieName = 'cookie_consent_denied',
    autoHide = true,
    content,
    enabled = true,
    debug = false,
  } = options;

  if (!content) {
    console.warn('Cookie Consent plugin: content configuration is required');
    return { name: 'docusaurus-plugin-cookieconsent' };
  }

  const isProd = process.env.NODE_ENV === 'production';
  const shouldShow = (isProd || debug) && enabled;

  return {
    name: 'docusaurus-plugin-cookieconsent',


    getThemePath() {
      return shouldShow ? path.resolve(__dirname, './theme') : '';
    },

    injectHtmlTags() {
      if (!shouldShow) {
        return {};
      }

      const configScript = `
        window.__COOKIE_CONSENT_CONFIG__ = ${JSON.stringify({
          position,
          cookieExpiration,
          consentCookieName,
          deniedCookieName,
          autoHide,
          content,
        })};
      `;

      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: configScript,
          },
        ],
      };
    },
  };
}



export type { CookieConsentPluginOptions } from './types';