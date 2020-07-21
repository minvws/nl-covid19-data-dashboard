import Head from 'next/head';

import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale/nl.json';
import styles from './over.module.scss';
import ReplaceLinks from 'components/replaceLinks';

import openGraphImage from 'assets/sharing/og-cijferverantwoording.png?url';
import twitterImage from 'assets/sharing/twitter-cijferverantwoording.png?url';

Verantwoording.getLayout = Layout.getLayout({
  ...text.verantwoording_metadata,
  openGraphImage,
  twitterImage,
});

export default function Verantwoording() {
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
            <h2>{text.verantwoording.title.translation}</h2>
            <dl className={styles.faqList}>
              {text.verantwoording.cijfers.map((item) => (
                <>
                  <dt>{item.cijfer.translation}</dt>
                  <dd>
                    <ReplaceLinks>
                      {item.verantwoording.translation}
                    </ReplaceLinks>
                  </dd>
                </>
              ))}
            </dl>
          </div>
        </MaxWidth>
      </div>
    </>
  );
}
