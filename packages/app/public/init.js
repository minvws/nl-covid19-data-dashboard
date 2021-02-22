(function () {
  /**
   * Detect javascript
   */
  try {
    window.document.documentElement.classList.remove('has-no-js');
  } catch (err) {
    /** */
  }

  /**
   * Detect webp support
   */
  try {
    var webp = new Image();
    webp.onload = function () {
      window.document.documentElement.classList.add('has-webp-support');
    };
    webp.src =
      'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';
  } catch (err) {
    /** */
  }

  /**
   * load piwik
   */
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
})();
