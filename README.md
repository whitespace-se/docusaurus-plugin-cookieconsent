# @whitespace-se/docusaurus-plugin-cookieconsent

A cookie consent plugin for Docusaurus with flexible analytics integration support.

## Installation

```bash
npm install @whitespace-se/docusaurus-plugin-cookieconsent
```

## Usage

Add the plugin to your `docusaurus.config.js`:

```js
module.exports = {
  plugins: [
    [
      '@whitespace-se/docusaurus-plugin-cookieconsent',
      {
        content: {
          en: {
            title: 'We use cookies',
            description: 'This website uses cookies to enhance your browsing experience and provide personalized content.',
            allowText: 'Accept all cookies',
            denyText: 'Decline',
            linkText: 'Learn more about our privacy policy',
            linkUrl: '/privacy-policy'
          }
        },
        position: 'bottom-left',
        debug: true
      }
    ]
  ],

  // Add client modules for callback handling
  clientModules: [
    require.resolve('./src/cookieClient.js'),
  ],
};
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `object` | **required** | Localized content for the banner |
| `position` | `string` | `'bottom-left'` | Banner position: `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `cookieExpiration` | `number` | `365` | Cookie expiration in days |
| `consentCookieName` | `string` | `'cookie_consent_accepted'` | Name of consent cookie |
| `deniedCookieName` | `string` | `'cookie_consent_denied'` | Name of denial cookie |
| `autoHide` | `boolean` | `true` | Auto-hide banner after consent/denial |
| `enabled` | `boolean` | `true` | Enable/disable the plugin |
| `debug` | `boolean` | `false` | Show banner in development mode |

## Content Configuration

The `content` object should contain localized strings for each supported language:

```js
content: {
  en: {
    title: 'We use cookies',
    description: 'This website uses cookies to enhance your browsing experience and provide personalized content.',
    allowText: 'Accept all cookies',
    denyText: 'Decline',
    linkText: 'Learn more about our privacy policy', // optional
    linkUrl: '/privacy-policy' // optional
  },
  sv: {
    title: 'Vi använder cookies',
    description: 'Denna webbplats använder cookies för att förbättra din upplevelse.',
    allowText: 'Acceptera alla cookies',
    denyText: 'Avvisa',
    linkText: 'Läs mer om vår integritetspolicy',
    linkUrl: '/integritet'
  }
}
```

## Custom Callbacks

To handle cookie consent/denial events (e.g., for analytics integration), create callback functions using client modules:

### 1. Create callback functions

Create a file `src/cookieCallbacks.js`:

```js
export const cookieConsentCallbacks = {
  onAccept: () => {
    console.log("User accepted cookies");
    // Enable your analytics/tracking here
    // Example for Matomo:
    if (typeof window !== "undefined" && window._paq) {
      const _paq = window._paq;
      _paq.push(["rememberCookieConsentGiven"]);
      _paq.push(["setCookieConsentGiven"]);
      _paq.push(["trackPageView"]);
    }
  },
  onDeny: () => {
    console.log("User denied cookies");
    // Disable your analytics/tracking here
    // Example for Matomo:
    if (typeof window !== "undefined" && window._paq) {
      const _paq = window._paq;
      _paq.push(["forgetCookieConsentGiven"]);
      _paq.push(["requireCookieConsent"]);
    }
  },
};
```

### 2. Create client module

Create a file `src/cookieClient.js`:

```js
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
```

### 3. Register client module in config

Add the client module to your `docusaurus.config.js`:

```js
module.exports = {
  plugins: [
    [
      '@whitespace-se/docusaurus-plugin-cookieconsent',
      {
        content: {
          en: {
            title: 'We use cookies',
            description: 'This website uses cookies to enhance your browsing experience.',
            allowText: 'Accept all cookies',
            denyText: 'Decline',
          }
        },
        debug: true, // Show banner in development
      }
    ]
  ],

  // Register your callback client module
  clientModules: [
    require.resolve('./src/cookieClient.js'),
  ],
};
```

## Integration with Analytics

This plugin works with any analytics solution through the callback system:

- **Matomo**: Use `_paq.push()` commands in callbacks
- **Google Analytics**: Use `gtag()` functions in callbacks
- **Custom Analytics**: Implement your own tracking logic

## License

MIT