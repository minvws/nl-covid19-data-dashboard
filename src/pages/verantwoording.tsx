import Head from 'next/head';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './over.module.scss';

import MDToHTMLString from 'utils/MDToHTMLString';

import openGraphImage from 'assets/sharing/og-cijferverantwoording.png?url';
import twitterImage from 'assets/sharing/twitter-cijferverantwoording.png?url';

interface ICijfer {
  cijfer: string;
  verantwoording: string;
}

const Verantwoording: FunctionComponentWithLayout = () => {
  return (
    <>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            <h2>{text.verantwoording.title}</h2>
            <p>{text.verantwoording.paragraaf}</p>
            <dl className={styles.faqList}>
              {text.verantwoording.cijfers.map((item: ICijfer) => (
                <>
                  <dt>{item.cijfer}</dt>
                  <dd
                    dangerouslySetInnerHTML={{
                      __html: MDToHTMLString(item.verantwoording),
                    }}
                  ></dd>
                </>
              ))}
            </dl>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Verantwoording.getLayout = Layout.getLayout({
  ...text.verantwoording_metadata,
  openGraphImage,
  twitterImage,
});

export default Verantwoording;
