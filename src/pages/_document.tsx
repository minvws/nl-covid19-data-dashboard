import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { getLocale } from '~/utils/getLocale';

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

  render(): React.ReactElement {
    const locale = getLocale();

    return (
      <Html lang={locale} className="has-no-js">
        <Head />
        <body>
          <Main />

          <script src="/piwik.js"></script>

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
