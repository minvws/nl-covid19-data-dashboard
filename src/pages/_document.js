import Document, { Html, Head, Main, NextScript } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const sprites = sprite.stringify();
    return { sprites, ...initialProps };
  }

  render() {
    return (
      <Html lang="nl-NL">
        <Head />
        <body>
          <Main />

          <div dangerouslySetInnerHTML={{ __html: this.props.sprites }} />

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
