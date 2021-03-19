import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    /**
     * Code taken from https://medium.com/swlh/server-side-rendering-styled-components-with-nextjs-1db1353e915e
     */
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang={locale} className="has-no-js">
        <Head>
          <script src="/init.js" />
          {/**
           * Because we add the nomodule attribute polyfill.io is only called on IE11
           * IE11 will never complain about CSP policies, and modern browsers don't
           * need to load the polyfills.
           *
           * IMPORTANT:
           * This polyfill only loads for IE11.
           * Other polyfills should be imported in _app.ts!
           * */}
          <script
            noModule
            src="https://polyfill.io/v3/polyfill.js?features=Intl.~locale.en,Intl.~locale.nl%2CDate.now%2CDate.prototype.toISOString%2CIntl.DateTimeFormat%2CIntl.DateTimeFormat.prototype.formatToParts%2CIntl.getCanonicalLocales"
          />
          <Fonts />
        </Head>
        <body>
          <Main />

          <noscript>
            <img
              src="https://statistiek.rijksoverheid.nl/piwik/piwik.php?idsite=7939&rec=1"
              style={{ border: 0 }}
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

function Fonts() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
@font-face {
  font-family: 'RO Sans';
  font-weight: normal;
  font-style: normal;
  src: url('/webfonts/RO-SansWebText-Regular.woff2') format('woff2'),
    url('/webfonts/RO-SansWebText-Regular.woff') format('woff');
  font-display: swap;
}

@font-face {
  font-family: 'RO Sans';
  font-weight: normal;
  font-style: italic;
  src: url('/webfonts/RO-SansWebText-Italic.woff2') format('woff2'),
    url('/webfonts/RO-SansWebText-Italic.woff') format('woff');
  font-display: swap;
}

@font-face {
  font-family: 'RO Sans';
  font-weight: bold;
  font-style: normal;
  src: url('/webfonts/RO-SansWebText-Bold.woff2') format('woff2'),
    url('/webfonts/RO-SansWebText-Bold.woff') format('woff');
  font-display: swap;
}
      `.trim(),
      }}
    />
  );
}
