export const cookieConsentCallbacks = {
  onAccept: () => {
    console.log("User accepted cookies");
    // Enable Matomo tracking with cookies
    if (typeof window !== "undefined" && window._paq) {
      const _paq = window._paq;
      _paq.push(["rememberCookieConsentGiven"]);
      _paq.push(["setCookieConsentGiven"]);
      // Track current page with cookies enabled
      _paq.push(["trackPageView"]);
    }
  },
  onDeny: () => {
    console.log("User denied cookies");
    // Keep Matomo cookies disabled
    if (typeof window !== "undefined" && window._paq) {
      const _paq = window._paq;
      _paq.push(["forgetCookieConsentGiven"]);
      _paq.push(["requireCookieConsent"]);
    }
  },
};