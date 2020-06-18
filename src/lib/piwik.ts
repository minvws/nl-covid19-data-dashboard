declare global {
  interface Window {
    _paq: any;
  }
}

window._paq = window._paq || {};

export const pageview = (url: string, documentTitle: string) => {
  window._paq.push(['setCustomUrl', '/' + url]);
  window._paq.push(['setDocumentTitle', documentTitle]);
  window._paq.push(['trackPageView']);
};

type EventTypes = {
  category: string;
  action: string;
  name: string;
  value: number;
  dimensions: any;
};

export function event(eventOptions: EventTypes) {
  const { category, action, name, value, dimensions } = eventOptions;
  window._paq.push(['trackEvent', category, action, name, value, dimensions]);
}
