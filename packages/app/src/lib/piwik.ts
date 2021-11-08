const isBrowser = typeof window !== 'undefined';

/* eslint-disable no-console */
declare global {
  interface Window {
    _paq: any;
  }
}
// client-side-only code
if (isBrowser) {
  window._paq = window._paq || {};
}

export const pageview = (): void => {
  if (isBrowser) {
    if (window?._paq?.push) {
      window._paq.push(['trackPageView']);
    } else {
      console.log('window object not found');
    }
  }
};

type EventTypes = {
  category: string;
  action: string;
  name?: string;
  value?: number;
  dimensions?: any;
};

export function event(eventOptions: EventTypes): void {
  const { category, action, name, value, dimensions } = eventOptions;
  if (isBrowser) {
    if (window?._paq?.push) {
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
