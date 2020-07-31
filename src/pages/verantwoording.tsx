import Head from 'next/head';

import { FormattedMessage } from 'react-intl';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './over.module.scss';
import ReplaceLinks from 'components/replaceLinks';

import verantwoording from 'data/verantwoording.json';

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
            <h2>
              <FormattedMessage id="verantwoording.title" />
            </h2>
            <p>
              <FormattedMessage defaultMessage="In dit dashboard staan verschillende cijfers die ons vertellen hoe het ervoor staat met beheersen van COVID-19. Op deze plek geven we meer toelichting over de wijze waarop de cijfers zijn samengesteld." />
            </p>
            <dl className={styles.faqList}>
              {verantwoording.map((item: ICijfer) => (
                <>
                  <dt>{item.cijfer}</dt>
                  <dd>
                    <ReplaceLinks>{item.verantwoording}</ReplaceLinks>
                  </dd>
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
