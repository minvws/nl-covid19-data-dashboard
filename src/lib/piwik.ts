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

type PageviewProps = {
  url?: string;
  documentTitle?: string;
};

export const pageview = (props: PageviewProps): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { url, documentTitle } = props;

  if (process.browser) {
    if (window) {
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
