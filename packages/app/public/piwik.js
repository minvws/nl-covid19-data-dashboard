var _paq = _paq || [];
_paq.push(['setLinkTrackingTimer', 750]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);

(function () {
  var u = '//statistiek.rijksoverheid.nl/piwik/';
  _paq.push(['setTrackerUrl', u + 'piwik.php']);
  _paq.push(['setSiteId', '7939']);
  var d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0];
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = u + 'piwik.js';
  s.parentNode.insertBefore(g, s);
})();
