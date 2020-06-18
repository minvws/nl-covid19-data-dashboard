export const pageview = (url) => {
  _paq.push(['trackPageView']);
};

export const event = ({ category, action, name, value, dimensions }) => {
  _paq.push(['trackEvent', category, action, name, value, dimensions]);
};
