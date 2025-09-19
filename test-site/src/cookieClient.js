import { cookieConsentCallbacks } from './cookieCallbacks';

// Register callbacks globally so the cookie consent component can access them
if (typeof window !== 'undefined') {
  window.cookieConsentCallbacks = cookieConsentCallbacks;
}

export default {
  onRouteDidUpdate() {
    // Ensure callbacks are available on route updates
    if (typeof window !== 'undefined') {
      window.cookieConsentCallbacks = cookieConsentCallbacks;
    }
  },
};