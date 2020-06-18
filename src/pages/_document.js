import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="nl-NL">
        <Head />

        <body>
          <Main />

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
              
              var _paq = _paq || [];
              _paq.push(["setCookieDomain", "*.rijksoverheid.nl"]);
              _paq.push(["setDomains", ["*.rijksoverheid.nl"]]);
              _paq.push(['enableHeartBeatTimer', 10]);
              _paq.push(['setLinkTrackingTimer', 750]);
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);

              (function() {
                var u="//statistiek.rijksoverheid.nl/piwik/";
                _paq.push(['setTrackerUrl', u+'piwik.php']);
                _paq.push(['setSiteId', '7939']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
              })();
          `,
            }}
          />

          <noscript>
            <img
              src="https://statistiek.rijksoverheid.nl/piwik/piwik.php?idsite=7939&rec=1"
              style="border:0"
              alt=""
            />
          </noscript>

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
