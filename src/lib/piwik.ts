/* eslint-disable no-console */
declare global {
  interface Window {
    _paq: any;
  }
}
// client-side-only code
if (process.browser) {
  if (window) {
    window._paq = window._paq || {};
  }
}

export const pageview = (url: string, documentTitle: string): void => {
  if (process.browser) {
    if (window) {
      window._paq.push(['setCustomUrl', '/' + url]);
      window._paq.push(['setDocumentTitle', documentTitle]);
      window._paq.push(['trackPageView']);
    } else {
      console.log('window object not found');
    }
  }
};

type EventTypes = {
  category: string;
  action: string;
  name: string;
  value: number;
  dimensions: any;
};

export function event(eventOptions: EventTypes): void {
  const { category, action, name, value, dimensions } = eventOptions;
  if (process.browser) {
    if (window) {
      window._paq.push([
        'trackEvent',
        category,
        action,
        name,
        value,
        dimensions,
      ]);
    } else {
      console.log('no window object found');
    }
  }
}
